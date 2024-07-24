# Password Management Endpoints Documentation

This document provides details about the API endpoints for managing passwords in the password manager application. The API supports Create, Read, Update, and Delete (CRUD) operations.

## Setting Up the Environment

Before you start, make sure you have all the necessary packages installed. Use a virtual environment to manage dependencies:

```sh
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## Flask Application Overview

The Flask application provides endpoints to handle user authentication and password management. Here's an overview of the main components:

- **`encrypt(password)`**: Encrypts a password using bcrypt.
- **`verify_password(stored_password, provided_password)`**: Verifies a password against the stored hash.
- **`token_required(f)`**: A decorator to ensure routes are accessed only with a valid token.

## Endpoints

### 1. User Authentication

#### Sign Up

- **Endpoint**: `/signUp`
- **Method**: `POST`
- **Description**: Registers a new user.
- **Request Body**:
    ```json
    {
      "username": "your_username",
      "password": "your_password"
    }
    ```
- **Response**:
  - Success:
    - Status: `201 Created`
    - Message: 
      ```json
      {"message": "User created successfully"}
      ```
  - Error:
    - Status: `400 Bad Request`
    - Message:
      ```json
      {"Error": "Invalid Request"}
      ```
    - Status: `400 Bad Request`
    - Message:
      ```json
      {"Error": "User already exists"}
      ```

#### Login

- **Endpoint**: `/login`
- **Method**: `POST`
- **Description**: Logs in a user and returns a JWT token.
- **Request Body**:
    ```json
    {
      "username": "your_username",
      "password": "your_password"
    }
    ```
- **Response**:
  - Success:
    - Status: `200 OK`
    - Message: 
      ```json
      {"token": "JWT_TOKEN"}
      ```
  - Error:
    - Status: `400 Bad Request`
    - Message:
      ```json
      {"Error": "Invalid Request"}
      ```
    - Status: `401 Unauthorized`
    - Message:
      ```json
      {"Error": "Unauthorized"}
      ```

### 2. Password Management

#### Get All Passwords

- **Endpoint**: `/passwords/`
- **Method**: `GET`
- **Description**: Retrieves all stored passwords for the authenticated user.
- **Headers**: `x-access-tokens: <JWT_TOKEN>`
- **Response**:
  - Success:
    - Status: `200 OK`
    - Message: 
      ```json
      [
        { "id": "credential_id", "username": "service_username", "password": "service_password" },
        ...
      ]
      ```
  - Error:
    - Status: `401 Unauthorized`
    - Message:
      ```json
      {"Error": "Unauthorized"}
      ```

#### Add Password

- **Endpoint**: `/add`
- **Method**: `POST`
- **Description**: Adds a new password entry.
- **Headers**: `x-access-tokens: <JWT_TOKEN>`
- **Request Body**:
    ```json
    {
      "username": "service_username",
      "password": "service_password"
    }
    ```
- **Response**:
  - Success:
    - Status: `201 Created`
    - Message: 
      ```json
      {"message": "Credential stored successfully"}
      ```
  - Error:
    - Status: `401 Unauthorized`
    - Message:
      ```json
      {"Error": "Unauthorized"}
      ```

#### Update Password

- **Endpoint**: `/update/<int:id>`
- **Method**: `PATCH`
- **Description**: Updates an existing password entry.
- **Headers**: `x-access-tokens: <JWT_TOKEN>`
- **Request Body**:
    ```json
    {
      "username": "new_service_username",
      "password": "new_service_password"
    }
    ```
- **Response**:
  - Success:
    - Status: `200 OK`
    - Message: 
      ```json
      {"message": "Credential updated successfully"}
      ```
  - Error:
    - Status: `401 Unauthorized`
    - Message:
      ```json
      {"Error": "Unauthorized"}
      ```
    - Status: `403 Forbidden`
    - Message:
      ```json
      {"Error": "You don't have permission on this resource"}
      ```

#### Delete Password

- **Endpoint**: `/delete/<int:id>`
- **Method**: `DELETE`
- **Description**: Deletes an existing password entry.
- **Headers**: `x-access-tokens: <JWT_TOKEN>`
- **Response**:
  - Success:
    - Status: `200 OK`
    - Message: 
      ```json
      {"message": "Credential deleted successfully"}
      ```
  - Error:
    - Status: `401 Unauthorized`
    - Message:
      ```json
      {"Error": "Unauthorized"}
      ```
    - Status: `403 Forbidden`
    - Message:
      ```json
      {"Error": "You don't have permission on this resource"}
      ```

## React Frontend Integration

Here's how you can integrate these endpoints with a React frontend.

### 1. Setup

Ensure you have a React project setup. You can use `create-react-app` to initialize a new project if you don't have one already:

```sh
npx create-react-app secure-password-manager
cd secure-password-manager
npm start
```

### 2. API Service

Create an `api.js` file to manage API requests:

```javascript
// src/api.js
const API_URL = 'http://127.0.0.1:8080';

export const login = async (username, password) => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  });
  return response.json();
};

export const signUp = async (username, password) => {
  const response = await fetch(`${API_URL}/signUp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  });
  return response.json();
};

export const getPasswords = async (token) => {
  const response = await fetch(`${API_URL}/passwords/`, {
    method: 'GET',
    headers: {
      'x-access-tokens': token
    }
  });
  return response.json();
};

export const addPassword = async (token, username, password) => {
  const response = await fetch(`${API_URL}/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-access-tokens': token
    },
    body: JSON.stringify({ username, password })
  });
  return response.json();
};

export const updatePassword = async (token, id, username, password) => {
  const response = await fetch(`${API_URL}/update/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'x-access-tokens': token
    },
    body: JSON.stringify({ username, password })
  });
  return response.json();
};

export const deletePassword = async (token, id) => {
  const response = await fetch(`${API_URL}/delete/${id}`, {
    method: 'DELETE',
    headers: {
      'x-access-tokens': token
    }
  });
  return response.json();
};
```

### 3. React Components

Here are some example components to demonstrate how you might use the API service in your React app.

#### Login Component

```javascript
// src/components/Login.js
import React, { useState } from 'react';
import { login } from '../api';

const Login = ({ setToken }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await login(username, password);
    if (response.token) {
      setToken(response.token);
    } else {
      alert('Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
```

#### Password List Component

```javascript
// src/components/PasswordList.js
import React, { useEffect, useState } from 'react';
import { getPasswords } from '../api';

const PasswordList = ({ token }) => {
  const [passwords, setPasswords] = useState([]);

  useEffect(() => {
    const fetchPasswords = async () => {
      const response = await getPasswords(token);
      setPasswords(response);
    };

    fetchPasswords();
  }, [token]);

  return (
    <ul>
      {passwords.map((password) => (
        <li key={password.id}>
          {password.username} - {password.password}
        </li>
      ))}
    </ul>
  );
};

export default PasswordList;
```

## Final Words

By following these steps, you can set up a secure password manager with a Flask backend and a React frontend. The API endpoints for creating, reading, updating, and deleting passwords are integrated with the frontend using fetch requests. Ensure you handle tokens securely and validate all inputs to maintain the security of your application.
