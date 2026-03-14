# ✈️ AI Travel Architect

A full-stack application that generates 3-day travel itineraries using the Gemini API.

**Stack:** FastAPI · Next.js · Gemini API · Docker Compose

---

## 🚀 Quick Start

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/travel-architect.git
cd travel-architect
```

### 2. Add your Gemini API key
```bash
# Edit the .env file
GOOGLE_API_KEY=your_actual_key_here
```
Get your key at: https://aistudio.google.com/app/apikey

### 3. Run with Docker
```bash
docker-compose up --build
```

### 4. Open the app
Visit: http://localhost:3000

---

## 📁 Project Structure

```
travel-architect/
├── docker-compose.yml
├── .env                   # Your API key goes here
├── backend/
│   ├── Dockerfile
│   ├── main.py            # FastAPI app + Gemini integration
│   └── requirements.txt
└── frontend/
    ├── Dockerfile
    ├── pages/
    │   └── index.js       # Main UI
    └── package.json
```

---

## 🔑 How it Works

1. User enters a **destination** and **travel style**
2. Frontend sends a POST request to `/generate-itinerary`
3. FastAPI calls the **Gemini API in JSON mode** for a structured 3-day plan
4. Frontend renders the result in a clean day-by-day UI
