from .db import db

class Upload(db.Model):
    __tablename__ = 'uploads'
    
    id = db.Column(db.Integer, primary_key=True)
    owner_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    size = db.Column(db.Integer, nullable=False)
    ipfs_hash = db.Column(db.String(255), nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False)
    gateway_url = db.Column(db.String(255), nullable=False)
    upload_metadata = db.Column(db.JSON, nullable=False)
    
    
    def to_dict(self):
        return {
            'id': self.id,
            'owner_id': self.owner_id,
            'name': self.name,
            'pinSize': self.size,
            'ipfsHash': self.ipfs_hash,
            'timestamp': self.timestamp,
            'gatewayUrl': self.gateway_url,
            'uploadMetadata': self.upload_metadata
        }