import firebase_admin
from firebase_admin import credentials, firestore
from fastapi import FastAPI, HTTPException, Depends
from google.cloud import firestore
from typing import Dict
import os

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "/Users/janesun/Desktop/VandyFlights/core/security/service-account.json"
cred = credentials.Certificate(os.getenv("GOOGLE_APPLICATION_CREDENTIALS"))

print("GOOGLE_APPLICATION_CREDENTIALS:", os.getenv("GOOGLE_APPLICATION_CREDENTIALS"))
firebase_admin.initialize_app(cred)

def get_db():
    return firestore.Client()


db = get_db()
print("Firestore client initialized:", db)

def test_firestore_connection():
    try:
        docs = db.collection("test_collection").stream()
        for doc in docs:
            print(f"Document found: {doc.id} => {doc.to_dict()}")
        print("Firestore test query succeeded.")
    except Exception as e:
        print("Firestore test query failed:", e)

test_firestore_connection()