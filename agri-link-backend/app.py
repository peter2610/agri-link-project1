from flask_cors import CORS
from config import app, api
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

import sys, os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

CORS(app, resources={r"/*": {"origins": ["http://localhost:3000", "http://127.0.0.1:3000", "http://172.16.16.182:3000"]}}, supports_credentials=True,)    

api.add_resource(Main, '/', endpoint='main')
api.add_resource(Farmers, '/farmers', endpoint='farmers')
api.add_resource(Buyers, '/buyers', endpoint='buyers')
api.add_resource(SignupFarmer, '/farmers/signup', endpoint='signup_farmers')
api.add_resource(SigninFarmer, '/farmers/signin', endpoint='signin_farmers')
api.add_resource(SignupBuyer, '/buyers/signup', endpoint='signup_buyers')
api.add_resource(SigninBuyer, '/buyers/signin', endpoint='signin_buyers')
api.add_resource(OfferResource, '/offer', endpoint='offer')
api.add_resource(CollaborationListResource, '/collaborations', endpoint='collaboration_list')
api.add_resource(CollaborationDetailResource, '/collaborations/<int:collaboration_id>', endpoint='collaboration_detail')
api.add_resource(ContributionResource, '/collaborations/<int:collaboration_id>/contributions', endpoint='contribution')
api.add_resource(ContributionListResource, '/collaborations/<int:collaboration_id>/contributions/list', endpoint='contribution_list')
api.add_resource(CropContributorsResource, '/collaborations/<int:collaboration_id>/crops/<int:crop_id>/contributors', endpoint='crop_contributors')

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5555, debug=True)
