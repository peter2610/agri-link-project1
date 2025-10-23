from config import app, db
from seed_data.seed_users import seed_farmers

with app.app_context():
    db.drop_all()
    db.create_all()

    print("Seeding database...")
    seed_farmers(10)

    print("Done seeding!")