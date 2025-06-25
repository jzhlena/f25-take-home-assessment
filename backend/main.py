from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, Optional
from config import WEATHERSTACK_API_KEY
import uvicorn
import requests
import uuid

app = FastAPI(title="Weather Data System", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for weather data
weather_storage: Dict[str, Dict[str, Any]] = {}

class WeatherRequest(BaseModel):
    date: str
    location: str
    notes: Optional[str] = ""

class WeatherResponse(BaseModel):
    id: str


# assuming this refers to historical response
@app.post("/weather", response_model=WeatherResponse)
async def create_weather_request(request: WeatherRequest):
    
    url = "https://api.weatherstack.com/current"
    query = {"access_key": WEATHERSTACK_API_KEY, "query": request.location}
    response = requests.get(url, params=query)
    
    if response.status_code != 200:
        raise HTTPException(status_code=502, detail="Weather API request failed")
    data = response.json()
    if "error" in data:
        raise HTTPException(status_code=400, detail=data["error"].get("info", "Invalid location"))
    weather_id = str(uuid.uuid4())
    weather_storage[weather_id] = {
        "id": weather_id,
        "date": request.date,
        "location": request.location,
        "notes": request.notes,
        "weather_data": data
    }
    return WeatherResponse(id=weather_id)

@app.get("/weather/{weather_id}")
async def get_weather_data(weather_id: str):
    """
    Retrieve stored weather data by ID.
    This endpoint is already implemented for the assessment.
    """
    if weather_id not in weather_storage:
        raise HTTPException(status_code=404, detail="Weather data not found")
    
    return weather_storage[weather_id]


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)