# from typing import Union
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import shutil
import sys
import os
import random
import time
import threading
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'cong-nghe-loi', 'read_file', 'src')))
from engine import file_to_json

app = FastAPI()

origins = [
    "*"
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
    salt = random.randint(1, 1000000)
    file_path = f"cached_file/{salt}{myFile.filename}"
    
    ## save file to disk
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(myFile.file, buffer)
        
    delete_file_in_background(file_path, delay=7200)
    ## process file
    res1, res2, flag = file_to_json(file_path)
    

    return {
        "file_path": file_path,
        "res1": res1,
        "res2": res2,
        "flag": flag
    }


def delete_file_after_delay(file_path, delay=300):
    # Wait for the specified delay (300 seconds = 5 minutes)
    time.sleep(delay)
    
    # Check if the file exists before attempting to delete
    if os.path.exists(file_path):
        os.remove(file_path)
        print(f"File {file_path} has been deleted.")
    else:
        print(f"File {file_path} does not exist.")

def delete_file_in_background(file_path, delay=300):
    # Create and start a background thread to handle the deletion
    deletion_thread = threading.Thread(target=delete_file_after_delay, args=(file_path, delay))
    deletion_thread.start()