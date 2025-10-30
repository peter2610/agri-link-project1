from flask import session
from models.farmer import Farmer
from models.buyer import Buyer
from flask_restful import Resource

class CheckSessionFarmer(Resource):
    def get(self):
        farmer_id = session.get('farmer_id')
        if not farmer_id:
            return {}, 401
        
        farmer = Farmer.query.filter(Farmer.id == farmer_id).first()
        if not farmer:
            return {}, 401
        return farmer.to_dict(), 200
    

class CheckSessionBuyer(Resource):
    def get(self):
        buyer_id = session.get('buyer_id')
        if not buyer_id:
            return {}, 401
        
        buyer = Buyer.query.filter(Buyer.id == buyer_id).first()
        if not buyer:
            return {}, 401
        return buyer.to_dict(), 200
