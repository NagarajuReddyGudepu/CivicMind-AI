
import os
import json
import hashlib
import uuid

from io import BytesIO
from pathlib import Path
from datetime import datetime

from dotenv import load_dotenv

from passlib.context import CryptContext
from jose import jwt

from fastapi import (
    FastAPI,
    UploadFile,
    File,
    Depends,
    HTTPException,
    status
)

from fastapi.security import (
    HTTPBearer,
    HTTPAuthorizationCredentials
)

from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from PIL import Image

from google import genai
from google.genai import types

from sqlalchemy import text
from database import engine


# =========================================================
# 1. LOAD ENVIRONMENT VARIABLES
# =========================================================

load_dotenv()

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

if not GOOGLE_API_KEY:
    raise RuntimeError(
        "GOOGLE_API_KEY is not configured in .env"
    )


# =========================================================
# 2. CREATE GEMINI CLIENT
# =========================================================

client = genai.Client(
    api_key=GOOGLE_API_KEY
)


# =========================================================
# 3. CREATE FASTAPI APPLICATION
# =========================================================

app = FastAPI(
    title="CivicMind AI API"
)


# =========================================================
# 4. UPLOAD DIRECTORY
# =========================================================

UPLOAD_DIR = Path("uploads")

UPLOAD_DIR.mkdir(
    exist_ok=True
)

# Serve uploaded images through:
# http://localhost:8000/uploads/filename.jpg

app.mount(
    "/uploads",
    StaticFiles(directory=str(UPLOAD_DIR)),
    name="uploads"
)


# =========================================================
# 5. AUTHENTICATION CONFIGURATION
# =========================================================

SECRET_KEY = os.getenv(
    "SECRET_KEY",
    "civicmind-development-secret-key"
)

ALGORITHM = "HS256"

pwd_context = CryptContext(
    schemes=["pbkdf2_sha256"],
    deprecated="auto"
)

security = HTTPBearer()


# =========================================================
# 6. GET CURRENT USER
# =========================================================

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):

    token = credentials.credentials

    try:

        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        user_id = payload.get("user_id")
        email = payload.get("email")
        role = payload.get("role")

        if not user_id or not email or not role:

            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication token."
            )

        return {
            "user_id": user_id,
            "email": email,
            "role": role
        }

    except Exception:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication token."
        )


# =========================================================
# 7. REQUIRE CITIZEN
# =========================================================

def require_citizen(
    current_user: dict = Depends(get_current_user)
):

    if current_user["role"] != "citizen":

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Citizen access required."
        )

    return current_user


# =========================================================
# 8. REQUIRE ADMIN
# =========================================================

def require_admin(
    current_user: dict = Depends(get_current_user)
):

    if current_user["role"] != "admin":

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required."
        )

    return current_user


# =========================================================
# 9. CORS CONFIGURATION
# =========================================================

app.add_middleware(
    CORSMiddleware,

    allow_origins=[
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://civicmind-ai-frontend.onrender.com"
],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"]
)


# =========================================================
# 10. HOME ENDPOINT
# =========================================================

@app.get("/")
def home():

    return {
        "message": "CivicMind AI Backend is running!"
    }


# =========================================================
# 11. HEALTH CHECK
# =========================================================

@app.get("/health")
def health():

    return {
        "status": "healthy"
    }


# =========================================================
# 12. PASSWORD HELPER FUNCTIONS
# =========================================================

def hash_password(
    password: str
) -> str:

    return pwd_context.hash(
        password
    )


def verify_password(
    password: str,
    password_hash: str
) -> bool:

    return pwd_context.verify(
        password,
        password_hash
    )


# =========================================================
# 13. REGISTER
# =========================================================

