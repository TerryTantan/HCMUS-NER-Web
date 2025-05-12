from typing import Union
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import shutil

app = FastAPI()

origins = [
    "http://localhost:5173",
]



app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"Hello": "World"}



@app.post("/")
async def process_file(myFile: UploadFile = File(...)):
    # Print file metadata
    print(f"File: {myFile.file}")

    ## Optionally, save file to disk
    with open(f"uploaded_{myFile.filename}", "wb") as buffer:
        shutil.copyfileobj(myFile.file, buffer)

    return {
        "filename": myFile.filename,
        "content_type": myFile.content_type
    }
