from flask_restful import Resource
from sqlalchemy.exc import IntegrityError
from config import db
from models.buyer import Buyer
from utils.helpers import get_data

class SignupBuyer(Resource):
    def post(self):
        data = get_data()

        try:
            buyer = Buyer(
                full_name = data.get('full_name'),
                email = data.get('email'),
                location = data.get('location'),
            )

            buyer.password_hash = data.get('password') 

            db.session.add(buyer)
            db.session.commit()

            return buyer.to_dict(), 201
        except IntegrityError:
            db.session.rollback()
            return {'error': "Email already exists."}, 422