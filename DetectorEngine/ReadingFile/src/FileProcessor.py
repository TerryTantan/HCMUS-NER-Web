import os
import sys
from docx import Document
import zipfile
import pymupdf
import easyocr
from PIL import Image
import numpy as np
import io
import time

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))
from ReadingFile.src.ReadingUtils import ConvertDocToPdf
from ReadingFile.src.TextExtractor import ExtractTextFromPdf, ExtractTextFromDocx  
from ReadingFile.src.FaceDetector import DetectFace 

def OcrExtractor(image_data, reader=None):
    startTime = time.time()
    
    if reader is None:
        reader = easyocr.Reader(['en'], gpu=False)  
    image = Image.open(io.BytesIO(image_data))
    image_np = np.array(image)
    
    has_face = DetectFace(image_np)
    
    ocr_results = reader.readtext(image_np, detail=0)
    ocr_text = " ".join(ocr_results).strip() if ocr_results else "No text detected in image"
    
    endTime = time.time()
    print(f"OCR time: {endTime - startTime}")
    
    return ocr_text, reader, has_face

def ProcessFile(file_path):
    if not os.path.exists(file_path):
        print(f"Error: File '{file_path}' does not exist.")
        return

    ext = os.path.splitext(file_path)[1].lower()
    file = None
    
    if ext == '.pdf':
        file, ocr = ProcessPdf(file_path)
    elif ext == '.docx':
        file, ocr = ProcessDocx(file_path)
    elif ext == '.doc':
        docx_path = ConvertDocToPdf(file_path)
        if docx_path:
            file, ocr = ProcessPdf(docx_path)
            try:
                os.remove(docx_path)
            except Exception as e:
                print(f"Warning: Could not delete temporary file {docx_path}: {e}")
    else:
        print(f"Error: Unsupported file format '{ext}'")

    return file, ocr

def ProcessPdf(pdf_path):
    try:
        doc = pymupdf.open(pdf_path)
        extracted_text = []
        ocr_results = []
        ocr_reader = None
        img_index = 0
        
        for page_num in range(len(doc)):
            page = doc.load_page(page_num)
            page_text = ExtractTextFromPdf(page)
            images = page.get_images(full=True)
            
            extracted_text.append(" ".join(page_text) if page_text else "No text found.")
            
            for img in images: 
                xref = img[0]
                try:
                    base_image = doc.extract_image(xref)
                    if base_image:  
                        ocr_text, ocr_reader, has_face = OcrExtractor(base_image["image"], ocr_reader)
                        ocr_results.append({
                            "page": page_num + 1,
                            "image_index": img_index,
                            "text": ocr_text,
                            "has_face": has_face
                        })
                        img_index += 1
                except Exception as img_error:
                    print(f"Error extracting image {xref} on page {page_num + 1}: {img_error}")
                    continue
        
        doc.close()
        return extracted_text, ocr_results
    
    except Exception as e:
        print(f"Error processing PDF: {e}")
        return [], []
    
def ProcessDocx(docx_path):
    try:
        doc = Document(docx_path)
        extracted_text = []
        ocr_results = []
        ocr_reader = None
        img_index = 0  
        
        page_text = ExtractTextFromDocx(doc)
        extracted_text.append(" ".join(page_text) if page_text else "No Text Found.")
        
        with zipfile.ZipFile(docx_path, 'r') as zip_ref:
            for file in zip_ref.namelist():
                if file.startswith('word/media/'):
                    with zip_ref.open(file) as img_file:
                        image_data = img_file.read()
                        ocr_text, ocr_readerreader , has_face = OcrExtractor(image_data, ocr_reader)
                        
                        ocr_results.append({
                            "image_index": img_index,  #start from 0 
                            "text": ocr_text,
                            "has_face": has_face
                        })
                        img_index += 1
        
        return extracted_text, ocr_results
            
    except Exception as e:
        print(f"ERROR processing DOCX: {e}")
        return [], []
