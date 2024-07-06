from flask import Flask, request, jsonify
from google.cloud import datastore
from google.cloud import storage
import io

import requests
import json


app = Flask(__name__)
app.secret_key = 'SECRET_KEY'

client = datastore.Client()




ERROR_400 = {"Error": "Invalid Request"}
ERROR_401 = {"Error": "Unauthorized"}
ERROR_403 = {"Error": "You don't have permission on this resource"}
ERROR_404 = {"Error": "Not found"}


@app.route('/login', methods=['POST'])
def login_user():
    pass

@app.route('/signUp', methods=['POST'])
def sign_up_user():
    pass

@app.route('/passwords/' + '<int: id>', methods=['GET'])
def get_passwords():
    pass
    
@app.route('/add', methods=['POST'])
def add_password():
    pass

@app.route('/delete', methods=['DELETE'])
def delete_password():
    pass

@app.route('/update', methods=['PATCH'])
def update_password():
    pass


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8080, debug=True)
