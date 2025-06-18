import os
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__))))

from FileMasker.UtilsMasker import PdfMasking

if __name__ == "__main__":
    pdf_file_path = r"C:\N\nerweb\HCMUS-NER-Web\FileMasker\input\Cool_Cat.pdf"
    success, masked_file, count = PdfMasking(pdf_file_path)