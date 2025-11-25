# 🎯 Smart Interview Q&A Generator

A full-stack application that generates tailored technical and personal interview questions with answers using Google's Gemini AI.

## Features

- 🤖 AI-powered question generation using Google Gemini
- 💼 10 technical questions with detailed answers
- 👤 5 personal/behavioral questions with sample answers
- 📋 Copy all Q&A to clipboard
- 📄 Download as PDF
- 🎨 Beautiful, responsive UI
- 🔒 Secure API key handling

## Project Structure

```
.
├── index.html              # Frontend UI
├── style.css              # Styling
├── script.js              # Frontend logic
├── backend/
│   ├── app.py            # Flask backend
│   └── requirements.txt  # Python dependencies
├── .env.local.example    # Example environment file
├── .gitignore           # Git ignore rules
└── README.md            # This file
```

## 🔐 Setting Up the Gemini API Key

**IMPORTANT:** Never commit your actual API key to version control!

### Option 1: Set in Kiro Workspace (Recommended for Kiro users)

1. Open Kiro
2. Go to Settings → Environment Variables
3. Add: `GEMINI_API_KEY=your_actual_api_key_here`
4. Restart the backend server

### Option 2: Use .env.local file

1. Copy the example file:
   ```bash
   copy .env.local.example .env.local
   ```

2. Edit `.env.local` and replace `YOUR_KEY_HERE` with your actual Gemini API key:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

3. The `.env.local` file is already in `.gitignore` and won't be committed

### Option 3: Set Environment Variable (Windows)

**PowerShell:**
```powershell
$env:GEMINI_API_KEY="your_actual_api_key_here"
python backend/app.py
```

**CMD:**
```cmd
set GEMINI_API_KEY=your_actual_api_key_here
python backend/app.py
```

### Getting a Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key and use it in one of the methods above

## 🚀 Installation & Running

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set your Gemini API key (see section above)

5. Run the Flask server:
   ```bash
   python app.py
   ```

   The backend will start on `http://localhost:5000`

### Frontend Setup

1. Open `index.html` in your browser, or
2. Use a simple HTTP server:
   ```bash
   python -m http.server 8000
   ```
   Then visit `http://localhost:8000`

## 🧪 Testing the API

### Using curl (PowerShell)

```powershell
curl -X POST http://localhost:5000/generate `
  -H "Content-Type: application/json" `
  -d '{"role": "Senior Frontend Developer"}'
```

### Using curl (CMD)

```cmd
curl -X POST http://localhost:5000/generate -H "Content-Type: application/json" -d "{\"role\": \"Senior Frontend Developer\"}"
```

### Using JavaScript fetch

```javascript
fetch('http://localhost:5000/generate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ role: 'Data Scientist' })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```

### Health Check

```bash
curl http://localhost:5000/health
```

Response:
```json
{
  "status": "healthy",
  "api_key_configured": true
}
```

## 📝 API Documentation

### POST /generate

Generates interview questions and answers for a given role.

**Request:**
```json
{
  "role": "Senior Frontend Developer"
}
```

**Response:**
```json
{
  "technical": [
    {
      "question": "What is the difference between let, const, and var?",
      "answer": "let and const are block-scoped..."
    }
    // ... 9 more technical questions
  ],
  "personal": [
    {
      "question": "Tell me about a challenging project you worked on.",
      "answer": "In my previous role, I worked on..."
    }
    // ... 4 more personal questions
  ]
}
```

**Error Response:**
```json
{
  "error": "Error message here"
}
```

## 🎨 How I Used Kiro

This project was built with assistance from Kiro AI:

### Development Process

1. **Project Setup**: Kiro helped structure the full-stack application with proper separation of concerns
2. **Security Implementation**: Ensured API keys are never committed by:
   - Creating `.gitignore` with proper rules
   - Using environment variables
   - Providing `.env.local.example` as a template
3. **Backend Development**: Built Flask API with:
   - CORS handling for frontend communication
   - Error handling and validation
   - Gemini AI integration
4. **Frontend Development**: Created responsive UI with:
   - Clean, modern design
   - Loading states and error handling
   - Copy and PDF download features
5. **Documentation**: Generated comprehensive README with setup instructions

### Kiro Features Used

- 🤖 **Code Generation**: Generated boilerplate and implementation code
- 📁 **File Management**: Created proper project structure
- 🔍 **Best Practices**: Ensured security and code quality
- 📚 **Documentation**: Helped write clear setup instructions

### Screenshots

*[Add screenshots or GIFs of your application here]*

Example workflow:
1. Enter role (e.g., "Senior Frontend Developer")
2. Click "Generate Interview Q&A"
3. View generated questions and answers
4. Copy to clipboard or download as PDF

## 🛠️ Technologies Used

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Python, Flask
- **AI**: Google Gemini API
- **PDF Generation**: jsPDF
- **CORS**: Flask-CORS

## 📋 Requirements

- Python 3.8+
- Google Gemini API key
- Modern web browser

## 🔒 Security Notes

- ✅ API key stored in environment variables
- ✅ `.env.local` added to `.gitignore`
- ✅ Example file (`.env.local.example`) safe to commit
- ✅ Backend validates API key presence
- ✅ No secrets in source code

## 🐛 Troubleshooting

### "GEMINI_API_KEY not configured" error

- Make sure you've set the environment variable before running the backend
- Check that the variable name is exactly `GEMINI_API_KEY`
- Restart the Flask server after setting the variable

### CORS errors

- Ensure the backend is running on port 5000
- Check that Flask-CORS is installed: `pip install flask-cors`

### Connection refused

- Verify the backend server is running
- Check that the frontend is making requests to `http://localhost:5000`

## 📄 License

MIT License - feel free to use this project for learning and development!

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

---

Built with ❤️ using Kiro AI Assistant
