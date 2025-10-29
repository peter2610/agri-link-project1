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

def _ensure_path(p):
    d = os.path.dirname(p) or '.'
    os.makedirs(d, exist_ok=True)
    try:
        with open(p, 'a'):
            pass
        return p
    except Exception:
        return None

resolved = _ensure_path(db_path)
if not resolved:
    fallback = os.getenv('FALLBACK_DB_PATH', '/tmp/app.db')
    resolved = _ensure_path(fallback)
    db_path = resolved or db_path
else:
    db_path = resolved

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
