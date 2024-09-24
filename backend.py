from typing import Union

from fastapi import FastAPI

import http.client

conn = http.client.HTTPSConnection("tripadvisor16.p.rapidapi.com")

app = FastAPI()

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
    'x-rapidapi-host': "tripadvisor16.p.rapidapi.com"
    }

    conn.request("GET", "/api/v1/flights/searchAirport?query=tennessee", headers=headers)
    res = conn.getresponse()
    data = res.read()
    return{data.decode("utf-8")}
