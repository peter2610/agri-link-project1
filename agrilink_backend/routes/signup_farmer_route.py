from flask_restful import Resource
from sqlalchemy.exc import IntegrityError
from config import db
from models.farmer import Farmer
from utils.helpers import get_data

class SignupFarmer(Resource):
    def post(self):
        data = get_data()

        try:
            farmer = Farmer(
                full_name = data.get('full_name'),
                email = data.get('email'),
                phone_number = data.get('phone_number'),
                location = data.get('location'),
            )

            farmer.password_hash = data.get('password') 

            db.session.add(farmer)
            db.session.commit()

            return farmer.to_dict(), 201
        except IntegrityError:
            db.session.rollback()
            return {'error': "Email already exists."}, 422