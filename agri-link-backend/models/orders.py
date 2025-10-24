# agri-link-backend/models/orders.py

from datetime import datetime
from sqlalchemy import Enum
from config import db
from sqlalchemy_serializer import SerializerMixin

# Define allowed status values
STATUS_OPTIONS = ("pending", "completed", "cancelled")

class Order(db.Model, SerializerMixin):
    __tablename__ = "orders"

    id = db.Column(db.Integer, primary_key=True)
    buyer_id = db.Column(db.Integer, db.ForeignKey("buyers.id"), nullable=False)
    offer_id = db.Column(db.Integer, db.ForeignKey("offers.id"), nullable=False)
    
    # Using Numeric for better precision in prices and quantities
    quantity = db.Column(db.Numeric(10, 2), nullable=False)
    total_price = db.Column(db.Numeric(10, 2), nullable=False)
    
    # Restrict order status to known values only
    status = db.Column(Enum(*STATUS_OPTIONS, name="order_status"), default="pending", nullable=False)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    buyer = db.relationship("Buyer", backref="orders", lazy=True)
    offer = db.relationship("Offer", backref="orders", lazy=True)

    # Prevent circular serialization
    serialize_rules = ("-buyer.orders", "-offer.orders")

    def to_dict(self):
        """Convert model instance to dictionary."""
        return {
            "id": self.id,
            "buyer_id": self.buyer_id,
            "offer_id": self.offer_id,
            "quantity": float(self.quantity),
            "total_price": float(self.total_price),
            "status": self.status,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
