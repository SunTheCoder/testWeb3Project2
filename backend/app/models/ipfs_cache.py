from datetime import datetime
from .db import db

class IpfsCache(db.Model):
    __tablename__ = 'ipfs_cache'
    
    id = db.Column(db.Integer, primary_key=True)
    ipfs_hash = db.Column(db.String(255), nullable=False)
    uploaded_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<IpfsCache {self.ipfs_hash}>'