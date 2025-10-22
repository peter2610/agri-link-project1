from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy_serializer import SerializerMixin # type: ignore[import]

from config import db, bcrypt

class Buyer(db.Model, SerializerMixin):
	__tablename__ = 'buyers'
    
	id = db.Column(db.Integer, primary_key=True)
	full_name = db.Column(db.String, nullable=False)
	email = db.Column(db.String, unique=True, nullable=False)
	_password_hash = db.Column(db.String, nullable=False)
	location = db.Column(db.String, nullable=False)

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
			self._password_hash, password.encode('utf-8')
		)
	
	def to_dict(self):
		return {
			"id" : self.id,
			"full name" : self.full_name,
			"email" : self.email,
			"location" : self.location,
		}