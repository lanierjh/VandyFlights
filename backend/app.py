from typing import Union

from fastapi import FastAPI

import http.client
import re

app = FastAPI()

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
    result = data.decode("utf-8")
    
    result = result.replace("\"","")
    finalresult = re.findall('suggestionTitle:' + r'[a-zA-Z\s\(\)\-]+', result)
    output = ""
    
    for results in finalresult:
        output += results
        output += ", "
    
    output = output[0:-2]
    
    finalout = output.replace("suggestionTitle:", "")

    print(finalout)
    return{finalout}