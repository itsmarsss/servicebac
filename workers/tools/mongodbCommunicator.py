import warnings

warnings.filterwarnings("ignore")

import requests
import os
from dotenv import load_dotenv

load_dotenv()

base_url = os.getenv("LOCAL_DB_URI")

dummy_user = {
    "id": 1,
    "token": "dummy_token2",
    "email": "example3@example.com",
    "password": "password1234",
    "firstName": "John",
    "lastName": "Doe",
    "accountType": "company",
}


# Function to create users collection
def create_users_collection():
    url = f"{base_url}/create-users-collection"
    response = requests.post(url)
    return response.json()


# Function to query user by email
def query_user_by_email(email):
    url = f"{base_url}/user/email/{email}"
    response = requests.get(url)
    return response.json()


# Function to query user by token
def query_user_by_token(token):
    url = f"{base_url}/user/token/{token}"
    response = requests.get(url)
    return response.json()


# Function to query user by id
def query_user_by_id(user_id):
    url = f"{base_url}/user/id/{user_id}"
    response = requests.get(url)
    return response.json()


# Function to insert user
def insert_user(user_data):
    url = f"{base_url}/user/"
    response = requests.post(url, json=user_data)
    return response.json()


# Function to update user with token
def update_user_with_token(token, updated_data):
    url = f"{base_url}/user/token/{token}"
    response = requests.put(url, json=updated_data)
    return response.json()


if __name__ == "__main__":
    insert_user(dummy_user)
    # update_user_with_token(dummy_user.get("token"), dummy_user)
