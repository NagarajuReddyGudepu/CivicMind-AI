# CivicMind AI

## AI-Powered Civic Issue Reporting and Management Platform

CivicMind AI is an AI-powered civic technology platform designed to make reporting and managing public civic issues faster, easier, and more organized.

The system allows citizens to report real-world civic problems such as potholes, garbage, streetlight problems, water leakage, drainage issues, fallen trees, and damaged public infrastructure by simply uploading an image.

CivicMind AI uses Google Gemini AI to analyze the uploaded image, identify the civic issue, classify its category, estimate confidence and severity, and provide an explanation.

The system then helps generate a structured complaint, captures the issue location, stores the report and image securely, and provides administrators with a centralized dashboard to monitor, manage, and track civic issues.

---

## Live Application

### Live Website

https://civicmind-ai-frontend.onrender.com

---

## GitHub Repository

https://github.com/NagarajuReddyGudepu/CivicMind-AI

---

# Problem Statement

Citizens regularly encounter civic problems such as:

- Potholes and damaged roads
- Garbage and waste accumulation
- Streetlight problems
- Water leakage
- Drainage issues
- Fallen trees
- Damaged public infrastructure

However, reporting these problems can be difficult because citizens may need to manually describe the issue, provide sufficient information, identify the correct category, and communicate the exact location.

From the authority side, manually reviewing and categorizing large numbers of reports can also take significant time.

CivicMind AI addresses these challenges by using Artificial Intelligence to assist citizens in creating structured civic reports and by providing authorities with a centralized platform to manage them.

---

# Our Solution

CivicMind AI creates a complete digital workflow between citizens and civic authorities.

Instead of requiring citizens to manually describe every detail of a civic problem, the system uses an uploaded image and AI to understand the problem.

The complete process is:

~~~text
Citizen
   ↓
Login
   ↓
Upload Civic Issue Image
   ↓
Image Optimization
   ↓
Gemini AI Analysis
   ↓
Issue Detection
   ↓
Category + Confidence + Severity + Explanation
   ↓
Automatic Complaint Generation
   ↓
Select Location
   ↓
Submit Report
   ↓
Cloudinary Image Storage
   ↓
PostgreSQL Database
   ↓
Unique Report ID
   ↓
Admin Dashboard
   ↓
Reports + Map + User Management
   ↓
Status Update
   ↓
Citizen Tracks Report
~~~

---

# How the System Works

## 1. Citizen Login

Citizens can securely log into the CivicMind AI platform.

After login, citizens can access features such as:

- Report Issue
- My Reports
- Profile
- Report tracking

---

## 2. Upload Civic Issue Image

The citizen uploads a photograph of the civic problem.

Examples:

- Pothole
- Garbage accumulation
- Water leakage
- Broken streetlight
- Drainage problem
- Fallen tree
- Damaged infrastructure

The uploaded image is processed before being sent for AI analysis.

---

## 3. Image Optimization

Large images are optimized before AI processing.

The system performs image optimization to reduce unnecessary processing time.

~~~text
Original Image
      ↓
Resize Large Image
      ↓
Convert to Optimized JPEG
      ↓
AI Processing
~~~

This improves upload and processing efficiency while maintaining sufficient image quality for issue detection.

---

# AI-Powered Civic Issue Analysis

CivicMind AI uses Google Gemini AI to analyze uploaded civic issue images.

The AI identifies:

- Detected civic issue
- Issue category
- Confidence level
- Severity level
- Explanation of the detected problem

The AI result helps transform an ordinary citizen photograph into structured civic information.

---

# Supported Civic Issue Categories

The system currently supports 8 categories:

1. Road / Infrastructure
2. Garbage / Waste
3. Streetlight
4. Water Leakage
5. Public Infrastructure
6. Fallen Tree
7. Drainage
8. Other

---

# Example AI Analysis

For example, if a citizen uploads an image of a large pothole:

~~~text
Detected Issue:
Pothole / Damaged Road