@app.post("/register")
async def register(
    data: dict
):

    try:

        name = data.get(
            "name",
            ""
        ).strip()

        email = data.get(
            "email",
            ""
        ).strip().lower()

        password = data.get(
            "password",
            ""
        )

        # Registration is always for citizens
        role = "citizen"


        # -------------------------------------------------
        # Validate input
        # -------------------------------------------------

        if not name or not email or not password:

            return {
                "success": False,
                "error": "Name, email and password are required."
            }


        # -------------------------------------------------
        # Check existing email
        # -------------------------------------------------

        check_query = text("""
            SELECT id
            FROM users
            WHERE email = :email
        """)

        with engine.connect() as connection:

            existing_user = connection.execute(
                check_query,
                {
                    "email": email
                }
            ).first()


        if existing_user:

            return {
                "success": False,
                "error": "Email already registered."
            }


        # -------------------------------------------------
        # Hash password
        # -------------------------------------------------

        password_hash = hash_password(
            password
        )


        # -------------------------------------------------
        # Insert user
        # -------------------------------------------------

        insert_query = text("""
            INSERT INTO users (
                name,
                email,
                password_hash,
                role
            )
            VALUES (
                :name,
                :email,
                :password_hash,
                :role
            )
            RETURNING
                id,
                name,
                email,
                role,
                created_at
        """)

        with engine.begin() as connection:

            result = connection.execute(
                insert_query,
                {
                    "name": name,
                    "email": email,
                    "password_hash": password_hash,
                    "role": role
                }
            )

            user = result.mappings().first()


        # -------------------------------------------------
        # Return response
        # -------------------------------------------------

        return {

            "success": True,

            "message": "Registration successful.",

            "user": dict(user)

        }


    except Exception as e:

        print(
            f"Registration error: {str(e)}"
        )

        return {

            "success": False,

            "error": f"Registration failed: {str(e)}"

        }


# =========================================================
# 14. LOGIN
# =========================================================

@app.post("/login")
async def login(
    data: dict
):

    try:

        email = data.get(
            "email",
            ""
        ).strip().lower()

        password = data.get(
            "password",
            ""
        )

        role = data.get(
            "role",
            "citizen"
        ).strip().lower()


        # -------------------------------------------------
        # Validate input
        # -------------------------------------------------

        if not email or not password:

            return {
                "success": False,
                "error": "Email and password are required."
            }


        # -------------------------------------------------
        # Validate role
        # -------------------------------------------------

        if role not in [
            "citizen",
            "admin"
        ]:

            return {
                "success": False,
                "error": "Invalid role."
            }


        # -------------------------------------------------
        # Find user
        # -------------------------------------------------

        query = text("""
            SELECT
                id,
                name,
                email,
                password_hash,
                role
            FROM users
            WHERE email = :email
        """)

        with engine.connect() as connection:

            user = connection.execute(
                query,
                {
                    "email": email
                }
            ).mappings().first()


        # -------------------------------------------------
        # User not found
        # -------------------------------------------------

        if not user:

            return {
                "success": False,
                "error": "Invalid email or password."
            }


        # -------------------------------------------------
        # Check selected role
        # -------------------------------------------------

        if user["role"] != role:

            return {

                "success": False,

                "error":
                    "This account does not belong to the selected login type."

            }


        # -------------------------------------------------
        # Verify password
        # -------------------------------------------------

        if not verify_password(
            password,
            user["password_hash"]
        ):

            return {

                "success": False,

                "error": "Invalid email or password."

            }


        # -------------------------------------------------
        # Create JWT token
        # -------------------------------------------------

        token = jwt.encode(

            {
                "user_id": user["id"],
                "email": user["email"],
                "role": user["role"]
            },

            SECRET_KEY,

            algorithm=ALGORITHM

        )


        # -------------------------------------------------
        # Return login response
        # -------------------------------------------------

        return {

            "success": True,

            "message": "Login successful.",

            "access_token": token,

            "user": {

                "id": user["id"],

                "name": user["name"],

                "email": user["email"],

                "role": user["role"]

            }

        }


    except Exception as e:

        print(
            f"Login error: {str(e)}"
        )

        return {

            "success": False,

            "error": f"Login failed: {str(e)}"

        }


# =========================================================
# 15. IMAGE ANALYSIS ENDPOINT
# =========================================================

