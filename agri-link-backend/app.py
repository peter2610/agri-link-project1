import sys, os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
# app.py
from flask_cors import CORS
from config import app, api, db
from routes.main_route import Main
from routes.get_buyers_route import Buyers
from routes.get_farmers_route import Farmers
from routes.signin_farmer_route import SigninFarmer
from routes.signup_farmer_route import SignupFarmer
from routes.signin_buyer_route import SigninBuyer
from routes.signup_buyer_route import SignupBuyer
from routes.offer_route import OfferResource
from routes.collaboration_route import (
    CollaborationListResource,
    CollaborationDetailResource,
    ContributionResource,
    ContributionListResource,
    CropContributorsResource,
)
from routes.dashboard_route import DashboardResource, FarmerStatsResource
from routes.order_route import OrderListResource, OrderDetailResource, OrderStatisticsResource
from routes.mailing_list_route import AddToMailingList, GetMailingList
from routes.seed_offers_route import SeedOffersResource
from routes.ai_chat_route import AiChat
from routes.signin_farmer_route import CheckSessionFarmer



# ✅ Detect DATABASE_URL from Render (PostgreSQL) or fallback to SQLite locally
database_url = os.getenv("DATABASE_URL")

if database_url:
    # 🟢 Render PostgreSQL
    app.config["SQLALCHEMY_DATABASE_URI"] = database_url
    print("⚙️ Using Render PostgreSQL database")
else:
    # 🟡 Local development (SQLite)
    db_path = os.getenv('DB_PATH', 'instance/app.db')

    def _ensure_path(p):
        d = os.path.dirname(p) or '.'
        os.makedirs(d, exist_ok=True)
        try:
            with open(p, 'a'):
                pass
            return p
        except Exception:
            return None

    resolved = _ensure_path(db_path)
    if not resolved:
        fallback = os.getenv('FALLBACK_DB_PATH', '/tmp/app.db')
        resolved = _ensure_path(fallback)
        db_path = resolved or db_path
    else:
        db_path = resolved

    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
    print("⚙️ Using local SQLite database (no DATABASE_URL found)")

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# ✅ Enable CORS for frontend connection (env-driven)
# Set ALLOWED_ORIGINS as a comma-separated list in your environment, e.g.:
#   ALLOWED_ORIGINS=https://your-frontend.vercel.app,https://www.yourdomain.com
default_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://172.16.16.182:3000",
]
env_origins = os.getenv("ALLOWED_ORIGINS", "").strip()
allowed_origins = [o.strip() for o in env_origins.split(",") if o.strip()] or default_origins

CORS(
    app,
    resources={r"/*": {"origins": allowed_origins}},
    supports_credentials=True,
)

# ----- Global JSON error handlers -----
from flask import jsonify

def _json_error(message, status, details=None):
    payload = {"error": message}
    if details:
        payload["details"] = str(details)
    response = jsonify(payload)
    response.status_code = status
    return response

@app.errorhandler(400)
def handle_400(e):
    return _json_error("Bad Request", 400, getattr(e, "description", None))

@app.errorhandler(401)
def handle_401(e):
    return _json_error("Unauthorized", 401, getattr(e, "description", None))

@app.errorhandler(403)
def handle_403(e):
    return _json_error("Forbidden", 403, getattr(e, "description", None))

@app.errorhandler(404)
def handle_404(e):
    return _json_error("Not Found", 404, getattr(e, "description", None))

@app.errorhandler(422)
def handle_422(e):
    return _json_error("Unprocessable Entity", 422, getattr(e, "description", None))

@app.errorhandler(Exception)
def handle_exception(e):
    # Surface details to help diagnose production errors quickly
    return _json_error("Internal Server Error", 500, e)

# ✅ Ensure tables exist (runs once on startup)
with app.app_context():
    db.create_all()

# ✅ Register Routes
api.add_resource(Main, '/', endpoint='main')
api.add_resource(Farmers, '/farmers', endpoint='farmers')
api.add_resource(Buyers, '/buyers', endpoint='buyers')
api.add_resource(SignupFarmer, '/farmers/signup', endpoint='signup_farmers')
api.add_resource(SigninFarmer, '/farmers/signin', endpoint='signin_farmers')
api.add_resource(SignupBuyer, '/buyers/signup', endpoint='signup_buyers')
api.add_resource(SigninBuyer, '/buyers/signin', endpoint='signin_buyers')
api.add_resource(OfferResource, '/offers', endpoint='offer')
api.add_resource(CollaborationListResource, '/collaborations', endpoint='collaboration_list')
api.add_resource(CollaborationDetailResource, '/collaborations/<int:collaboration_id>', endpoint='collaboration_detail')
api.add_resource(ContributionResource, '/collaborations/<int:collaboration_id>/contributions', endpoint='contribution')
api.add_resource(ContributionListResource, '/collaborations/<int:collaboration_id>/contributions/list', endpoint='contribution_list')
api.add_resource(CropContributorsResource, '/collaborations/<int:collaboration_id>/crops/<int:crop_id>/contributors', endpoint='crop_contributors')

# Farmer's Dashboard
api.add_resource(DashboardResource, '/farmer/dashboard', '/farmer/dashboard/<int:farmer_id>')
api.add_resource(FarmerStatsResource, '/farmer/<int:farmer_id>/stats')

# Orders
api.add_resource(OrderListResource, '/orders')
api.add_resource(OrderDetailResource, '/orders/<int:order_id>')
api.add_resource(OrderStatisticsResource, '/orders/statistics')

api.add_resource(AddToMailingList, '/join_mailinglist')
api.add_resource(GetMailingList, '/mailinglist')
api.add_resource(SeedOffersResource, '/seed_offers')
api.add_resource(AiChat, "/ai/chat")
api.add_resource(CheckSessionFarmer, "/farmer/check_session")
# api.add_resource(CheckSessionBuyer, "/buyer/check_session")

# ✅ Run Server
if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5555))
    debug = os.environ.get("FLASK_DEBUG", "False").lower() == "true"
    app.run(port=5555, debug=True)
