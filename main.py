from flask import Flask, request, jsonify, make_response, render_template, send_from_directory
from flask_cors import CORS
from google.cloud import datastore
from google.cloud import storage
from functools import wraps
import io
import requests
import json
import bcrypt
import jwt
import datetime
from cryptography.fernet import Fernet
import uuid

app = Flask(__name__, static_folder='frontend/dist', static_url_path='')
cors = CORS(app)
app.secret_key = "SECRET_KEY"
# app.secret_key = os.getenv('SECRET_KEY', 'default_secret_key')


client = datastore.Client(project='secure-password-manager-group')
key = b'n7vrXjnrltMFqEiTqR35GbqrDLrNaza_IFUhTgnPJa4='
fernet = Fernet(key)

ERROR_400 = {"Error": "Invalid Request"}
ERROR_401 = {"Error": "Unauthorized"}
ERROR_403 = {"Error": "You don't have permission on this resource"}
ERROR_404 = {"Error": "Not found"}

# Helper function to encrypt passwords
def encrypt(password):
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed

# Helper function to verify passwords
def verify_password(stored_password, provided_password):
    return bcrypt.checkpw(provided_password.encode('utf-8'), stored_password)

# Token required decorator
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'x-access-tokens' in request.headers:
            token = request.headers['x-access-tokens']
        if not token:
            #If token is not found return HTTP status code of 401 (Unauthorized).
            return jsonify(ERROR_401), 401
        try: # Decoding the Token:
            data = jwt.decode(token, app.secret_key, algorithms=["HS256"])
            current_user = get_user_by_public_id(data['public_id'])
            if current_user is None:
                return jsonify(ERROR_401), 401
        except jwt.ExpiredSignatureError:
            return jsonify({"message": "Token has expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify(ERROR_401), 401
        return f(current_user, *args, **kwargs)
    return decorated


# Helper function for def token_required() 
def get_user_by_public_id(public_id):
    query = client.query(kind="users")
    query.add_filter("public_id", "=", public_id)
    result = list(query.fetch())
    return result[0] if result else None


@app.route('/api/health')
def health():
    return jsonify({"status": "OK"}), 200
    

@app.route("/api/user", methods=["GET"])
@token_required
def get_user(current_user):
    return jsonify({"username": current_user['username']}), 200

@app.route('/api/login', methods=['POST'])
def login_user():
    content = request.get_json()
    if not content or not content.get('username') or not content.get('password'):
        return jsonify(ERROR_400), 400

    username = content['username']
    password = content['password']

    query = client.query(kind="users")
    query.add_filter("username", "=", username)
    users = list(query.fetch())

    #change to query of that kind so all those queries go through so that and it can find teh right one for that knd
    if not users or not verify_password(users[0]['password'], password):
        return jsonify(ERROR_400), 400
    
    user = users[0]
    user_id = user['public_id'] # Retrive the public_id for token generation

    token = jwt.encode({
        'public_id': user_id,
        'username': username,
        'exp': datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(minutes=30)
    }, app.secret_key, algorithm="HS256")
    
    return jsonify({'token': token}), 200   


# Create a new site user. Added to users table. 
@app.route('/api/signUp', methods=['POST'])
def sign_up_user():
    content = request.get_json()
    if not content or not content.get('username') or not content.get('password'):
        return jsonify(ERROR_400), 400
    
    username = content['username']
    password = encrypt(content['password'])


    # Check if username exists
    query = client.query(kind="users")
    query.add_filter("username", "=", username)
    username_taken = list(query.fetch())

    if username_taken:
        return jsonify({"Error": "User already exists"}), 400

    # Generate a unique public_id for the new user
    public_id = str(uuid.uuid4())

    db_key = client.key("users", public_id)    
    new_user = datastore.Entity(key=db_key)
    new_user.update({
        "username": username,
        "password": password,
        "public_id": public_id
    })
    client.put(new_user)
    return jsonify({"message": "User created successfully"}), 201


@app.route('/api/passwords', methods=['GET'])
@token_required
def get_passwords(current_user):
    # Filter credentials by user_id that matches the current user's public_id
    query = client.query(kind="credentials")
    query.add_filter("user_id", "=", current_user['public_id'])
    credentials = list(query.fetch())

    results = []
    for credential in credentials:
        result = {
            "id": credential.key.id, 
            "url": credential["url"],
            "username": credential["username"]
        }
        if "password" in credential:
            result["password"] = fernet.decrypt(credential["password"].decode()).decode("utf-8")
        else:
            result["password"] = None
        results.append(result)
    return jsonify(results), 200

@app.route("/api/passwords/<int:id>", methods=["GET"])
@token_required
def get_password_by_id(current_user, id):
    key = client.key("credentials", id)
    credential = client.get(key)

    # Use the public_id to verify ownserhip
    if not credential or credential["user_id"] != current_user['public_id']:
        return jsonify(ERROR_403), 403
        
    return jsonify(
        {
            "id": id,
            "url": credential["url"],
            "username": credential["username"],
            "password": fernet.decrypt(credential["password"].decode()).decode("utf-8"),
        }
    ), 200

# Add a new entry to the credentials table. User_id will equal the name/id
# from the users table
@app.route('/api/add', methods=['POST'])
@token_required
def add_password(current_user):
    content = request.get_json()
    if not content or 'username' not in content or 'password' not in content:
         return jsonify(ERROR_400), 400
    
    encrypted_pwd = fernet.encrypt(content["password"].encode())
    new_credential = datastore.Entity(key=client.key("credentials"))
    new_credential.update({
        "username": content["username"],
        "password": encrypted_pwd,
        "user_id": current_user['public_id'],  # Link the credentials table with the user id table
        "url": content["url"],
    })
    client.put(new_credential)
    return jsonify({"message": "Credential stored successfully"}), 201


@app.route('/api/delete/<int:id>', methods=['DELETE'])
@token_required
def delete_password(current_user, id):
    key = client.key("credentials", id)
    credential = client.get(key)

    # Use the public_id to verify ownership
    if not credential or credential["user_id"] != current_user['public_id']:
        return jsonify(ERROR_403), 403
    
    client.delete(key)
    return jsonify({"message": "Credential deleted successfully"}), 200


@app.route('/api/update/<int:id>', methods=['PATCH'])
@token_required
def update_password(current_user, id):
    content = request.get_json()
    key = client.key("credentials", id)
    credential = client.get(key)

    # Use the public_id to verify ownership
    if not credential or credential.get("user_id") != current_user["public_id"]:
        return jsonify(ERROR_403), 403

    if "username" in content:
        credential["username"] = content["username"]
    if "url" in content:
        credential["url"] = content["url"]
    if "password" in content:
        credential["password"] = fernet.encrypt(content["password"].encode())

    client.put(credential)
    return jsonify({"message": "Credential updated successfully"}), 200

@app.route('/')
def home():
    return send_from_directory(app.static_folder, 'index.html')


@app.route('/<path:path>')
def catch_all(path):
    return send_from_directory(app.static_folder, 'index.html')


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8080, debug=True)
