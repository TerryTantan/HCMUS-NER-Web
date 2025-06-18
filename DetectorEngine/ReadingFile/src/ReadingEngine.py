import sys
import os
import json
import time

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))

from ReadingFile.src.FileProcessor import ProcessFile
from NER.src.NerUtils import ConvertEntitiesToJson, DetectLanguage, HasPrivateInfo
from NER.src.Translator.English import English
from NER.src.Translator.Vietnamese import Vietnamese

def ExtractText(text):
    language = DetectLanguage(text)
    print(f"Detected language: {language}")

    if language == 'English':
        entities = English(text)
    elif language == 'Vietnamese':
        entities = Vietnamese(text)
    else:
        entities = []
        print(f"NER not supported for {language}")
        
    return entities

def DetectSensitiveData(file_path):
    print(f"Processing file: {file_path}")
    
    start_time = time.time()
    success_flag = True
    
    # Set output directory
    script_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    output_dir = os.path.join(script_dir, "output")
    
    entity_json_paths = []  # List to store paths of per-page JSON files
    private_img = []
    private_img_json_path = ""  # Path to private image JSON file
    
    try:
        texts, ocr = ProcessFile(file_path)
        pages = len(texts)
        
        if texts:
            for page in range(pages):
                text = texts[page]
                entities = ExtractText(text)
                
                # Normalize entities for this page
                normalized_entities = []
                for entity in entities:
                    if isinstance(entity, (list, tuple)):
                        normalized_entities.append(entity[:4])
                    elif isinstance(entity, dict):
                        normalized_entities.append((
                            entity.get('text', ''),
                            entity.get('label', ''),
                            entity.get('start', 0),
                            entity.get('end', 0)
                        ))
                    else:
                        print(f"Warning: Skipping invalid entity format: {entity}")
                        continue
                
                # Save entities to page-specific JSON file
                if normalized_entities:
                    output_path = ConvertEntitiesToJson(
                        normalized_entities,
                        output_dir=output_dir,
                        filename=f"page_{page + 1}.json"
                    )
                    entity_json_paths.append(output_path)
                else:
                    print(f"No entities extracted for page {page + 1}")
        
        else:
            print("Failed to extract text from the file or no text found.")
            success_flag = False
        
        if ocr:
            for result in ocr:
                page = result["page"]
                image_index = result["image_index"]
                text = result["text"]
                has_face = result["has_face"]
                
                if HasPrivateInfo(result, ExtractText):
                    private_img.append({"page": page, "image_index": image_index})
            
            # Save private image info to JSON file
            if private_img:
                private_img_json_path = os.path.join(output_dir, "private_info_images.json")
                with open(private_img_json_path, "w", encoding='utf-8') as f:
                    json.dump(private_img, f, indent=4, ensure_ascii=False)
                print(f"Private images info saved to: {private_img_json_path}")
        
        else:
            print("No text and face found.")
            success_flag = False
    
    except Exception as e:
        print(f"Error occurred: {str(e)}")
        success_flag = False
    
    end_time = time.time()
    print(f"Total processing time: {end_time - start_time} seconds")
    
    return entity_json_paths, private_img_json_path, success_flag
