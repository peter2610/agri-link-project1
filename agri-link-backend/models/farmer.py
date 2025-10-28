from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy_serializer import SerializerMixin # type: ignore[import]
from datetime import datetime
from config import db, bcrypt
# from models.offer import Offer, Crop
class Farmer(db.Model, SerializerMixin):
	__tablename__ = 'farmers'
    
	id = db.Column(db.Integer, primary_key=True)
	full_name = db.Column(db.String, nullable=False)
	email = db.Column(db.String, unique=True, nullable=False)
	phone_number = db.Column(db.String(10))
	_password_hash = db.Column(db.String, nullable=False)
	location = db.Column(db.String, nullable=False)
	created_at = db.Column(db.DateTime, default=datetime.now)

	crops = db.relationship('Crop', backref='farmer', lazy=True)
	offers = db.relationship('Offer', backref='farmer', lazy=True)

	@hybrid_property
	def password_hash(self):
		raise AttributeError("Password hashes cannot be viewed.")

	@password_hash.setter
	def password_hash(self, password):
		password_hash = bcrypt.generate_password_hash(
			password.encode('utf-8')
		)
		self._password_hash = password_hash.decode('utf-8')

	def authenticate(self, password):
		return bcrypt.check_password_hash(
			self._password_hash, password
		)
	
	def to_dict(self):
		return {
			"id" : self.id,
			"full_name" : self.full_name,
			"email" : self.email,
			"phone_number": self.phone_number,
			"location" : self.location,
		}

