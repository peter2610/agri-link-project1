from flask_restful import Resource

class Main(Resource):
    def get(self):
        return "Welcome to Agri Link Backend APIs"
    