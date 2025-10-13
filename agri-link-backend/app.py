from flask import request, jsonify, redirect, url_for
from flask_cors import CORS

from config import app, db

from config import bcrypt


CORS(app, resources={r"/*": {"origins": ["http://localhost:3000", "http://127.0.0.1:3000"]}})

if __name__ == '__main__':
    import os
    port = int(os.environ.get('FLASK_RUN_PORT', 5555))
    app.run(host="0.0.0.0", port=port, debug=True)