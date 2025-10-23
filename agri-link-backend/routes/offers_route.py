from flask import Blueprint, request, jsonify
from config import db  # Use db from config
from app.models.offer import Offer, Crop  # Absolute import
from app.models.farmer import Farmer       # Absolute import
# from flask_jwt_extended import jwt_required, get_jwt_identity

offer_bp = Blueprint('offer_bp', __name__, url_prefix='/offers')

# ===============================
# GET all offers for logged-in farmer
# ===============================
@offer_bp.route('/', methods=['GET'])
# @jwt_required()   # Disable temporarily if no JWT for testing
def get_offers():
    # farmer_id = get_jwt_identity()
    farmer_id = 1  # Hardcode for testing without JWT
    offers = Offer.query.filter_by(farmer_id=farmer_id).all()
    result = []
    for offer in offers:
        result.append({
            'id': offer.id,
            'crop_name': offer.crop.name,
            'category': offer.crop.category,
            'quantity': offer.quantity,
            'price': offer.price,
            'location': offer.location,
            'post_harvest_period': offer.post_harvest_period,
            'status': offer.status
        })
    return jsonify(result), 200

# ===============================
# POST create offer
# ===============================
@offer_bp.route('/', methods=['POST'])
# @jwt_required()   # Disable temporarily if no JWT for testing
def create_offer():
    # farmer_id = get_jwt_identity()
    farmer_id = 1  # Hardcode for testing without JWT
    data = request.get_json()

    name = data.get('crop_name')
    category = data.get('category')
    quantity = data.get('quantity')
    price = data.get('price')
    location = data.get('location')
    post_harvest_period = data.get('post_harvest_period', 0)

    if not all([name, category, quantity, price]):
        return jsonify({'error': 'Missing required fields'}), 400

    # Check if crop exists
    crop = Crop.query.filter_by(name=name, farmer_id=farmer_id).first()
    if not crop:
        crop = Crop(name=name, category=category, farmer_id=farmer_id)
        db.session.add(crop)
        db.session.commit()

    offer = Offer(
        farmer_id=farmer_id,
        crop_id=crop.id,
        quantity=quantity,
        price=price,
        location=location,
        post_harvest_period=post_harvest_period
    )
    db.session.add(offer)
    db.session.commit()

    return jsonify({'message': 'Offer created', 'offer_id': offer.id}), 201

# ===============================
# PUT update offer
# ===============================
@offer_bp.route('/<int:offer_id>', methods=['PUT'])
# @jwt_required()
def update_offer(offer_id):
    farmer_id = 1  # Hardcode for testing
    offer = Offer.query.filter_by(id=offer_id, farmer_id=farmer_id).first()
    if not offer:
        return jsonify({'error': 'Offer not found'}), 404

    data = request.get_json()
    offer.quantity = data.get('quantity', offer.quantity)
    offer.price = data.get('price', offer.price)
    offer.location = data.get('location', offer.location)
    offer.post_harvest_period = data.get('post_harvest_period', offer.post_harvest_period)
    offer.status = data.get('status', offer.status)
    db.session.commit()
    return jsonify({'message': 'Offer updated'}), 200

# ===============================
# DELETE offer
# ===============================
@offer_bp.route('/<int:offer_id>', methods=['DELETE'])
# @jwt_required()
def delete_offer(offer_id):
    farmer_id = 1  # Hardcode for testing
    offer = Offer.query.filter_by(id=offer_id, farmer_id=farmer_id).first()
    if not offer:
        return jsonify({'error': 'Offer not found'}), 404

    db.session.delete(offer)
    db.session.commit()
    return jsonify({'message': 'Offer deleted'}), 200
