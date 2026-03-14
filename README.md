# *TripPlanner AI*

A containerized full-stack application that generates personalized 3-day travel itineraries using the Gemini API. Users input a destination and travel style, and the app returns a structured day-by-day plan powered by AI.

## *Tech-Stack*

- **Backend:** FastAPI (Python)
- **Frontend:** Next.js (React)
- **AI:** Google Gemini 2.5 Flash API with JSON mode
- **DevOps:** Docker and Docker Compose

## *How It Works*

1. The user enters a destination and selects a travel style on the frontend.
2. The Next.js frontend sends a POST request to the FastAPI backend.
3. The backend constructs a prompt and calls the Gemini API with JSON mode enabled, which forces the model to return a valid structured response.
4. The response is validated against a Pydantic schema and returned to the frontend.
5. The frontend renders the itinerary in a clean day-by-day layout.

## *Notes*

This project uses Gemini JSON mode which ensures the AI always returns a
valid, parseable JSON response rather than free-form text. The frontend
and backend run in separate Docker containers connected through a shared
Docker network defined in docker-compose.yml.
