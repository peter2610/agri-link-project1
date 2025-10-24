# routes/collaboration_route.py
from flask_restful import Resource, reqparse
from flask import jsonify
from config import db
from models.collaboration import Collaboration, CollaborationParticipation, CollaborationCrop

# Parser for POST contributions
contribution_parser = reqparse.RequestParser()
contribution_parser.add_argument('farmer_name', type=str, required=True, help="Farmer name is required")
contribution_parser.add_argument('weight', type=float, required=True, help="Weight to contribute is required")
contribution_parser.add_argument('crop_id', type=int, required=True, help="Crop ID is required")  # Added crop selection

# Parser for creating new collaboration
collaboration_parser = reqparse.RequestParser()
collaboration_parser.add_argument('order_id', type=str, required=True, help="Order ID is required")
collaboration_parser.add_argument('location', type=str, required=True, help="Location is required")
collaboration_parser.add_argument('crops', type=list, location='json', required=True, help="Crops list is required")


class CollaborationListResource(Resource):
    def get(self):
        collaborations = Collaboration.query.all()
        result = []
        for c in collaborations:
            crops = [
                {
                    'id': crop.id,
                    'crop_name': crop.crop_name,
                    'price': crop.price,
                    'weight_demand': crop.weight_demand,
                    'contributed_weight': crop.contributed_weight
                }
                for crop in c.crops
            ]
            result.append({
                'id': c.id,
                'order_id': c.order_id,
                'location': c.location,
                'crops': crops,
                'total_contributed_weight': sum([p.weight_contributed for p in c.participations])
            })
        return jsonify(result)

    def post(self):
        data = collaboration_parser.parse_args()
        collaboration = Collaboration(order_id=data['order_id'], location=data['location'])
        db.session.add(collaboration)
        db.session.commit()  # Generate collaboration.id

        for crop in data['crops']:
            new_crop = CollaborationCrop(
                collaboration_id=collaboration.id,
                crop_name=crop['crop_name'],
                price=crop['price'],
                weight_demand=crop['weight_demand']
            )
            db.session.add(new_crop)
        db.session.commit()

        return jsonify({'message': f"Collaboration {collaboration.order_id} created successfully", 'id': collaboration.id})


class CollaborationDetailResource(Resource):
    def get(self, collaboration_id):
        collaboration = Collaboration.query.get_or_404(collaboration_id)
        crops = [
            {
                'id': crop.id,
                'crop_name': crop.crop_name,
                'price': crop.price,
                'weight_demand': crop.weight_demand,
                'contributed_weight': crop.contributed_weight
            }
            for crop in collaboration.crops
        ]
        participations = [
            {
                'farmer_name': p.farmer_name,
                'crop_id': p.crop_id,
                'weight_contributed': p.weight_contributed
            }
            for p in collaboration.participations
        ]
        return jsonify({
            'id': collaboration.id,
            'order_id': collaboration.order_id,
            'location': collaboration.location,
            'crops': crops,
            'participations': participations
        })


class ContributionResource(Resource):
    def post(self, collaboration_id):
        """
        Add a contribution to a selected crop in a collaboration.
        JSON body:
        {
            "farmer_name": "Peter",
            "crop_id": 1,
            "weight": 10
        }
        """
        data = contribution_parser.parse_args()
        collaboration = Collaboration.query.get_or_404(collaboration_id)

        # Get selected crop
        crop = CollaborationCrop.query.filter_by(id=data['crop_id'], collaboration_id=collaboration_id).first_or_404()
        remaining = crop.weight_demand - crop.contributed_weight
        if remaining <= 0:
            return jsonify({'message': f"Crop {crop.crop_name} is already fully contributed"}), 400

        contribution_for_crop = min(data['weight'], remaining)
        crop.contributed_weight += contribution_for_crop

        # Track farmer's contribution
        participation = CollaborationParticipation(
            collaboration_id=collaboration_id,
            crop_id=crop.id,
            farmer_name=data['farmer_name'],
            weight_contributed=contribution_for_crop
        )
        db.session.add(participation)
        db.session.commit()

        # Return updated crop progress
        updated_crops = [
            {
                'id': c.id,
                'crop_name': c.crop_name,
                'weight_demand': c.weight_demand,
                'contributed_weight': c.contributed_weight
            }
            for c in collaboration.crops
        ]

        return jsonify({
            'message': f"Contribution added to crop {crop.crop_name} successfully",
            'crops': updated_crops
        })


class ContributionListResource(Resource):
    def get(self, collaboration_id):
        """
        List all contributions for a collaboration
        """
        collaboration = Collaboration.query.get_or_404(collaboration_id)
        participations = [
            {
                'farmer_name': p.farmer_name,
                'crop_id': p.crop_id,
                'weight_contributed': p.weight_contributed
            }
            for p in collaboration.participations
        ]
        return jsonify(participations)
