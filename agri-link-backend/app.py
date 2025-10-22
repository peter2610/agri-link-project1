# from flask import request, session
from flask_cors import CORS
from config import app, api
from routes.main_route import Main
from routes.get_buyers_route import Buyers
from routes.get_farmers_route import Farmers


CORS(app, resources={r"/*": {"origins": ["http://localhost:3000", "http://127.0.0.1:3000"]}})    

api.add_resource(Main, '/', endpoint='main')
api.add_resource(Farmers, '/farmers', endpoint='farmers')
api.add_resource(Buyers, '/buyers', endpoint='buyers')

if __name__ == '__main__':
    app.run( port=5555, debug=True)