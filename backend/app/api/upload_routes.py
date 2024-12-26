"""
Uploading to IPFS is handled on the Frontend via the Pinata SDK. Information sent to the backend only stores and retrieves the record of the transaction.

Retrieval of the upload information is stored in a cache style to prevent multiple API calls to Pinata
"""

from flask import Blueprint, jsonify, request

from app.models import Upload
from app.models.db import db
from utils.pinata import store_ipfs_hash, verify_ipfs_hash

upload_routes = Blueprint('uploads', __name__)


@upload_routes.route('/', methods=['POST'])
def add_file_to_database():
	data = request.get_json()

	if not data:
		return {'errors': 'No data received'}, 400

	try:
		cid = data['IpfsHash']
		new_upload = Upload(
			name=data['name'],
			owner_id=data['userId'],
			ipfs_hash=cid,
			size=data['PinSize'],
			timestamp=data['Timestamp'],
			gateway_url=f'https://gateway.pinata.cloud/ipfs/{cid}',
			upload_metadata=data['Metadata'],
		)

		store_ipfs_hash(cid)
		db.session.add(new_upload)
		db.session.commit()
		return jsonify({'uploads': new_upload.to_dict()}), 201
	except Exception as e:
		return {'errors': str(e)}, 500


@upload_routes.route('/files/<cid>')
def get_upload_information(cid):
	if not cid or cid == '':
		return 'Error: Not Found', 400

	try:
		res = verify_ipfs_hash(cid)

		if not res:
			return jsonify({'error': 'File not found'}), 404

		upload = Upload.query.filter_by(ipfs_hash=cid).first()
		return jsonify(upload.to_dict()), 200
	except Exception as e:
		return jsonify({'error': str(e)}), 500
