from config import db
from datetime import datetime

class Farmer(db.Model):
    __tablename__ = 'farmers'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    crops = db.relationship('Crop', backref='farmer', lazy=True)
    offers = db.relationship('Offer', backref='farmer', lazy=True)
