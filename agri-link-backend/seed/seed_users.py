from config import db
from models.farmer import Farmer
import random
from faker import Faker # type: ignore[import]

fake = Faker()

def seed_farmers(count=10):
    farmers = []
    locations = ['Nyeri', 'Arusha', 'Kericho', 'Nairobi', 'Meru', 'Mbeya', 'Kiambu']

    for n in range(count):
        full_name = fake.name()
        email = fake.unique.email()
        phone_number = fake.msidn()[:10]
        location = random.choice(locations)

        farmer = Farmer(
            full_name = full_name,
            email = email,
            phone_number = phone_number,
            location = location,
        )

        farmer.password_hash = 'password123'

        farmers.append(farmer)
        db.session.add(farmer) 

    db.session.commit()
    print(f"Seeded {count} farmers succesfully!")
    
    return farmers