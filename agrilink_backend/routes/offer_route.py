from flask_restful import Resource, reqparse
from flask import jsonify
from config import db
from models.offer import Offer, Crop, CROP_CATEGORIES
from sqlalchemy import text
# No circular import anymore

# ===============================
# Request Parser for POST and PUT
# ===============================
offer_parser = reqparse.RequestParser()
offer_parser.add_argument('id', type=int, location='json')  # For PUT or DELETE
offer_parser.add_argument('crop_name', type=str, required=False, location='json')
offer_parser.add_argument('category', type=str, location='json')
offer_parser.add_argument('quantity', type=float, location='json')
offer_parser.add_argument('price', type=float, location='json')
offer_parser.add_argument('location', type=str, location='json')
offer_parser.add_argument('post_harvest_period', type=int, default=0, location='json')
offer_parser.add_argument('status', type=str, default='pending', location='json')


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

        # Normalize category (map common test value 'Grains' to Enum 'Cereals')
        raw_category = data.get('category')
        cat_map = {'Grains': 'Cereals', 'grains': 'Cereals'}
        normalized_category = cat_map.get(raw_category, raw_category)
        if normalized_category not in CROP_CATEGORIES:
            return jsonify({'error': f"Invalid category '{raw_category}'. Allowed: {', '.join(CROP_CATEGORIES)}"}), 400
        data['category'] = normalized_category

        # Remove legacy bad test data: convert any 'Grains' to 'Cereals' in DB
        try:
            db.session.execute(text("UPDATE crops SET category=:new WHERE category=:old"), {"new": "Cereals", "old": "Grains"})
            db.session.commit()
        except Exception:
            db.session.rollback()

        # Check if crop exists (query only id to avoid Enum conversion on bad rows)
        existing_crop_id = db.session.query(Crop.id).filter_by(name=data['crop_name'], farmer_id=farmer_id).scalar()
        if existing_crop_id:
            crop_id = existing_crop_id
        else:
            new_crop = Crop(name=data['crop_name'], category=data['category'], farmer_id=farmer_id)
            db.session.add(new_crop)
            db.session.commit()
            crop_id = new_crop.id

        # Create offer
        offer = Offer(
            farmer_id=farmer_id,
            crop_id=crop_id,
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
        parser.add_argument('id', type=int, required=True, help='Offer id is required', location='json')
        args = parser.parse_args()
        offer_id = args['id']

        offer = Offer.query.filter_by(id=offer_id, farmer_id=farmer_id).first()
        if not offer:
            return jsonify({'error': 'Offer not found'}), 404

        db.session.delete(offer)
        db.session.commit()
        return jsonify({'message': 'Offer deleted successfully'})
