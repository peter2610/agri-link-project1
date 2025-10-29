from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Api
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
import secrets
import os

from sqlalchemy import MetaData

app = Flask(__name__)

# Allow overriding SQLite path via env var (e.g., DB_PATH=/var/data/app.db on Render)
db_path = os.getenv('DB_PATH', 'instance/app.db')
# Ensure directory exists for SQLite file
os.makedirs(os.path.dirname(db_path), exist_ok=True)

app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False

metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})
db = SQLAlchemy(metadata=metadata)
migrate = Migrate(app, db)
bcrypt = Bcrypt(app)
db.init_app(app)
api = Api(app)
app.secret_key = secrets.token_hex(16)