Category:
Road / Infrastructure

Confidence:
High

Severity:
High

Explanation:
The image shows significant road surface damage with a large pothole
and surrounding cracks.
~~~

The actual AI result is generated dynamically based on the uploaded image.

---

# Automatic Complaint Generation

After analyzing the image, CivicMind AI creates a structured complaint based on the detected civic issue.

The generated complaint can contain:

- Complaint title
- Problem description
- Detected issue
- Issue category
- Severity
- Location information

This reduces the effort required from citizens to manually write detailed complaints.

It also helps maintain a more structured format for reports received by authorities.

---

# Location Capture

Citizens can provide the location of the civic issue while submitting the report.

The location is stored along with the report so administrators can understand where the problem occurred.

Location information is also used for the application's Map View.

---

# Report Submission

After completing the report, the citizen submits it to the system.

The report contains important information such as:

- Citizen information
- Issue details
- AI analysis
- Complaint information
- Location
- Image
- Report status

A unique Report ID is generated for each submitted report.

Example:

~~~text
CM-EFF547D3
~~~

The Report ID can be used to identify and track the report.

---

# Image Storage with Cloudinary

CivicMind AI uses Cloudinary for persistent storage of civic issue images.

The image storage workflow is:

~~~text
Citizen Image
      ↓
Image Optimization
      ↓
Cloudinary Upload
      ↓
Secure Image URL
      ↓
PostgreSQL Report Record
~~~

Instead of depending on temporary local server storage, the deployed application stores report images using Cloudinary.

This allows uploaded images to remain accessible after deployment.

---

# PostgreSQL Database

CivicMind AI uses PostgreSQL to store application data.

The database stores information related to:

- Users
- Citizen reports
- Report IDs
- Issue details
- AI analysis
- Complaint information
- Locations
- Image URLs
- Report status

The production database is hosted using Neon PostgreSQL.

---

# My Reports

Citizens can access their submitted reports through the My Reports section.

Citizens can view:

- Report ID
- Issue information
- Uploaded image
- Location
- Complaint details
- Current report status

This provides transparency and allows citizens to track their submitted issues.

---

# Report Status Tracking

Administrators can update the status of submitted reports.

The report workflow can progress through stages such as:

~~~text
Submitted
    ↓
Under Review
    ↓
In Progress
    ↓
Resolved
~~~

Citizens can view the latest status of their reports through My Reports.

---

# Admin Dashboard

CivicMind AI provides a separate administrator interface for managing civic reports.

Administrators can:

- View all citizen reports
- View report details
- View uploaded issue images
- View AI analysis
- View complaint information
- View issue locations
- Update report status
- Manage users
- Access settings
- Monitor civic issues

The admin dashboard provides a centralized interface for authority-side management.

---

# Map View

CivicMind AI includes a Map View for visualizing reported civic issues.

Administrators can:

- View reported issue locations
- Select individual report markers
- View report information
- Track where civic problems are occurring

This provides a geographic view of reported civic issues and can help authorities understand problem locations.

---

# User Management

The administrator can access the Users section to view registered users and manage user-related information.

This provides the administrative side with better visibility into platform users.

---

# Authentication and Access Control

CivicMind AI provides separate access for citizens and administrators.

The system uses authentication and protected backend APIs to control access to different features.

Citizens can access their own reports, while administrators have access to management features such as:

- All reports
- User management
- Map View
- Status updates
- Administrative settings

---

# Security

Security considerations implemented in the project include:

- JWT-based authentication
- Separate citizen and administrator access
- Protected backend APIs
- Admin-only management operations
- Environment variables for sensitive credentials
- Database-backed user and report management

Sensitive API keys, database credentials, and other secrets are not stored in the GitHub repository.

---

# System Architecture

