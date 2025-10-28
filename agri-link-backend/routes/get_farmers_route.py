from flask_restful import Resource
from models.farmer import Farmer

class Farmers(Resource):
    def get(self): 
        farmers = [farmer.to_dict() for farmer in Farmer.query.all()]

        return farmers, 200