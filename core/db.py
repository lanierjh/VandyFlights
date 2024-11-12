import json
import firebase_admin
from firebase_admin import credentials
from google.cloud import firestore
from google.oauth2 import service_account
from dotenv import load_dotenv
import os

# Load environment variables from env file
load_dotenv()
credentials_json = os.getenv("GOOGLE_APPLICATION_CREDENTIALS_JSON")
if not credentials_json:
    raise EnvironmentError("GOOGLE_APPLICATION_CREDENTIALS_JSON environment variable not set.")

# Parse the JSON string into a dictionary
credentials_dict = json.loads(credentials_json)

# Initialize Firebase Admin SDK with credentials from the JSON dictionary
cred = credentials.Certificate(credentials_dict)
firebase_admin.initialize_app(cred)

# Initialize Firestore client using Google OAuth credentials
firestore_credentials = service_account.Credentials.from_service_account_info(credentials_dict)

def get_db():
    return firestore.Client(credentials=firestore_credentials)

db = get_db()
print("Firestore client initialized:", db)

# Test Firestore connection
def test_firestore_connection():
    try:
        docs = db.collection("test_collection").stream()
        for doc in docs:
            print(f"Document found: {doc.id} => {doc.to_dict()}")
        print("Firestore test query succeeded.")
    except Exception as e:
        print("Firestore test query failed:", e)

test_firestore_connection()


# import json
# import firebase_admin
# from firebase_admin import credentials, firestore
# from fastapi import FastAPI, HTTPException, Depends
# from google.cloud import firestore
# from typing import Dict
# import os
# from dotenv import load_dotenv
#
# # Load environment variables from env file
# load_dotenv()
#
# credentials_json = os.getenv("GOOGLE_APPLICATION_CREDENTIALS_JSON")
# if not credentials_json:
#     raise EnvironmentError("GOOGLE_APPLICATION_CREDENTIALS_JSON environment variable not set.")
#
# credentials_dict = json.loads(credentials_json)
#
# # Initialize Firebase Admin SDK with credentials from the JSON dictionary
# cred = credentials.Certificate(credentials_dict)
# firebase_admin.initialize_app(cred)
#
# def get_db():
#     return firestore.Client()
#
#
# db = get_db()
# print("Firestore client initialized:", db)
#
# def test_firestore_connection():
#     try:
#         docs = db.collection("test_collection").stream()
#         for doc in docs:
#             print(f"Document found: {doc.id} => {doc.to_dict()}")
#         print("Firestore test query succeeded.")
#     except Exception as e:
#         print("Firestore test query failed:", e)
#
# test_firestore_connection()