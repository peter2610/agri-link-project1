from flask_restful import Resource
from flask import request
from config import db
from models.offer import Offer, Crop
from models.farmer import Farmer
from sqlalchemy import text
import os

class SeedOffersResource(Resource):
    def _seed(self):
        # Resolve target farmer
        farmer_id = (
            (request.json.get('farmer_id') if request.is_json else None)
            or request.args.get('farmer_id')
        )
        if not farmer_id:
            # Try first farmer as last resort
            row = db.session.query(Farmer.id).order_by(Farmer.id.asc()).first()
            if not row:
                return {"error": "No farmer exists to seed for."}, 400
            farmer_id = int(row[0])
        else:
            farmer_id = int(farmer_id)

        # Normalize bad legacy categories before insert
        try:
            db.session.execute(text("UPDATE crops SET category=:new WHERE category=:old"), {"new": "Cereals", "old": "Grains"})
            db.session.commit()
        except Exception:
            db.session.rollback()

        # Mock dataset
        mocks = [
            {"crop_name": "Maize", "category": "Cereals", "quantity": 500, "price": 80,  "location": "Nairobi",  "post_harvest_period": 1},
            {"crop_name": "Tomatoes", "category": "Vegetables", "quantity": 300, "price": 120, "location": "Embu",     "post_harvest_period": 0},
            {"crop_name": "Avocado", "category": "Fruits", "quantity": 200, "price": 150, "location": "Murang'a", "post_harvest_period": 2},
        ]

        created = []
        try:
            for item in mocks:
                # Ensure crop exists (unique per name+farmer)
                crop_id = db.session.query(Crop.id).filter_by(name=item['crop_name'], farmer_id=farmer_id).scalar()
                if not crop_id:
                    crop = Crop(name=item['crop_name'], category=item['category'], farmer_id=farmer_id)
                    db.session.add(crop)
                    db.session.flush()
                    crop_id = crop.id

                offer = Offer(
                    farmer_id=farmer_id,
                    crop_id=crop_id,
                    quantity=item['quantity'],
                    price=item['price'],
                    location=item['location'],
                    post_harvest_period=item['post_harvest_period'],
                    status='pending',
                )
                db.session.add(offer)
                db.session.flush()
                created.append({"offer_id": offer.id, **item})

            db.session.commit()
        except Exception as e:
            db.session.rollback()
            return {"error": "Failed to seed offers", "details": str(e)}, 500

        return {"message": "Seeded offers", "count": len(created), "items": created}, 200

    def post(self):
        return self._seed()

    def get(self):
        return self._seed()
