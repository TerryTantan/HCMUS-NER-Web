import pymupdf
from presidio_analyzer import AnalyzerEngine
from PIL import Image
import io
import cv2
import numpy as np
from IPython.display import display

face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")

def get_content(fname: str):
    """
    Extracts text content from a PDF file.
    Args:
        fname (str): Path to the PDF file.
    Returns:
        str: Extracted text content.
    """
    with pymupdf.open(fname) as doc:  # open document
        text = chr(12).join([page.get_text() for page in doc])
    return text

def get_pii_words(content: str, threshold: float = 0.7) -> list:
    """
    Extracts PII words from the content.
    Args:
        content (str): The text content to analyze.
        threshold (float): Confidence threshold for PII detection.
    Returns:
        list: List of dict contain info about PII words found in the content.
    """
    analyzer = AnalyzerEngine()
    results = analyzer.analyze(
        text=content,
        language="en"
    )
    pii_words = []
    for result in results:
        if result.score >= threshold:
            pii_words.append({
                "word": content[result.start:result.end],
                "type": result.entity_type,
                "score": result.score,
            })
    return pii_words

def blacken_words(fname: str, out_fname: str, words: list):
    """
    Blackens specified words in a PDF file.
    Args:
        fname (str): Input PDF file name.
        out_fname (str): Output PDF file name.
        words (list): List of words to blacken.
    """
    flag = 0
    with pymupdf.open(fname) as doc:  # open document
        for page in doc:
            for word in words:
                rl = page.search_for(word, quads=True)
                for quad in rl:
                    page.add_redact_annot(quad, fill=(0, 0, 0))
                    flag += 1
                page.apply_redactions()
        if flag:
            doc.save(out_fname)
    return flag

def extract_images(pdf_path: str):
    """
    Extracts images from a PDF file.
    Args:
        pdf_path (str): Path to the PDF file.
    Returns:
        list: List of dictionaries containing image information.
    """

    doc = pymupdf.open(pdf_path)
    extracted = []

    for page_index in range(len(doc)):
        page = doc[page_index]
        images = page.get_images(full=True)
        print(images)
        for img in images:
            xref = img[0]
            img_name = img[-3]
            rect = page.get_image_bbox(img_name)
            base_image = doc.extract_image(xref)
            image_bytes = base_image["image"]
            # image_ext = base_image["ext"]
            
            # Convert to Pillow image
            image = Image.open(io.BytesIO(image_bytes))

            extracted.append({
                "page": page_index,
                "xref": xref,
                "width": image.width,
                "height": image.height,
                "bbox": rect,
                # "xres": base_image["xres"],
                # "yres": base_image["yres"],
                # "extension": image_ext,
                "image": image
            })

    doc.close()
    return extracted

def has_face(image: Image.Image) -> bool:
    """
    Check if the image contains a face using OpenCV's Haar Cascade classifier.
    Args:
        image (Image.Image): The image to check.
    Returns:
        bool: True if a face is detected, False otherwise.
    """
    # Convert PIL to grayscale OpenCV image
    gray = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2GRAY)

    # Detect faces
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5)

    return len(faces) > 0

# return vunerable images
def filter_images(images_info):
    """
    Filters images to find those that contain faces.
    Args:
        images_info (list): List of dictionaries containing image information.
    Returns:
        list: Filtered list of images that contain faces.
    """
    filtered_images = []
    for info in images_info:
        if has_face(info['image']):
            filtered_images.append(info)
    return filtered_images

def blacken_images(fname: str, out_fname: str, images_info: list):
    """
    Blackens images in a PDF file.
    Args:
        images_info (list): List of dictionaries containing image information.
        out_pdf (str): Output PDF file name.
    """
    flag = 0
    with pymupdf.open(fname) as doc:  # open document
        for page in doc:
            for image in images_info:
                if image['page'] != page.number:
                    continue
                rect = image['bbox']
                page.add_redact_annot(rect, fill=(0, 0, 0))
                flag += 1
            page.apply_redactions()
        if flag:
            doc.save(out_fname)
    return flag