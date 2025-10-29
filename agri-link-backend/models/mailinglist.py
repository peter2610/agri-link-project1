from sqlalchemy_serializer import SerializerMixin # type: ignore[import]
from datetime import datetime
from config import db, bcrypt


class MailingList (db.Model, SerializerMixin):
    __tablename__ = 'mailing_list'

    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String, nullable=False)
    email = db.Column(db.String, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now)

    def to_dict(self):
	    return {
			"id" : self.id,
			"full_name" : self.full_name,
			"email" : self.email,
		}