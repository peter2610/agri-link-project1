from datetime import datetime
from sqlalchemy_serializer import SerializerMixin  # type: ignore[import]
from config import db
# from models.dashboard import Dashboard


class Dashboard(db.Model, SerializerMixin):
	__tablename__ = 'dashboards'

	id = db.Column(db.Integer, primary_key=True)
	farmer_id = db.Column(db.Integer, db.ForeignKey('farmers.id'), nullable=False, unique=True)
	total_offers = db.Column(db.Integer, default=0)
	total_crops = db.Column(db.Integer, default=0)
	total_orders = db.Column(db.Integer, default=0)
	pending_orders = db.Column(db.Integer, default=0)
	completed_orders = db.Column(db.Integer, default=0)
	total_revenue = db.Column(db.Float, default=0.0)
	updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

	farmer = db.relationship('Farmer', backref=db.backref('dashboard', uselist=False), lazy=True)

	serialize_rules = ('-farmer.dashboard',)

	def refresh_metrics(self):
		from sqlalchemy import func
		from models.offer import Offer
		from models.order import Order

		offer_query = Offer.query.filter_by(farmer_id=self.farmer_id)
		self.total_offers = offer_query.count()
		self.total_crops = offer_query.distinct(Offer.crop_id).count()

		order_query = Order.query.filter_by(farmer_id=self.farmer_id)
		self.total_orders = order_query.count()
		self.pending_orders = order_query.filter(Order.status == 'pending').count()
		self.completed_orders = order_query.filter(Order.status == 'completed').count()
		self.total_revenue = order_query.with_entities(func.coalesce(func.sum(Order.total_price), 0.0)).scalar() or 0.0
		self.updated_at = datetime.utcnow()
		return self

	def get_summary(self):
		from sqlalchemy import func
		from models.order import Order

		self.refresh_metrics()
		db.session.add(self)
		db.session.commit()

		orders_query = Order.query.filter(Order.farmer_id == self.farmer_id)
		orders = orders_query.all()

		total_quantity = orders_query.with_entities(func.coalesce(func.sum(Order.quantity), 0.0)).scalar() or 0.0

		total_revenue = sum(order.compute_total for order in orders if order.status == 'completed')
		pending_revenue = sum(order.compute_total for order in orders if order.status == 'pending')
		average_price = (
			sum((order.price_per_kg or 0) for order in orders if order.price_per_kg)
			/ max(len([order for order in orders if order.price_per_kg]), 1)
		)

		summary = self.to_dict()
		summary.update(
			{
				'total_quantity': float(total_quantity) if total_quantity is not None else 0.0,
				'total_revenue_value': round(total_revenue, 2),
				'pending_revenue_value': round(pending_revenue, 2),
				'average_price_per_kg': round(average_price, 2) if orders else 0.0,
			}
		)

		return summary

	def to_dict(self):
		farmer = self.farmer
		return {
			"id": self.id,
			"farmer_id": self.farmer_id,
			"farmer": {
				"id": farmer.id,
				"full_name": farmer.full_name,
				"location": farmer.location,
			} if farmer else None,
			"total_offers": self.total_offers,
			"total_crops": self.total_crops,
			"total_orders": self.total_orders,
			"pending_orders": self.pending_orders,
			"completed_orders": self.completed_orders,
			"total_revenue": round(self.total_revenue or 0.0, 2),
			"updated_at": self.updated_at.isoformat() if self.updated_at else None,
		}
