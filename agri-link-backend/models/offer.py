from datetime import datetime
from config import db
from sqlalchemy import Enum
# from models.farmer import Farmer  # ✅ Import the real Farmer model

CROP_CATEGORIES = ('Cereals', 'Vegetables', 'Fruits', 'Export Crop', 'Other')


class Crop(db.Model):
    __tablename__ = 'crops'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    category = db.Column(Enum(*CROP_CATEGORIES, name='crop_categories'), nullable=False)
    farmer_id = db.Column(db.Integer, db.ForeignKey('farmers.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    offers = db.relationship('Offer', backref='crop', lazy=True)

    @property
    def type(self):
        """Alias used by dashboard stats for crop category."""
        return self.category

    @property
    def quantity(self):
        """Aggregate quantity from related offers (falls back to 0)."""
        return float(sum((offer.quantity or 0) for offer in self.offers))

    def to_dict(self):
        farmer = self.farmer
        return {
            'id': self.id,
            'name': self.name,
            'category': self.category,
            'farmer_id': self.farmer_id,
            'farmer': {
                'id': farmer.id,
                'full_name': farmer.full_name,
                'location': farmer.location,
            } if farmer else None,
            'total_quantity': self.quantity,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }


class Offer(db.Model):
    __tablename__ = 'offers'

    id = db.Column(db.Integer, primary_key=True)
    farmer_id = db.Column(db.Integer, db.ForeignKey('farmers.id'), nullable=False)
    crop_id = db.Column(db.Integer, db.ForeignKey('crops.id'), nullable=False)
    quantity = db.Column(db.Float, nullable=False)
    price = db.Column(db.Float, nullable=False)
    location = db.Column(db.String(150))
    post_harvest_period = db.Column(db.Integer, default=0)
    status = db.Column(db.String(20), default='pending')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
