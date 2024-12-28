from flask_login import UserMixin
from werkzeug.security import check_password_hash, generate_password_hash

from .db import SCHEMA, db, environment


class User(db.Model, UserMixin):
    __tablename__ = 'users'

    if environment == 'production':
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(40), nullable=False, unique=True)
    wallet_address = db.Column(db.String(100), nullable=True, unique=True)
    nonce = db.Column(db.String(100), nullable=True, unique=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    hashed_password = db.Column(db.String(255), nullable=False)
    uploads = db.relationship('Upload', back_populates='user', lazy=True)  # One-to-many

    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_dict(self):
        """Return user data for the frontend."""
        return {
            'id': self.id,
            'username': self.username,
            'wallet_address': self.wallet_address,
            'nonce': self.nonce,
            'email': self.email,
        }