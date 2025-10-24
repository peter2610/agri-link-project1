from flask_cors import CORS
import sys, os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from config import app, api
from routes.main_route import Main
from routes.offer_route import OfferResource
from routes.collaboration_route import (
    CollaborationListResource,
    CollaborationDetailResource,
    ContributionResource,
    ContributionListResource
)


# Enable CORS
CORS(app, resources={r"/*": {"origins": ["http://localhost:3000", "http://127.0.0.1:3000"]}})

# Register RESTful resources
api.add_resource(Main, '/', endpoint='main')
api.add_resource(OfferResource, '/offer', endpoint='offer')
api.add_resource(CollaborationListResource, '/collaborations', endpoint='collaboration_list')
api.add_resource(CollaborationDetailResource, '/collaborations/<int:collaboration_id>', endpoint='collaboration_detail')
api.add_resource(ContributionResource, '/collaborations/<int:collaboration_id>/contributions', endpoint='contribution')
api.add_resource(ContributionListResource, '/collaborations/<int:collaboration_id>/contributions/list', endpoint='contribution_list')

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5555, debug=True)
