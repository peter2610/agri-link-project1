from flask_restful import Resource
from config import db
from utils.helpers import get_data
from models.mailinglist import MailingList

class AddToMailingList(Resource):
    def post(self):
        data = get_data()
        
        subscriber = MailingList(
            full_name = data.get('full_name'),
            email = data.get('email'),
        )
        
        db.session.add(subscriber)
        db.session.commit()

        return subscriber.to_dict(), 201

class GetMailingList(Resource):
    def get(self):
        subscribers = [subscriber.to_dict() for subscriber in MailingList.query.all()]

        return subscribers