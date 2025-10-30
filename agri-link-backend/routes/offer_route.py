from flask_restful import Resource, reqparse
from flask import jsonify, session
from config import db
from models.offer import Offer, Crop, CROP_CATEGORIES
from models.farmer import Farmer
from sqlalchemy import text
from uuid import uuid4
import os
# No circular import anymore

# ===============================
# Request Parser for POST and PUT
# ===============================
offer_parser = reqparse.RequestParser()
offer_parser.add_argument('id', type=int, location='json')
offer_parser.add_argument('crop_name', type=str, required=False, location='json')
offer_parser.add_argument('category', type=str, location='json')
offer_parser.add_argument('quantity', type=float, location='json')
offer_parser.add_argument('price', type=float, location='json')
offer_parser.add_argument('location', type=str, location='json')
offer_parser.add_argument('post_harvest_period', type=int, default=0, location='json')
offer_parser.add_argument('status', type=str, default='pending', location='json')
offer_parser.add_argument('farmer_id', type=int, location='json')
# Accept alternate field names from frontend/Postman
offer_parser.add_argument('farmer_name', type=str, location='json')
offer_parser.add_argument('crop_category', type=str, location='json')
offer_parser.add_argument('price_per_kg', type=float, location='json')
offer_parser.add_argument('weight_kg', type=float, location='json')
offer_parser.add_argument('post_harvest_period_days', type=int, location='json')


class OfferResource(Resource):
    def options(self):
        return '', 204
    # ======================================
    # GET all offers for farmer_id=1 (testing)
    # ======================================
    def get(self):
        return [], 200

    # ======================================
    # POST create new offer
    # ======================================
    def post(self):
        try:
            data = offer_parser.parse_args()
            # Prefer logged-in farmer from session; fallback to explicit body for testing
            farmer_id = session.get('farmer_id') or data.get('farmer_id')
            if not farmer_id:
                allow_dev = os.getenv('ALLOW_DEV_OFFER_NO_AUTH', 'false').lower() == 'true'
                fallback_id = os.getenv('FALLBACK_FARMER_ID')
                if allow_dev and fallback_id:
                    farmer_id = int(fallback_id)
                else:
                    return {'error': 'Not authenticated', 'details': 'No farmer session. Please sign in.'}, 401

            # Normalize alternative keys into expected names
            if not data.get('category') and data.get('crop_category'):
                data['category'] = data['crop_category']
            if data.get('price') is None and data.get('price_per_kg') is not None:
                data['price'] = data['price_per_kg']
            if data.get('quantity') is None and data.get('weight_kg') is not None:
                data['quantity'] = data['weight_kg']
            if (data.get('post_harvest_period') is None or data.get('post_harvest_period') == 0) \
               and data.get('post_harvest_period_days') is not None:
                data['post_harvest_period'] = data['post_harvest_period_days']

            # Validation
            required_fields = ['crop_name', 'category', 'quantity', 'price']
            if not all(data.get(field) for field in required_fields):
                return {'error': 'Missing required fields'}, 400

            # Ensure the farmer exists to avoid foreign key failures
            farmer = Farmer.query.get(farmer_id)
            if not farmer:
                return {'error': 'Farmer not found'}, 404

            # Normalize category (map common test value 'Grains' to Enum 'Cereals')
            raw_category = data.get('category')
            cat_map = {'Grains': 'Cereals', 'grains': 'Cereals'}
            normalized_category = cat_map.get(raw_category, raw_category)
            if normalized_category not in CROP_CATEGORIES:
                return {'error': f"Invalid category '{raw_category}'. Allowed: {', '.join(CROP_CATEGORIES)}"}, 400
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
                try:
                    new_crop = Crop(name=data['crop_name'], category=data['category'], farmer_id=farmer_id)
                    db.session.add(new_crop)
                    db.session.commit()
                    crop_id = new_crop.id
                except Exception as e:
                    db.session.rollback()
                    return {'error': 'Failed to create crop', 'details': str(e)}, 400

            # Create offer
            try:
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
            except Exception as e:
                db.session.rollback()
                return {'error': 'Failed to create offer', 'details': str(e)}, 400

            return {'message': 'Offer created successfully', 'offer_id': offer.id}, 200
        except Exception as e:
            db.session.rollback()
            return {'error': 'Internal Server Error', 'details': str(e)}, 500

    # ======================================
    # PUT update offer (pass offer_id in JSON)
    # ======================================
    def put(self):
        farmer_id = 1  # Hardcoded for testing
        data = offer_parser.parse_args()
        offer_id = data.get('id')

        if not offer_id:
            return {'error': 'Offer id is required for update'}, 400

        offer = Offer.query.filter_by(id=offer_id, farmer_id=farmer_id).first()
        if not offer:
            return {'error': 'Offer not found'}, 404

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
        return {'message': 'Offer updated successfully'}, 200

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
            return {'error': 'Offer not found'}, 404

        db.session.delete(offer)
        db.session.commit()
        return {'message': 'Offer deleted successfully'}, 200
