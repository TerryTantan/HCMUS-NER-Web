# from typing import Union
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import shutil
import sys
import os
import random
import time
import threading
from fastapi.responses import FileResponse
# sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'cong-nghe-loi', 'read_file', 'src')))
# from engine import file_to_json
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from pdf_masker import utils  # if `utils.py` defines functions/classes

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

@app.get("/pdf/upload")
async def upload_file(myFile: UploadFile = File(...)):
    salt = random.randint(1, 1000000)
    file_path = f"cached_file/{salt}{myFile.filename}"
    
    ## save file to disk
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(myFile.file, buffer)
        
    delete_file_in_background(file_path, delay=7200)
    
    ## process file
    content = utils.get_content(file_path)
    pii_words = utils.get_pii_words(content)
    images_info = utils.extract_images(file_path)

    return {
        "file_path": file_path,
        "pii_words": pii_words,
        "image_infos": images_info
    }

@app.post("/pdf/blacken_words")
async def blacken_words(file_path: str, words: list):
    """
    Blackens specified words in a PDF file.
    Args:
        file_path (str): Path to the input PDF file.
        words (list): List of words to blacken.
    Returns:
        dict: Information about the blackened words and the output file path.
    """
    if not os.path.exists(file_path):
        return {"error": "File not found"}
    
    flag = utils.blacken_words(file_path, f"blackened_words_{os.path.basename(file_path)}", words)
    if flag == 0:
        return {"error": "No words found to blacken"}

    return FileResponse(
        f"blackened_words_{os.path.basename(file_path)}",
        media_type='application/pdf',
        filename=f"blackened_words_{os.path.basename(file_path)}",
    )

@app.post("/pdf/blacken_images")
async def blacken_images(file_path: str, images_info):
    """
    Blackens images in a PDF file.
    Args:
        file_path (str): Path to the input PDF file.
    Returns:
        dict: Information about the blackened images and the output file path.
    """
    if not os.path.exists(file_path):
        return {"error": "File not found"}
    
    flag = utils.blacken_images(file_path, f"blackened_images_{os.path.basename(file_path)}", images_info)

    if flag == 0:
        return {"error": "No images found to blacken"}
    
    return FileResponse(
        f"blackened_images_{os.path.basename(file_path)}",
        media_type='application/pdf',
        filename=f"blackened_images_{os.path.basename(file_path)}",
    )


# @app.post("/pii/analyze")
# async def process_file(myFile: UploadFile = File(...)):
#     salt = random.randint(1, 1000000)
#     file_path = f"cached_file/{salt}{myFile.filename}"
    
#     ## save file to disk
#     with open(file_path, "wb") as buffer:
#         shutil.copyfileobj(myFile.file, buffer)
        
#     delete_file_in_background(file_path, delay=7200)
#     ## process file
#     res1, res2, flag = file_to_json(file_path)
    

#     return {
#         "file_path": file_path,
#         "res1": res1,
#         "res2": res2,
#         "flag": flag
#     }


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