import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from Translator.English import English
from deep_translator import GoogleTranslator
from NerUtils import RemoveDiacritics
from NerUtils import MapEntitiesToOriginal

def Vietnamese(text):
    original_text = text
    non_diacritics_text = RemoveDiacritics(text)
    
    translator = GoogleTranslator(source='vi', target='en')
    translated_text = translator.translate(text)  
    
    english_entities = English(translated_text)
    mapped_entities = MapEntitiesToOriginal(original_text, non_diacritics_text, english_entities)
    
    return mapped_entities