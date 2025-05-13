import sys
import os
import json
import time

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'NER', 'src')))

from file_processor import process_file
from utils import entities_to_json, detect_language, has_private_info
from language_ner.english_ner import english_ner
from language_ner.vietnamese_ner import vietnamese_ner

def process_text(text):
    language = detect_language(text)
    print(f"Detected language: {language}")

    if language == 'English':
        entities = english_ner(text)
    elif language == 'Vietnamese':
        entities = vietnamese_ner(text)
    else:
        entities = []
        print(f"NER not supported for {language}")
        
    return entities



def file_to_json(file_path):
    # startTime = time.time()
    print(f"Processing file: {file_path}")
    
    success_flag = True  # Flag to track success or failure
    
    try:
        # Extract texts and OCR data
        texts, ocr = process_file(file_path)
        pages = len(texts)
        
        extracted_entities = []  # List to store entities for each page
        private_img = []  # List to store private image info
        
        if texts:
            for page in range(pages):
                text = texts[page]
                entities = process_text(text)
                extracted_entities.append(entities)  # Store entities for each page
        else:
            success_flag = False  # Failed to extract text from the file
        
        if ocr:
            for result in ocr:
                page = result["page"]
                image_index = result["image_index"]
                text = result["text"]
                has_face = result["has_face"]
                
                if has_private_info(result, process_text):
                    private_img.append({"page": page, "image_index": image_index})
        else:
            success_flag = False  # No OCR data or face information found
        
    except Exception as e:
        success_flag = False  # If any exception occurs, mark as failed
    
    # endTime = time.time()
    
    # Return the two JSON-like objects and the success flag
    return extracted_entities, private_img, success_flag

# if __name__ == "__main__":
    
#     startTime = time.time()
    
#     file_path = r"C:\MaHoa\read_file\test_files\test_pdf.pdf"
#     script_dir = os.path.dirname(os.path.abspath(__file__))
#     output_dir = os.path.join(script_dir, "output")
    
#     texts, ocr = process_file(file_path)
#     pages = len(texts)
#     if texts:
#         for page in range(pages):
#             text = texts[page]
#             # print("Extracted text:", text)
#             entities = process_text(text)
#             output_path = entities_to_json(entities, output_dir=output_dir, filename=f"page_{page + 1}.json")
#             # print(entities)
#             # print(f"Entities saved to: {output_path}")
#     else:
#         print("Failed to extract text from the file Or no text found.")
        
#     if ocr:
#         private_img = []
#         for result in ocr:
#             page = result["page"]
#             image_index = result["image_index"]
#             text = result["text"]
#             has_face = result["has_face"]
            
#             if has_private_info(result, process_text):
#                 private_img.append({"page": page, "image_index": image_index})
                
#         if private_img:
#             output_path = os.path.join(output_dir, "private_info_images.json")
#             with open(output_path, "w") as f:
#                 json.dump(private_img, f, indent=4)
#             # print(f"Private images info saved to: {output_path}")
            
#     else:
#         print("No text and face found.")
        
#     endTime = time.time()
#     print("Tortal processing time:", endTime - startTime)

result1, result2, flag = file_to_json("NguyenPhuc_DevOpsEngineer_NAB.pdf")

if flag:
    print("Processing completed successfully.")
    print("Extracted entities:", result1)
    print("Private images info:", result2)
else:
    print("Processing failed. Please check the input file or OCR data.")