from flask_restful import Resource
from models.buyer import Buyer

class Buyers(Resource):
    def get(self): 
        buyers = [buyer.to_dict() for buyer in Buyer.query.all()]

        return buyers, 200