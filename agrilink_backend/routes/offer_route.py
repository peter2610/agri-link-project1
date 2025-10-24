from flask_restful import Resource, reqparse
from flask import jsonify
from config import db
from models.offer import Offer, Crop
# No circular import anymore

# ===============================
# Request Parser for POST and PUT
# ===============================
offer_parser = reqparse.RequestParser()
offer_parser.add_argument('id', type=int)  # For PUT or DELETE
offer_parser.add_argument('crop_name', type=str, required=False)
offer_parser.add_argument('category', type=str)
offer_parser.add_argument('quantity', type=float)
offer_parser.add_argument('price', type=float)
offer_parser.add_argument('location', type=str)
offer_parser.add_argument('post_harvest_period', type=int, default=0)
offer_parser.add_argument('status', type=str, default='pending')


class OfferResource(Resource):
    # ======================================
    # GET all offers for farmer_id=1 (testing)
    # ======================================
    def get(self):
        farmer_id = 1  # Hardcoded for testing
        offers = Offer.query.filter_by(farmer_id=farmer_id).all()
        result = [
            {
                'id': offer.id,
                'crop_name': offer.crop.name if offer.crop else "Unknown",
                'category': offer.crop.category if offer.crop else "Unknown",
                'quantity': offer.quantity,
                'price': offer.price,
                'location': offer.location,
                'post_harvest_period': offer.post_harvest_period,
                'status': offer.status
            }
            for offer in offers
        ]
        return jsonify(result)

    # ======================================
    # POST create new offer
    # ======================================
    def post(self):
        farmer_id = 1  # Hardcoded for testing
        data = offer_parser.parse_args()

        # Validation
        required_fields = ['crop_name', 'category', 'quantity', 'price']
        if not all(data.get(field) for field in required_fields):
            return jsonify({'error': 'Missing required fields'}), 400

        # Check if crop exists
        crop = Crop.query.filter_by(name=data['crop_name'], farmer_id=farmer_id).first()
        if not crop:
            crop = Crop(name=data['crop_name'], category=data['category'], farmer_id=farmer_id)
            db.session.add(crop)
            db.session.commit()

        # Create offer
        offer = Offer(
            farmer_id=farmer_id,
            crop_id=crop.id,
            quantity=data['quantity'],
            price=data['price'],
            location=data.get('location'),
            post_harvest_period=data.get('post_harvest_period', 0),
            status=data.get('status', 'pending')
        )
        db.session.add(offer)
        db.session.commit()

        return jsonify({'message': 'Offer created successfully', 'offer_id': offer.id})

    # ======================================
    # PUT update offer (pass offer_id in JSON)
    # ======================================
    def put(self):
        farmer_id = 1  # Hardcoded for testing
        data = offer_parser.parse_args()
        offer_id = data.get('id')

        if not offer_id:
            return jsonify({'error': 'Offer id is required for update'}), 400

        offer = Offer.query.filter_by(id=offer_id, farmer_id=farmer_id).first()
        if not offer:
            return jsonify({'error': 'Offer not found'}), 404

        # Update fields
        if data.get('quantity') is not None:
            offer.quantity = data['quantity']
        if data.get('price') is not None:
            offer.price = data['price']
        if data.get('location') is not None:
            offer.location = data['location']
        if data.get('post_harvest_period') is not None:
            offer.post_harvest_period = data['post_harvest_period']
        if data.get('status') is not None:
            offer.status = data['status']

        db.session.commit()
        return jsonify({'message': 'Offer updated successfully'})

    # ======================================
    # DELETE offer (pass offer_id in JSON)
    # ======================================
    def delete(self):
        farmer_id = 1  # Hardcoded for testing
        parser = reqparse.RequestParser()
        parser.add_argument('id', type=int, required=True, help='Offer id is required')
        args = parser.parse_args()
        offer_id = args['id']

        offer = Offer.query.filter_by(id=offer_id, farmer_id=farmer_id).first()
        if not offer:
            return jsonify({'error': 'Offer not found'}), 404

        db.session.delete(offer)
        db.session.commit()
        return jsonify({'message': 'Offer deleted successfully'})
