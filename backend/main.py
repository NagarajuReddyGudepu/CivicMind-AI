from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
from io import BytesIO

app = FastAPI(title="CivicMind AI API")

# Allow React frontend to communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "message": "CivicMind AI Backend is running!"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


@app.post("/analyze-image")
async def analyze_image(file: UploadFile = File(...)):
    image_data = await file.read()

    try:
        image = Image.open(BytesIO(image_data))
        width, height = image.size

        return {
            "filename": file.filename,
            "image_type": image.format,
            "width": width,
            "height": height,
            "issue": "Civic issue detected",
            "category": "Road / Infrastructure",
            "confidence": 0.85,
            "severity": "Medium"
        }

    except Exception:
        return {
            "error": "Invalid image file"
        }