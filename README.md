
# Secure Password Manager

The Secure Password Manager is a browser-based web application that securely stores and manages users' passwords using Flask for the backend and React for the frontend. It includes endpoints for user authentication and password management.

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup and Installation](#setup-and-installation)
- [Running the Project Locally](#running-the-project-locally)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Project Overview

The Secure Password Manager helps users store and manage their passwords securely using client-side encryption. It aims to simplify password management while maintaining high security standards.

### Key Objectives
- **Security:** Implement robust encryption to protect user data.
- **Usability:** Provide an intuitive user interface for managing passwords.
- **Accessibility:** Ensure the application is accessible to users with disabilities.

## Features

- **User Authentication:** Secure login and signup functionality.
- **Password Management:** Add, view, update, and delete stored passwords.
- **Encryption:** All passwords are encrypted before storage.
- **Token-based Authentication:** Uses JWT for secure API access.
- **Accessibility:** Inclusive design principles to ensure accessibility for all users.
- **Compliance:** Adheres to GDPR and other data protection regulations.

## Tech Stack

- **Frontend:** TypeScript, React, Vite, Mantine, Zustand
- **Backend:** Python, Flask, Google Cloud Datastore
- **Other Tools:** Google Cloud Platform for hosting, Postman for API testing, bcrypt for password hashing, JWT for token-based authentication

## Project Structure

```
Secure-Password-Manager/
├── postman/
│   ├── SPM-collections.postman_collection.json
│   ├── SPM-Environments.postman_environment.json
├── static/
│   ├── script.js
│   ├── style.css
├── templates/
│   ├── index.html
├── app.yaml
├── main.py
├── requirements.txt
```

### Directory Breakdown
- **postman/**: Contains Postman collections and environment configurations for API testing.
- **static/**: Contains static files such as JavaScript and CSS.
- **templates/**: Contains HTML templates.
- **app.yaml**: Configuration file for Google App Engine.
- **main.py**: The main application file containing the Flask routes and logic.
- **requirements.txt**: Python dependencies.

## Setup and Installation

### Prerequisites
- Python 3.11 or higher
- Google Cloud SDK
- Virtual Environment

### Steps

1. **Clone the Repository:**
   ```
   git clone https://github.com/yourusername/Secure-Password-Manager.git
   cd Secure-Password-Manager
   ```

2. **Set Up Virtual Environment:**
   ```
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install Dependencies:**
   ```
   pip install -r requirements.txt
   ```

4. **Set Up Google Cloud SDK:**
   Follow the [Google Cloud SDK installation guide](https://cloud.google.com/sdk/docs/install) and authenticate.

5. **Configure Google Cloud Project:**
   ```
   gcloud init
   ```

## Running the Project Locally

1. **Start the Flask Application:**
   ```
   python main.py
   ```

2. **Access the Application:**
   Open your browser and navigate to `http://127.0.0.1:8080`.

## Usage

Refer to the [CRUD EndPoints documentation](CRUD_EndPoints.md) for detailed information on using the Create, Read, Update, and Delete (CRUD) endpoints.


### Add Password

- **URL:** `/add`
- **Method:** `POST`
- **Headers:**
  ```
  {
    "x-access-tokens": "your_jwt_token"
  }
  ```
- **Payload:**
  ```
  {
    "username": "service_username",
    "password": "service_password"
  }
  ```

### Get All Passwords

- **URL:** `/passwords/`
- **Method:** `GET`
- **Headers:**
  ```
  {
    "x-access-tokens": "your_jwt_token"
  }
  ```

### Update Password

- **URL:** `/update/<id>`
- **Method:** `PATCH`
- **Headers:**
  ```
  {
    "x-access-tokens": "your_jwt_token"
  }
  ```
- **Payload:**
  ```
  {
    "username": "new_service_username",
    "password": "new_service_password"
  }
  ```

### Delete Password

- **URL:** `/delete/<id>`
- **Method:** `DELETE`
- **Headers:**
  ```
  {
    "x-access-tokens": "your_jwt_token"
  }
  ```

## React Frontend Integration

Here's how you can integrate these endpoints with a React frontend.

### 1. Setup

Ensure you have a React project setup. You can use `create-react-app` to initialize a new project if you don't have one already:

```
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
  const [passwords, setPasswords

] = useState([]);

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

## Contributing

We welcome contributions from the community. Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting a pull request.
