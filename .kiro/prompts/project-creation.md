# Project Creation with Kiro AI

## Initial Prompt
Create a new full-stack project for a "Smart Interview Question & Answer Generator" with secure API key handling.

## Requirements Specified
- Frontend: Single page with HTML, CSS, JavaScript
- Backend: Flask API with AI integration
- Security: Environment variables for API keys
- Features: Generate 10 technical + 5 personal Q&A, copy to clipboard, download as PDF

## Kiro's Approach
1. Created project structure with proper separation of concerns
2. Implemented secure environment variable handling
3. Built Flask backend with CORS support
4. Created responsive frontend with modern UI
5. Added comprehensive documentation

## Iterations
1. Initial setup with Google Gemini API
2. Switched to Azure OpenAI per user request
3. Enhanced UI with animations and interview theme
4. Fixed environment variable loading from project root
5. Updated model from deprecated gemini-pro to gemini-1.5-flash (then to Azure OpenAI)

## Files Generated
- index.html (Frontend UI)
- style.css (Styling with animations)
- script.js (Frontend logic)
- backend/app.py (Flask API)
- backend/requirements.txt (Dependencies)
- .env.local.example (Safe template)
- .gitignore (Security)
- README.md (Documentation)
