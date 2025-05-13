## How to use

### Backend
Make sure your Python version is **< 3.12**
#### Install dependencies

```bash
pip install -r requirements.txt
python -m spacy download en_core_web_sm
```

### Run backend

```bash
cd backend
fastapi dev main.py
```

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

## Common places to check errors
- CORS: make sure that you added your frontend endpoint to `origins` list in `backend/main.py`.
- The backend endpoint is hardcoded in `backend_endpoint` in file `frontend/src/App.tsx`.
- The uploaded file in backend is stored at `backend/cached_file` and is deleted after a few minutes, indicated by the `delay` parameter.

## Notes
- The original folder `NERdaskfjksdlfjk` is renamed to `cong-nghe-loi` because the original name is too long and the edittor dont like it.
- The original file `cong-nghe-loi/read_file/src/main.py` is renamed to `cong-nghe-loi/read_file/src/engine.py` to avoid conflict.
- The `file_to_json` in `cong-nghe-loi/read_file/src/engine.py` is modified to return:
    - 1st json list: contain entities for each page.
    - 2nd json list: contain private image info.
    - flag: indicate whether it run succesfully or failed.
