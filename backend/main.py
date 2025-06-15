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
from pydantic import BaseModel
from typing import List

# sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'cong-nghe-loi', 'read_file', 'src')))
# from engine import file_to_json
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from pdf_masker import utils  # if `utils.py` defines functions/classes

app = FastAPI()

origins = [
    "*"
]

delay_time = 300



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

@app.post("/pdf/upload")
async def upload_file(myFile: UploadFile = File(...)):
    print("ass")
    salt = random.randint(1, 1000000)
    file_path = f"cached_file/{salt}{myFile.filename}"
    
    ## save file to disk
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(myFile.file, buffer)
        
    delete_file_in_background(file_path, delay=delay_time)
    
    ## process file
    content = utils.get_content(file_path)
    pii_words = utils.get_pii_words(content)
    print(f"PII words found: {pii_words}")
    images_info = utils.extract_images(file_path)
    #dont send image key in inmage_info
    images_info = [{"page": img["page"], "bbox": img["bbox"]} for img in images_info]

    return {
        "file_path": file_path,
        "pii_words": pii_words,  # Placeholder for PII words, if needed
        # "image_infos": images_info,  # Placeholder for image information
    }

class BlackenWordsRequest(BaseModel):
    file_path: str
    words: List[dict]

@app.post("/pdf/blacken_words")
async def blacken_words(req: BlackenWordsRequest):
    if not os.path.exists(req.file_path):
        return {"error": "File not found"}
    
    # Extract only the word field from each dictionary
    words = [word['word'] for word in req.words]
    
    flag = utils.blacken_words(req.file_path, f"blackened_words_{os.path.basename(req.file_path)}", words)
    if flag == 0:
        return {"error": "No words found to blacken"}

    return FileResponse(
        f"blackened_words_{os.path.basename(req.file_path)}",
        media_type='application/pdf',
        filename=f"blackened_words_{os.path.basename(req.file_path)}",
    )

# @app.post("/pdf/blacken_images")
# async def blacken_images(file_path: str, images_info):
#     """
#     Blackens images in a PDF file.
#     Args:
#         file_path (str): Path to the input PDF file.
#     Returns:
#         dict: Information about the blackened images and the output file path.
#     """
#     if not os.path.exists(file_path):
#         return {"error": "File not found"}
    
#     flag = utils.blacken_images(file_path, f"blackened_images_{os.path.basename(file_path)}", images_info)

#     if flag == 0:
#         return {"error": "No images found to blacken"}
    
#     return FileResponse(
#         f"blackened_images_{os.path.basename(file_path)}",
#         media_type='application/pdf',
#         filename=f"blackened_images_{os.path.basename(file_path)}",
#     )


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