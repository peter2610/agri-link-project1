from flask_restful import Resource
from flask import session
from utils.helpers import get_data
from models.farmer import Farmer

class SigninFarmer(Resource):
    def post(self):
        data = get_data()
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return {"error": "Email and Password are required."}, 422
        
        farmer = Farmer.query.filter_by(email=email).first()
        if farmer and farmer.authenticate(password):
            session['farmer_id'] = farmer.id
            return farmer.to_dict(), 200
        
        return {"error": "Invalid email or password."}, 401