# agri-link-backend/models/order.py

from datetime import datetime
from sqlalchemy import Enum, select
from sqlalchemy.ext.hybrid import hybrid_property
from config import db
from sqlalchemy_serializer import SerializerMixin

# Define allowed status values
STATUS_OPTIONS = ("pending", "completed", "cancelled")

class Order(db.Model, SerializerMixin):
    __tablename__ = "order"

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

    @hybrid_property
    def farmer_id(self):
        return self.offer.farmer_id if self.offer else None

    @farmer_id.expression
    def farmer_id(cls):
        from models.offer import Offer

        return select(Offer.farmer_id).where(Offer.id == cls.offer_id).scalar_subquery()

    @property
    def crop_name(self):
        return self.offer.crop.name if self.offer and self.offer.crop else None

    @property
    def location(self):
        return self.offer.location if self.offer else None

    @property
    def price_per_kg(self):
        if self.offer and self.offer.price is not None:
            return float(self.offer.price)

        if self.quantity and self.total_price:
            quantity = float(self.quantity)
            if quantity:
                return round(float(self.total_price) / quantity, 2)

        return None

    @property
    def compute_total(self):
        if self.total_price is not None:
            return float(self.total_price)

        price = self.price_per_kg or 0.0
        quantity = float(self.quantity or 0)
        return round(price * quantity, 2)

    def to_dict(self):
        quantity = float(self.quantity) if self.quantity is not None else None
        total_price = float(self.total_price) if self.total_price is not None else None

        """Convert model instance to dictionary."""
        return {
            "id": self.id,
            "buyer_id": self.buyer_id,
            "offer_id": self.offer_id,
            "quantity": quantity,
            "total_price": total_price,
            "status": self.status,
            "crop_name": self.crop_name,
            "location": self.location,
            "price_per_kg": self.price_per_kg,
            "farmer_id": self.farmer_id,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
