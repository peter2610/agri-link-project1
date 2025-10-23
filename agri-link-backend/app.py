from flask_cors import CORS
import sys, os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from config import app, api
from routes.main_route import Main
from routes.offer_route import OfferResource

# Enable CORS
CORS(app, resources={r"/*": {"origins": ["http://localhost:3000", "http://127.0.0.1:3000"]}})

# Register RESTful resources
api.add_resource(Main, '/', endpoint='main')
api.add_resource(OfferResource, '/offer', endpoint='offer')

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5555, debug=True)