~~~text
                         ┌───────────────────┐
                         │      CITIZEN      │
                         └─────────┬─────────┘
                                   │
                                   ▼
                         ┌───────────────────┐
                         │  React Frontend   │
                         │      + Vite       │
                         └─────────┬─────────┘
                                   │
                                   ▼
                         ┌───────────────────┐
                         │  FastAPI Backend  │
                         └──────┬─────┬──────┘
                                │     │
                    ┌───────────┘     └────────────┐
                    ▼                              ▼
           ┌─────────────────┐            ┌─────────────────┐
           │   Google Gemini │            │   PostgreSQL    │
           │       AI        │            │     Database    │
           └────────┬────────┘            └────────┬────────┘
                    │                              │
                    ▼                              │
           ┌─────────────────┐                      │
           │   Cloudinary    │                      │
           │  Image Storage  │                      │
           └────────┬────────┘                      │
                    │                              │
                    └──────────────┬───────────────┘
                                   ▼
                         ┌───────────────────┐
                         │  Admin Dashboard  │
                         │                   │
                         │ Reports           │
                         │ Map View          │
                         │ Users             │
                         │ Status Management │
                         └───────────────────┘
~~~

---

# Technology Stack

## Frontend

- React.js
- Vite
- JavaScript
- HTML
- CSS

## Backend

- Python
- FastAPI

## Artificial Intelligence

- Google Gemini API

## Database

- PostgreSQL
- Neon PostgreSQL

## Image Storage

- Cloudinary

## Authentication

- JWT

## Deployment

- Render

---

# Project Structure

~~~text
CivicMind-AI/
│
├── backend/
│   ├── database.py
│   ├── main.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── index.html
│
└── .gitignore
~~~

---

# Backend API

The FastAPI backend provides APIs for the application's main operations.

Important backend functionality includes:

~~~text
/
    Backend root endpoint

/health
    Backend health check

/analyze-image
    Analyze civic issue image using Gemini AI

/upload-report-image
    Upload report image to Cloudinary

/submit-report
    Submit and store a civic report

/reports
    Retrieve reports based on user access

/users
    Administrative user management
~~~

The backend connects the frontend, AI service, image storage, and PostgreSQL database.

---

# Real-World Use Case

## Example: Pothole / Road Issue

Imagine a citizen finds a large pothole on a public road.

### Step 1

The citizen opens CivicMind AI and logs in.

### Step 2

The citizen opens Report Issue.

### Step 3

The citizen uploads a photograph of the pothole.

### Step 4

Gemini AI analyzes the image.

### Step 5

The system identifies:

~~~text
Category:
Road / Infrastructure

Severity:
High

Confidence:
High
~~~

### Step 6

The system generates a structured complaint.

### Step 7

The citizen selects the issue location.

### Step 8

The report is submitted.

### Step 9

The image is stored in Cloudinary.

### Step 10

The report information is stored in PostgreSQL.

### Step 11

A unique Report ID is generated.

### Step 12

The administrator views the report in the admin dashboard.

### Step 13

The administrator views the issue location on the map.

### Step 14

The administrator updates the report status.

### Step 15

The citizen tracks the report through My Reports.

This demonstrates the complete workflow from citizen reporting to administrative management.

---

# Performance Optimization

CivicMind AI includes image optimization to improve processing efficiency.

Large images are resized and compressed before AI analysis and image storage.

This helps:

- Reduce image size
- Reduce upload time
- Reduce AI processing overhead
- Improve application responsiveness

The system also uses persistent cloud image storage instead of relying on temporary local files in production.

---

# Deployment

The application is deployed using Render.

## Frontend

https://civicmind-ai-frontend.onrender.com

## Backend

https://civicmind-ai-backend-1u8u.onrender.com

The frontend communicates with the deployed FastAPI backend through the configured API URL.

---

# Local Installation

## 1. Clone the Repository

~~~bash
git clone https://github.com/NagarajuReddyGudepu/CivicMind-AI.git
cd CivicMind-AI
~~~

## 2. Backend Setup

~~~bash
cd backend
pip install -r requirements.txt
~~~

