import yalies
import os
from dotenv import load_dotenv

load_dotenv()

api = yalies.API(os.getenv("YALIES_API_KEY"))


