# agri-link-backend/models/order.py

from config import db
from datetime import datetime
from sqlalchemy_serializer import SerializerMixin

class Order(db.Model, SerializerMixin):
    __tablename__ = "orders"
    
    serialize_rules = ('-farmer.orders',)

    id = db.Column(db.Integer, primary_key=True)
    crop_name = db.Column(db.String(120), nullable=False)
    quantity = db.Column(db.Float, nullable=False)
    price_per_kg = db.Column(db.Float, nullable=False)
    total_price = db.Column(db.Float, nullable=True)  # optional, can compute if missing
    location = db.Column(db.String(120))
    status = db.Column(db.String(50), default="pending")  # pending / completed
    farmer_id = db.Column(db.Integer, db.ForeignKey("farmers.id"), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationship backref is defined in Farmer model:
    # farmer = db.relationship("Farmer", backref="orders")

    def __repr__(self):
        return f"<Order {self.id} - {self.crop_name} ({self.status})>"

    # --- Helper Methods ---
    @property
    def compute_total(self):
        """Compute total price if not stored explicitly."""
        if self.total_price is not None:
            return self.total_price
        return self.quantity * self.price_per_kg

    def mark_completed(self):
        """Mark the order as completed."""
        self.status = "completed"
        db.session.commit()

    @staticmethod
    def get_all_orders(farmer_id=None, status=None):
        """Fetch orders with optional filtering."""
        query = Order.query
        if farmer_id:
            query = query.filter_by(farmer_id=farmer_id)
        if status:
            query = query.filter(Order.status.ilike(status))
        return query.order_by(Order.created_at.desc()).all()
