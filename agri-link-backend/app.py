# from flask import request, session
from flask_cors import CORS
from config import app, api
from routes.main_route import Main


CORS(app, resources={r"/*": {"origins": ["http://localhost:3000", "http://127.0.0.1:3000"]}})    

api.add_resource(Main, '/', endpoint='main')

if __name__ == '__main__':
    app.run( port=5555, debug=True)