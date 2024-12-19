from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy.orm import relationship
from datetime import datetime

class Wallet(db.Model):
    __tablename__ = 'wallets'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False, unique=True)
    wallet_address = db.Column(db.String(255), unique=True, nullable=False)
    # wallet_key = db.Column(db.Text, nullable=True)  # Updated from api_key to wallet_key
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationship
    user = relationship("User", back_populates="wallet")

    def to_dict(self):
        """Return wallet data for the frontend."""
        return {
            "id": self.id,
            "wallet_address": self.wallet_address,
            "created_at": self.created_at,
        }
