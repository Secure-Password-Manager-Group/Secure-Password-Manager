from flask import Flask, request, jsonify, make_response, render_template
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

app = Flask(__name__)
app.secret_key = 'SECRET_KEY'
# app.secret_key = os.getenv('SECRET_KEY', 'default_secret_key')


client = datastore.Client(project='secure-password-manager-group')
key = Fernet.generate_key()
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
            current_user = client.get(client.key("users", data['public_id']))
            if current_user is None:
                return jsonify(ERROR_401), 401
        except jwt.ExpiredSignatureError:
            return jsonify({"message": "Token has expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify(ERROR_401), 401
        return f(current_user, *args, **kwargs)
    return decorated


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/login', methods=['POST'])
def login_user():
    content = request.get_json()
    if not content or not content.get('username') or not content.get('password'):
        return jsonify(ERROR_400), 400

    username = content['username']
    password = content['password']

    key = client.key("users", username)
    user = client.get(key)
    if not user or not verify_password(user['password'], password):
        return jsonify(ERROR_401), 401

    token = jwt.encode({
        'public_id': username,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=30)
    }, app.secret_key, algorithm="HS256")
    
    return jsonify({'token': token}), 200   


@app.route('/signUp', methods=['POST'])
def sign_up_user():
    content = request.get_json()
    if not content or not content.get('username') or not content.get('password'):
        return jsonify(ERROR_400), 400
    
    username = content['username']
    password = encrypt(content['password'])

    key = client.key("users", username)
    if client.get(key):
        return jsonify({"Error": "User already exists"}), 400
    
    new_user = datastore.Entity(key=key)
    new_user.update({
        "username": username,
        "password": password
    })
    client.put(new_user)
    return jsonify({"message": "User created successfully"}), 201


@app.route('/passwords/', methods=['GET'])
@token_required
def get_passwords(current_user):
    query = client.query(kind="credentials")
    query.add_filter("user_id", "=", current_user.key.name)
    credentials = list(query.fetch())
    results = []
    for credential in credentials:
        result = {
            "id": credential.key.id, 
            "username": credential["username"]}
        if "password" in credential:
            result["password"] = fernet.decypt(credential["password"].decode())
        else:
            result["password"] = None
        results.append(result)
    return jsonify(results), 200


@app.route('/add', methods=['POST'])
@token_required
def add_password(current_user):
    content = request.get_json()
    # if not content or 'username' not in content or 'password' not in content:
    #     return jsonify(ERROR_400), 400
    
    encrypted_pwd = fernet.encrypt(content["password"].encode())
    new_credential = datastore.Entity(key=client.key("credentials"))
    new_credential.update({
        "username": content["username"],
        "password": encrypted_pwd,
        "user_id": current_user.key.name,
    })
    client.put(new_credential)
    return jsonify({"message": "Credential stored successfully"}), 201


@app.route('/delete/<int:id>', methods=['DELETE'])
@token_required
def delete_password(current_user, id):
    key = client.key("credentials", id)
    credential = client.get(key)
    if not credential or credential["user_id"] != current_user.key.name:
        return jsonify(ERROR_403), 403
    
    client.delete(key)
    return jsonify({"message": "Credential deleted successfully"}), 200


@app.route('/update/<int:id>', methods=['PATCH'])
@token_required
def update_password(current_user, id):
    content = request.get_json()
    key = client.key("credentials", id)
    credential = client.get(key)
    if not credential or credential.get("user_id") != current_user.key.name:
        return jsonify(ERROR_403), 403

    if "username" in content:
        credential["username"] = content["username"]
    if "password" in content:
        credential["password"] = fernet.encrypt(content["password"].encode())

    client.put(credential)
    return jsonify({"message": "Credential updated successfully"}), 200


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8080, debug=True)
