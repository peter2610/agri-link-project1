# from flask import request, session
from flask_cors import CORS
from config import app, api, db
from routes.main_route import Main
from routes.dashboard_routes import DashboardResource, FarmerStatsResource
from routes.order_routes import OrderListResource, OrderDetailResource, OrderStatisticsResource

# Import models to ensure they are registered with SQLAlchemy
from models import Farmer, Crop, Order, Collaboration, Dashboard

CORS(app, resources={r"/*": {"origins": ["http://localhost:3000", "http://127.0.0.1:3000"]}})    

# Register routes
api.add_resource(Main, '/', endpoint='main')

# Dashboard routes
api.add_resource(DashboardResource, '/api/dashboard', '/api/dashboard/<int:farmer_id>')
api.add_resource(FarmerStatsResource, '/api/farmer/<int:farmer_id>/stats')

# Order routes
api.add_resource(OrderListResource, '/api/orders')
api.add_resource(OrderDetailResource, '/api/orders/<int:order_id>')
api.add_resource(OrderStatisticsResource, '/api/orders/statistics')

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run( port=5555, debug=True)