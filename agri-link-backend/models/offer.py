from datetime import datetime
from config import db
from sqlalchemy import Enum
from models.farmer import Farmer

CROP_CATEGORIES = ('Cereals', 'Vegetables', 'Fruits', 'Export Crop', 'Other')

class Crop(db.Model):
    __tablename__ = 'crops'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    category = db.Column(Enum(*CROP_CATEGORIES, name='crop_categories'), nullable=False)
    farmer_id = db.Column(db.Integer, db.ForeignKey('farmers.id'), nullable=False)
    offers = db.relationship('Offer', backref='crop', lazy=True)

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