Create a `.env` file inside the backend folder.

Example:

~~~env
GOOGLE_API_KEY=your_google_gemini_api_key

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

DATABASE_URL=your_postgresql_database_url
JWT_SECRET_KEY=your_jwt_secret
~~~

Do not upload the `.env` file to GitHub.

Start the backend:

~~~bash
uvicorn main:app --reload
~~~

## 3. Frontend Setup

Open another terminal:

~~~bash
cd frontend
npm install
npm run dev
~~~

The frontend will normally run at:

~~~text
http://localhost:5173
~~~

---

# Environment Variables

The application requires configuration values for external services.

Important variables include:

~~~text
GOOGLE_API_KEY
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
DATABASE_URL
JWT_SECRET_KEY
~~~

These values should be stored in environment variables and should never be committed to GitHub.

---

# Key Features

## Citizen Side

- Secure citizen login
- Civic issue image upload
- AI-powered issue detection
- Automatic issue classification
- Confidence detection
- Severity detection
- AI explanation
- Automatic complaint generation
- Location selection
- Report submission
- Unique Report ID
- My Reports
- Report status tracking
- Profile management

## Administrator Side

- Secure admin login
- Admin dashboard
- View all reports
- View report details
- View issue images
- View AI analysis
- Map-based issue tracking
- Update report status
- User management
- System settings

---

# Innovation

CivicMind AI combines multiple technologies into a single civic issue management workflow.

Instead of treating image analysis, complaint creation, location tracking, and administrative management as separate systems, CivicMind AI connects them into one platform.

The main innovation is the use of AI to convert a simple citizen-uploaded image into structured civic information that can be processed and managed by authorities.

---

# Social Impact

CivicMind AI is designed to improve communication between citizens and civic authorities.

The platform aims to provide:

- Easier civic issue reporting
- Faster issue identification
- Structured complaints
- Better location awareness
- Centralized administrative management
- Transparent report tracking
- Better digital civic engagement

The system can potentially support smarter and more responsive civic issue management.

---

# Future Enhancements

Possible future improvements include:

- Regional language support
- Telugu language interface
- Multilingual AI-generated complaints
- Automatic department assignment
- Duplicate complaint detection
- AI-based priority prediction
- Email and SMS notifications
- Real-time status notifications
- Advanced civic analytics
- Civic issue heatmaps
- Mobile application
- Integration with official municipal systems
- Historical civic issue analysis

---

# Hackathon Information

## Project

CivicMind AI

## Selected Problem Area

AI for Everyday Life

## Core Idea

Use Artificial Intelligence to simplify civic issue reporting and help authorities efficiently manage and track public problems.

---

# Demo Flow

The project can be demonstrated using the following workflow:

~~~text
Home
  ↓
Citizen Login
  ↓
Citizen Dashboard
  ↓
Report Issue
  ↓
Upload Image
  ↓
AI Analysis
  ↓
Complaint Generation
  ↓
Location Selection
  ↓
Submit Report
  ↓
Report ID
  ↓
My Reports
  ↓
Admin Login
  ↓
Admin Dashboard
  ↓
Reports
  ↓
Update Status
  ↓
Map View
  ↓
Users
~~~

---

# Live Demo

Visit the deployed application:

https://civicmind-ai-frontend.onrender.com

---

# Repository

Source code:

https://github.com/NagarajuReddyGudepu/CivicMind-AI

---

# Conclusion

CivicMind AI demonstrates how Artificial Intelligence can be applied to a practical everyday civic problem.

By combining:

- React
- FastAPI
- Google Gemini AI
- PostgreSQL
- Cloudinary
- JWT authentication
- Map-based tracking
- Cloud deployment

the platform provides a complete workflow for citizens to report civic issues and for administrators to monitor, manage, and track those issues.

CivicMind AI aims to make civic issue reporting simpler for citizens and more organized for authorities.

---

## CivicMind AI

### Report. Analyze. Track. Improve.
