from flask_restful import Resource
from flask import session
from utils.helpers import get_data
from models.buyer import Buyer

class SigninBuyer(Resource):
    def post(self):
        data = get_data()
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return {"error": "Email and Password are required."}, 422
        
        buyer = Buyer.query.filter_by(email=email).first()
        if buyer and buyer.authenticate(password):
            session['buyer_id'] = buyer.id
            return buyer.to_dict(), 200
        
        return {"error": "Invalid email or password."}, 401