@app.post("/analyze-image")
async def analyze_image(
    file: UploadFile = File(...)
):

    try:

        # -------------------------------------------------
        # Read uploaded image
        # -------------------------------------------------

        image_data = await file.read()


        # -------------------------------------------------
        # Validate image
        # -------------------------------------------------

        image = Image.open(
            BytesIO(image_data)
        )

        image_format = image.format

        original_width, original_height = image.size


        print(
            f"Original image: "
            f"{original_width}x{original_height}, "
            f"{len(image_data) / 1024:.1f} KB"
        )


        # -------------------------------------------------
        # Resize large image
        # -------------------------------------------------

        MAX_SIZE = 1280

        if max(image.size) > MAX_SIZE:

            image.thumbnail(
                (MAX_SIZE, MAX_SIZE),
                Image.Resampling.LANCZOS
            )


        # -------------------------------------------------
        # Convert RGB
        # -------------------------------------------------

        if image.mode != "RGB":

            image = image.convert(
                "RGB"
            )


        # -------------------------------------------------
        # Compress image
        # -------------------------------------------------

        compressed_buffer = BytesIO()

        image.save(
            compressed_buffer,
            format="JPEG",
            quality=80,
            optimize=True
        )

        compressed_image_data = (
            compressed_buffer.getvalue()
        )

        processed_width, processed_height = image.size


        print(
            f"Processed image: "
            f"{processed_width}x{processed_height}, "
            f"{len(compressed_image_data) / 1024:.1f} KB"
        )


        # -------------------------------------------------
        # CivicMind AI prompt
        # -------------------------------------------------

        prompt = """

You are CivicMind AI, an AI assistant that analyzes photos of
community and public infrastructure problems.

Analyze the uploaded image and identify whether it shows a genuine
civic or community issue.

Possible categories include:

- Road / Infrastructure
- Garbage / Waste
- Streetlight
- Water Leakage
- Public Infrastructure
- Fallen Tree
- Drainage
- Other

Return ONLY valid JSON.

Use exactly these fields:

{
  "issue": "specific issue name",
  "category": "one category from the list",
  "confidence": 0.0,
  "severity": "Low, Medium, or High",
  "explanation": "short explanation of what is visible"
}

Rules:

1. confidence must be a number between 0 and 1.

2. severity must be only:
   Low
   Medium
   High

3. Severity is only a preliminary AI estimate based on visible
   conditions.

4. Do not claim that the severity is an official government priority.

5. Do not invent information that cannot be observed in the image.

6. If no clear civic issue is visible, return:

{
  "issue": "No clear civic issue detected",
  "category": "Other",
  "confidence": 0.0,
  "severity": "Low",
  "explanation": "The image does not clearly show a civic issue."
}

Return JSON only. Do not use Markdown.

"""


        # -------------------------------------------------
        # Gemini model fallback list
        # -------------------------------------------------

        models = [
    "gemini-3.5-flash-lite",
    "gemini-3.1-flash-lite",
]


        response = None

        successful_model = None

        model_errors = []


        # -------------------------------------------------
        # Send image to Gemini
        # -------------------------------------------------

        for model_name in models_to_try:

            try:

                print(
                    f"Trying Gemini model: {model_name}"
                )


                response = client.models.generate_content(

                    model=model_name,

                    contents=[

                        types.Part.from_bytes(

                            data=compressed_image_data,

                            mime_type="image/jpeg"

                        ),

                        prompt

                    ],

                )


                successful_model = model_name


                print(
                    f"Successfully used model: "
                    f"{model_name}"
                )


                break


            except Exception as e:

                error_message = str(e)


                print(
                    f"Model failed: {model_name}"
                )

                print(
                    error_message
                )


                model_errors.append({

                    "model": model_name,

                    "error": error_message

                })


        # -------------------------------------------------
        # All models failed
        # -------------------------------------------------

        if response is None:

            return {

                "error":
                    "All Gemini models failed.",

                "model_errors":
                    model_errors

            }


        # -------------------------------------------------
        # Get Gemini response
        # -------------------------------------------------

        response_text = response.text.strip()


        # -------------------------------------------------
        # Remove Markdown fences
        # -------------------------------------------------

        if response_text.startswith("```"):

            response_text = response_text.replace(
                "```json",
                ""
            )

            response_text = response_text.replace(
                "```",
                ""
            )

            response_text = response_text.strip()


        # -------------------------------------------------
        # Convert response to JSON
        # -------------------------------------------------

        try:

            ai_result = json.loads(
                response_text
            )

        except json.JSONDecodeError:

            return {

                "error":
                    "AI returned an unexpected response format.",

                "raw_response":
                    response_text,

                "model_used":
                    successful_model

            }


        # -------------------------------------------------
        # Return AI result
        # -------------------------------------------------

        return {

            "filename":
                file.filename,

            "image_type":
                image_format,

            "width":
                original_width,

            "height":
                original_height,

            "processed_width":
                processed_width,

            "processed_height":
                processed_height,

            "original_size_kb":
                round(
                    len(image_data) / 1024,
                    1
                ),

            "processed_size_kb":
                round(
                    len(compressed_image_data) / 1024,
                    1
                ),

            "model_used":
                successful_model,

            "issue":
                ai_result.get("issue"),

            "category":
                ai_result.get("category"),

            "confidence":
                ai_result.get("confidence"),

            "severity":
                ai_result.get("severity"),

            "explanation":
                ai_result.get("explanation")

        }


    except Exception as e:

        print(
            f"AI image analysis failed: {str(e)}"
        )


        return {

            "error":
                f"AI image analysis failed: {str(e)}"

        }


