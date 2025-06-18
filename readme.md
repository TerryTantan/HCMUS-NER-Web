📦HCMUS-NER-Web
 ┣ 📂backend
 ┃ ┗ 📜main.py
 ┣ 📂demo_notebook
 ┃ ┣ 📜detect-and-read-file.ipynb
 ┃ ┣ 📜ner-for-private-imfomation.ipynb
 ┃ ┗ 📜pdf_masker.ipynb
 ┣ 📂DetectorEngine
 ┃ ┣ 📂NER
 ┃ ┃ ┗ 📂src
 ┃ ┃ ┃ ┣ 📂Translator
 ┃ ┃ ┃ ┃ ┣ 📜English.py
 ┃ ┃ ┃ ┃ ┗ 📜Vietnamese.py
 ┃ ┃ ┃ ┗ 📜NerUtils.py
 ┃ ┗ 📂ReadingFile
 ┃ ┃ ┣ 📂output
 ┃ ┃ ┃ ┣ 📜page_1.json
 ┃ ┃ ┃ ┣ 📜page_2.json
 ┃ ┃ ┃ ┣ 📜page_3.json
 ┃ ┃ ┃ ┗ 📜private_info_images.json
 ┃ ┃ ┣ 📂src
 ┃ ┃ ┃ ┣ 📜FaceDetector.py
 ┃ ┃ ┃ ┣ 📜FileProcessor.py
 ┃ ┃ ┃ ┣ 📜ReadingEngine.py
 ┃ ┃ ┃ ┣ 📜ReadingUtils.py
 ┃ ┃ ┃ ┗ 📜TextExtractor.py
 ┃ ┃ ┗ 📜.gitignore
 ┣ 📂FileMasker
 ┃ ┣ 📂input
 ┃ ┃ ┗ 📜Cool_Cat.pdf
 ┃ ┣ 📂output
 ┃ ┃ ┗ 📜Cool_Cat_masked.pdf
 ┃ ┗ 📜UtilsMasker.py
 ┣ 📂frontend
 ┣ 📜.gitignore
 ┣ 📜main.py
 ┣ 📜readme.md
 ┗ 📜requirements.txt

---

### Coding Guidelines

* Use **clear and meaningful function names**. Follow the existing naming conventions — for example, `DetectSensitiveData`.
* The project must be **well-structured and scalable** to support future enhancements. Apply **Object-Oriented Programming (OOP)** principles and aim for clean, modular, and maintainable code.
* Adding comments is highly encouraged to improve code readability and understanding.
---
Here’s a clearer, more polished version of your `README.md` **Important Notes** section with improved grammar, vocabulary, and formatting:

---

### Important Notes

* The current **entry point** of the project is `main.py`, located at the root directory. To test the project's functionality, either use `main.py` directly or create a new `.py` file at the root level for custom testing.
  You are also encouraged to create a Jupyter notebook under the `demo_notebook/` directory for experimentation and demonstration purposes.

* When importing modules or libraries, please follow the **existing import conventions** to maintain consistency. For example:

```python
import sys
import os

# Append the project root to the system path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))

# Import modules using the established project structure
from ReadingFile.src.FileProcessor import ProcessFile
from NER.src.NerUtils import ConvertEntitiesToJson, DetectLanguage, HasPrivateInfo
from NER.src.Translator.English import English
from NER.src.Translator.Vietnamese import Vietnamese
```

> ✅ Consistency in import paths helps avoid confusion and ensures smoother module resolution, especially when scaling or refactoring the project.
---
### Backend Setup

Python version requirement: Python **< 3.12** (e.g. 3.11.x or below)

#### Install dependencies

```bash
pip install -r requirements.txt
python -m spacy download en_core_web_sm
```

> ℹ️ Although `requirements.txt` should include all necessary libraries, dependency issues may vary between systems. If you encounter errors, please install the missing libraries manually.

---

### Run backend

```bash
cd backend
fastapi dev main.py
```
---
### Frontend
#### Install dependencies
```bash
cd frontend
npm i
```
#### Run frontend
```bash
cd frontend
npm run dev
```
---
## Common places to check errors
- CORS: make sure that you added your frontend endpoint to `origins` list in `backend/main.py`.
- The backend endpoint is hardcoded in `backend_endpoint` in file `frontend/src/App.tsx`.
- The uploaded file in backend is stored at `backend/cached_file` and is deleted after a few minutes, indicated by the `delay` parameter.
---
## Notes
- The `DetectSensitiveData` in `DetectorEnging/ReadingFile/src/ReadingEngine.py` is modified to return:
    - 1st json list: contain entities for each page.
    - 2nd json list: contain private image info.
    - flag: indicate whether it run succesfully or failed.

