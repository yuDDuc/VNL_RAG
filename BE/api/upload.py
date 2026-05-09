from fastapi import APIRouter, UploadFile, File, HTTPException
import io

router = APIRouter()

@router.post("/")
async def upload_file(file: UploadFile = File(...)):
    filename = file.filename.lower()
    text = ""

    try:
        content = await file.read()
        
        if filename.endswith(".txt"):
            text = content.decode("utf-8", errors="ignore")
            
        elif filename.endswith(".pdf"):
            import pypdf
            pdf_reader = pypdf.PdfReader(io.BytesIO(content))
            text = "\n".join([page.extract_text() for page in pdf_reader.pages if page.extract_text()])
            
        elif filename.endswith(".docx"):
            import docx
            doc = docx.Document(io.BytesIO(content))
            text = "\n".join([para.text for para in doc.paragraphs])
            
        elif filename.endswith((".png", ".jpg", ".jpeg", ".bmp")):
            try:
                import pytesseract
                from PIL import Image
                image = Image.open(io.BytesIO(content))
                text = pytesseract.image_to_string(image, lang='vie+eng')
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Image OCR failed. Make sure Tesseract is installed on the server. Error: {str(e)}")
                
        else:
            raise HTTPException(status_code=400, detail="Unsupported file format. Please upload txt, pdf, docx, or image.")
            
        if not text.strip():
            raise HTTPException(status_code=400, detail="Could not extract text from the file (file might be empty or scanned PDF without OCR).")
            
        return {"filename": file.filename, "content": text}
        
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")