# =========================================================
# 16. GENERATE CIVIC COMPLAINT
# =========================================================

@app.post("/generate-complaint")
async def generate_complaint(
    data: dict
):

    try:

        issue = data.get(
            "issue",
            ""
        )

        category = data.get(
            "category",
            ""
        )

        severity = data.get(
            "severity",
            ""
        )

        explanation = data.get(
            "explanation",
            ""
        )


        prompt = f"""

You are an AI assistant that helps citizens create clear and professional
civic complaints.

Based on the following AI analysis:

Issue: {issue}
Category: {category}
Severity: {severity}
Explanation: {explanation}

Generate a professional civic complaint.

Return ONLY valid JSON in this exact format:

{{
    "title": "short professional complaint title",
    "description": "clear and detailed complaint description"
}}

Rules:

- Use simple, professional English.
- Do not invent a location.
- Do not claim that the government has confirmed the issue.
- Do not exaggerate the severity.
- Mention the visible problem and why it needs attention.

"""


        response = None

        successful_model = None

        model_errors = []


        models_to_try = [

            "gemini-3.7-flash",

            "gemini-3.6-flash",

            "gemini-3.5-flash",

            "gemini-3.1-flash-lite",

            "gemini-2.5-flash"

        ]


        for model_name in models:

            try:

                response = client.models.generate_content(

                    model=model_name,

                    contents=prompt

                )

                successful_model = model_name

                break


            except Exception as e:

                model_errors.append({

                    "model": model_name,

                    "error": str(e)

                })


        if response is None:

            return {

                "error":
                    "All Gemini models failed.",

                "model_errors":
                    model_errors

            }


        response_text = response.text.strip()


        if response_text.startswith("```"):

            response_text = response_text.replace(
                "```json",
                ""
            )

            response_text = response_text.replace(
                "```",
                ""
            )

            response_text = response_text.strip()


        complaint = json.loads(
            response_text
        )


        return {

            "model_used":
                successful_model,

            "title":
                complaint.get(
                    "title",
                    ""
                ),

            "description":
                complaint.get(
                    "description",
                    ""
                )

        }


    except Exception as e:

        return {

            "error":
                f"Complaint generation failed: {str(e)}"

        }


# =========================================================
# 17. UPLOAD REPORT IMAGE
# =========================================================

@app.post("/upload-report-image")
async def upload_report_image(
    file: UploadFile = File(...),
    current_user: dict = Depends(require_citizen)
):

    try:

        # -------------------------------------------------
        # Read image
        # -------------------------------------------------

        image_data = await file.read()


        if not image_data:

            return {

                "success": False,

                "error": "No image was uploaded."

            }


        # -------------------------------------------------
        # Validate image
        # -------------------------------------------------

        image = Image.open(
            BytesIO(image_data)
        )

        image.verify()


        # -------------------------------------------------
        # Re-open after verify
        # -------------------------------------------------

        image = Image.open(
            BytesIO(image_data)
        ).convert("RGB")


        # -------------------------------------------------
        # Resize if necessary
        # -------------------------------------------------

        MAX_SIZE = 1280

        if max(image.size) > MAX_SIZE:

            image.thumbnail(
                (MAX_SIZE, MAX_SIZE),
                Image.Resampling.LANCZOS
            )


        # -------------------------------------------------
        # Create unique filename
        # -------------------------------------------------

        filename = (
            f"{uuid.uuid4().hex}.jpg"
        )

        file_path = (
            UPLOAD_DIR / filename
        )


        # -------------------------------------------------
        # Save image
        # -------------------------------------------------

        image.save(
            file_path,
            "JPEG",
            quality=85,
            optimize=True
        )


        print(
            f"Report image saved: {file_path}"
        )


        # -------------------------------------------------
        # Return image path
        # -------------------------------------------------

        return {

            "success": True,

            "image_path":
                f"/uploads/{filename}"

        }


    except Exception as e:

        print(
            f"Image upload error: {str(e)}"
        )

        return {

            "success": False,

            "error": "Invalid image file."

        }


# =========================================================
# 18. SUBMIT CIVIC REPORT
# =========================================================

