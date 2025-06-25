from dotenv import load_dotenv
import os

# Load .env file
load_dotenv()

# Export environment variables
WEATHERSTACK_API_KEY = os.getenv("WEATHERSTACK_API_KEY")