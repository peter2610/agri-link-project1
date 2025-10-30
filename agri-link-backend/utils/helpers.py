from flask import request
import os
from dotenv import load_dotenv # type: ignore[import]

load_dotenv()

_openai_client = None
def get_openai_client():
    global _openai_client
    if _openai_client is None:
        try:
            from openai import OpenAI  # type: ignore[import]
        except Exception as e:
            raise RuntimeError("OpenAI SDK is not installed. Install 'openai' or disable AI features.") from e
        _openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    return _openai_client

def get_openai_model():
    return os.getenv("OPENAI_MODEL", "gpt-4o-mini")

def get_data():

    data = request.get_json(silent=True)
    if data is None:
        data = request.form.to_dict()
    return data