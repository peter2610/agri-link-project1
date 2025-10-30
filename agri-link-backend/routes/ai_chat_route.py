from flask import request
from flask_restful import Resource
from werkzeug.exceptions import BadRequest, InternalServerError
from utils.helpers import get_openai_client, get_openai_model

SYSTEM_PROMPT = (
    "You are AgriLink Assistant. Reply like a short text chat — under 3 sentences. "
    "Be clear, practical, and conversational. Avoid long explanations."
)

class AiChat(Resource):
    def post(self):
        data = request.get_json(silent=True) or {}
        user_msg = (data.get("message") or "").strip()
        if not user_msg:
            raise BadRequest("message is required")

        try:
            client = get_openai_client()
            model = get_openai_model()
            resp = client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user",   "content": user_msg},
                ],
                temperature=0.5,
                max_tokens=80,
            )
            answer = (resp.choices[0].message.content or "").strip()
            return {"message": answer}, 200
        except Exception as e:
            # raise InternalServerError("AI service error")
            return {"error": str(e)}, 500

