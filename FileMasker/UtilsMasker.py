import pymupdf
import json
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from DetectorEngine.ReadingFile.src.ReadingEngine import DetectSensitiveData

def MaskText(fname: str, out_fname: str, words: list):
    mask_count = 0
    with pymupdf.open(fname) as doc:  # Open PDF document
        for page in doc:  # Iterate through each page
            for word in words:  # Search for each sensitive word
                # Find all occurrences of the word on the page
                rectangles = page.search_for(word, quads=True)
                for quad in rectangles:
                    # Add black redaction annotation to mask the word
                    page.add_redact_annot(quad, fill=(0, 0, 0))
                    mask_count += 1
                # Apply all redactions on the page
                page.apply_redactions()
        # Save the masked PDF if any words were found
        if mask_count:
            doc.save(out_fname)
    return mask_count

def LocateAndLabelData(json_path: str) -> list:
    sensitive_words = []
    
    try:
        with open(json_path, 'r', encoding='utf-8') as f:
            entities = json.load(f)
            
        # Extract text from each entity block
        for entity in entities:
            if isinstance(entity, (list, tuple)) and len(entity) >= 4:
                # Format: (text, label, start, end)
                text = entity[0]
                if text and text.strip():  # Only add non-empty text
                    sensitive_words.append(text.strip())
            elif isinstance(entity, dict):
                # Format: {"text": "", "label": "", "start": 0, "end": 0}
                text = entity.get('text', '')
                if text and text.strip():
                    sensitive_words.append(text.strip())
                    
    except Exception as e:
        print(f"Error reading JSON file {json_path}: {str(e)}")
        
    return sensitive_words

def PdfMasking(file_path: str):
    print(f"Starting PDF masking process for: {file_path}")
    
    # Step 1: Extract sensitive information using DetectSensitiveData
    entity_json_paths, private_img_json_path, success_flag = DetectSensitiveData(file_path)
    
    if not success_flag:
        print("Failed to extract entities from PDF")
        return False, None, 0
    
    import os

    # Step 2: Generate output filename for masked PDF
    file_name = os.path.basename(file_path)
    name_without_ext = os.path.splitext(file_name)[0]
    output_dir = os.path.join(os.path.dirname(__file__), "output")  # ensure it's relative to script
    masked_file_path = os.path.join(output_dir, f"{name_without_ext}_masked.pdf")

    
    # Step 3: Collect all sensitive words from JSON files
    all_sensitive_words = []
    
    # Process entity JSON files from each page
    for json_path in entity_json_paths:
        if os.path.exists(json_path):
            words = LocateAndLabelData(json_path)
            all_sensitive_words.extend(words)
            print(f"Extracted {len(words)} sensitive items from {json_path}")
    
    # Remove duplicates while preserving order
    unique_sensitive_words = []
    seen = set()
    for word in all_sensitive_words:
        if word not in seen:
            unique_sensitive_words.append(word)
            seen.add(word)
    
    print(f"Total unique sensitive items to mask: {len(unique_sensitive_words)}")
    
    # Step 4: Apply masking to PDF
    if unique_sensitive_words:
        total_masked = MaskText(file_path, masked_file_path, unique_sensitive_words)
        print(f"Successfully masked {total_masked} sensitive items")
        print(f"Masked PDF saved as: {masked_file_path}")
        return True, masked_file_path, total_masked
    else:
        print("No sensitive information found to mask")
        return True, None, 0

