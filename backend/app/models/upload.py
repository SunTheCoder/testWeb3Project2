from .db import SCHEMA, db, environment


class Upload(db.Model):
	__tablename__ = 'uploads'

	if environment == 'production':
		__table_args__ = {'schema': SCHEMA}

	id = db.Column(db.Integer, primary_key=True)
	owner_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
	name = db.Column(db.String(255), nullable=False)
	size = db.Column(db.Integer, nullable=False)
	ipfs_hash = db.Column(db.String(255), nullable=False)
	timestamp = db.Column(db.String(255), nullable=False)
	gateway_url = db.Column(db.String(255), nullable=False)
	mime_type = db.Column(db.String(100), nullable=False)
	number_of_files = db.Column(db.Integer, nullable=False)
	upload_metadata = db.Column(db.JSON, nullable=False)

	user = db.relationship('User', back_populates='uploads')

	def to_dict(self):
		return {
			'id': self.id,
			'owner_id': self.owner_id,
			'name': self.name,
			'pinSize': self.size,
			'ipfsHash': self.ipfs_hash,
			'timestamp': self.timestamp,
			'gatewayUrl': self.gateway_url,
			'mimeType': self.mime_type,
			'numberOfFiles': self.number_of_files,
			'uploadMetadata': self.upload_metadata,
		}