@app.post("/submit-report")
async def submit_report(
    report: dict,
    current_user: dict = Depends(require_citizen)
):

    try:

        report_id = (
            "CM-"
            +
            uuid.uuid4().hex[:8].upper()
        )


        query = text("""

            INSERT INTO reports (

                report_id,

                title,

                description,

                issue,

                category,

                severity,

                latitude,

                longitude,

                status,

                user_id,

                image_path

            )

            VALUES (

                :report_id,

                :title,

                :description,

                :issue,

                :category,

                :severity,

                :latitude,

                :longitude,

                :status,

                :user_id,

                :image_path

            )

            RETURNING

                id,

                report_id,

                title,

                description,

                issue,

                category,

                severity,

                latitude,

                longitude,

                status,

                user_id,

                image_path,

                created_at

        """)


        with engine.begin() as connection:

            result = connection.execute(

                query,

                {

                    "report_id":
                        report_id,

                    "title":
                        report.get(
                            "title",
                            ""
                        ),

                    "description":
                        report.get(
                            "description",
                            ""
                        ),

                    "issue":
                        report.get(
                            "issue",
                            ""
                        ),

                    "category":
                        report.get(
                            "category",
                            ""
                        ),

                    "severity":
                        report.get(
                            "severity",
                            ""
                        ),

                    "latitude":
                        report.get(
                            "latitude"
                        ),

                    "longitude":
                        report.get(
                            "longitude"
                        ),

                    "status":
                        "Submitted",

                    "user_id":
                        current_user["user_id"],

                    "image_path":
                        report.get(
                            "image_path"
                        )

                }

            )


            saved_report = (
                result
                .mappings()
                .first()
            )


        return {

            "success": True,

            "message":
                "Civic report submitted successfully.",

            "report":
                dict(saved_report)

        }


    except Exception as e:

        print(
            f"Submit report error: {str(e)}"
        )

        return {

            "success": False,

            "error":
                str(e)

        }


# =========================================================
# 19. GET REPORTS
# =========================================================

@app.get("/reports")
async def get_reports(
    current_user: dict = Depends(get_current_user)
):

    try:

        if current_user["role"] == "admin":

            query = text("""

                SELECT

                    id,

                    report_id,

                    title,

                    description,

                    issue,

                    category,

                    severity,

                    latitude,

                    longitude,

                    status,

                    user_id,

                    image_path,

                    created_at

                FROM reports

                ORDER BY created_at DESC

            """)

            params = {}


        else:

            query = text("""

                SELECT

                    id,

                    report_id,

                    title,

                    description,

                    issue,

                    category,

                    severity,

                    latitude,

                    longitude,

                    status,

                    user_id,

                    image_path,

                    created_at

                FROM reports

                WHERE user_id = :user_id

                ORDER BY created_at DESC

            """)

            params = {

                "user_id":
                    current_user["user_id"]

            }


        with engine.connect() as connection:

            result = connection.execute(

                query,

                params

            )


            reports = [

                dict(row)

                for row
                in result.mappings().all()

            ]


        return {

            "success": True,

            "reports":
                reports

        }


    except Exception as e:

        print(
            f"Get reports error: {str(e)}"
        )

        return {

            "success": False,

            "error":
                str(e)

        }


# =========================================================
# 20. UPDATE REPORT STATUS
# =========================================================

@app.patch("/reports/{report_id}/status")
async def update_report_status(

    report_id: str,

    data: dict,

    current_user: dict = Depends(require_admin)

):

    try:

        new_status = data.get(
            "status"
        )


        allowed_statuses = [

            "Submitted",

            "Under Review",

            "In Progress",

            "Resolved"

        ]


        if new_status not in allowed_statuses:

            return {

                "success":
                    False,

                "error":
                    "Invalid report status."

            }


        query = text("""

            UPDATE reports

            SET status = :status

            WHERE report_id = :report_id

            RETURNING

                id,

                report_id,

                title,

                description,

                issue,

                category,

                severity,

                latitude,

                longitude,

                status,

                user_id,

                image_path,

                created_at

        """)


        with engine.begin() as connection:

            result = connection.execute(

                query,

                {

                    "report_id":
                        report_id,

                    "status":
                        new_status

                }

            )


            updated_report = (

                result
                .mappings()
                .first()

            )


        if not updated_report:

            return {

                "success":
                    False,

                "error":
                    "Report not found."

            }


        return {

            "success":
                True,

            "message":
                "Report status updated successfully.",

            "report":
                dict(updated_report)

        }


    except Exception as e:

        print(
            f"Update status error: {str(e)}"
        )

        return {

            "success":
                False,

            "error":
                str(e)

        }