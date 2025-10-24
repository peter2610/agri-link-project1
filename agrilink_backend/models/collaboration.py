# models/collaboration.py
from datetime import datetime
from config import db

class Collaboration(db.Model):
    __tablename__ = 'collaborations'
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.String(20), unique=True, nullable=False)
    location = db.Column(db.String(150), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    crops = db.relationship('CollaborationCrop', backref='collaboration', lazy=True)
    participations = db.relationship('CollaborationParticipation', backref='collaboration', lazy=True)


class CollaborationCrop(db.Model):
    __tablename__ = 'collaboration_crops'
    id = db.Column(db.Integer, primary_key=True)
    collaboration_id = db.Column(db.Integer, db.ForeignKey('collaborations.id'), nullable=False)
    crop_name = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)
    weight_demand = db.Column(db.Float, nullable=False)
    contributed_weight = db.Column(db.Float, default=0.0)


class CollaborationParticipation(db.Model):
    __tablename__ = 'collaboration_participations'
    id = db.Column(db.Integer, primary_key=True)
    collaboration_id = db.Column(db.Integer, db.ForeignKey('collaborations.id'), nullable=False)
    farmer_name = db.Column(db.String(100), nullable=False)
    weight_contributed = db.Column(db.Float, default=0.0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
