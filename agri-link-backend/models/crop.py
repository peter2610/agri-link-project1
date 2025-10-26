from config import db
from sqlalchemy import Enum
from models.offer import Offer

CROP_CATEGORIES = ('Cereals', 'Vegetables', 'Fruits', 'Export Crop', 'Other')

class Crop(db.Model):
    __tablename__ = 'crops'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    category = db.Column(Enum(*CROP_CATEGORIES, name='crop_categories'), nullable=False)
    farmer_id = db.Column(db.Integer, db.ForeignKey('farmers.id'), nullable=False)

    offer = db.relationship('Offer', backref='crop', lazy=True)
