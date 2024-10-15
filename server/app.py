from typing import Union

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import http.client

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:8000",
    "http://localhost:3000",
    "http://your-frontend-domain.com",  # Add any other domains here
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # List of allowed origins
    allow_credentials=True,  # Whether to allow cookies and credentials
    allow_methods=["*"],  # List of allowed HTTP methods (GET, POST, etc.). Use ["*"] to allow all methods
    allow_headers=["*"],  # List of allowed headers. Use ["*"] to allow all headers
)

conn = http.client.HTTPSConnection("sky-scanner3.p.rapidapi.com")

@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}

@app.get("/flights")
def show_flights():

    headers = {
    'x-rapidapi-key': "6bed6c986cmshe33b94dc86bcd1fp1fff96jsnb3053b492c28",
    'x-rapidapi-host': "sky-scanner3.p.rapidapi.com"
    }

    conn.request("GET", "/flights/auto-complete?query=Tennessee", headers=headers)

    res = conn.getresponse()
    data = res.read()

    #print(data.decode("utf-8"))
    return{data}