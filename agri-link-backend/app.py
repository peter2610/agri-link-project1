# from flask import request, session
from flask_cors import CORS
from config import app, api
from routes.main_route import Main
from routes.get_buyers_route import Buyers
from routes.get_farmers_route import Farmers
from routes.signin_farmer_route import SigninFarmer
from routes.signup_farmer_route import SignupFarmer


CORS(app, resources={r"/*": {"origins": ["http://localhost:3000", "http://127.0.0.1:3000", "http://172.16.16.182:3000"]}}, supports_credentials=True,)    

api.add_resource(Main, '/', endpoint='main')
api.add_resource(Farmers, '/farmers', endpoint='farmers')
api.add_resource(Buyers, '/buyers', endpoint='buyers')
api.add_resource(SignupFarmer, '/farmers/signup', endpoint='signup_farmers')
api.add_resource(SigninFarmer, '/farmers/signin', endpoint='signin_farmers')

if __name__ == '__main__':
    app.run( port=5555, debug=True)