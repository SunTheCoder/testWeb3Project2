"""
Uploading to IPFS is handled on the Frontend via the Pinata SDK. Information sent to the backend only stores and retrieves the record of the transaction.

Retrieval of the upload information is stored in a cache style to prevent multiple API calls to Pinata
"""

from flask import Blueprint, jsonify, request

from app.models import Upload
from app.models.db import db
from utils.file_helpers import create_new_upload, get_file_from_ipfs_files
from utils.pinata import retrieve_ipfs_files, store_ipfs_hash, verify_ipfs_hash

upload_routes = Blueprint('uploads', __name__)


@upload_routes.route('/<uid>', methods=['GET'])
def get_files_from_database(uid):
	files = Upload.query.filter_by(owner_id=uid).all()
	return jsonify([file.to_dict() for file in files]), 200


@upload_routes.route('/', methods=['POST'])
def add_to_database():
	data = request.get_json()

	if not data:
		return {'errors': 'No data received'}, 400

	try:
		cid = data['IpfsHash']
		file_info = get_file_from_ipfs_files(cid)

		if not file_info:
			return jsonify({'error': 'File not found'}), 404

		new_upload = create_new_upload(data, file_info)
		store_ipfs_hash(cid)
		db.session.add(new_upload)
		db.session.commit()
		return jsonify({'uploads': new_upload.to_dict()}), 201
	except Exception as e:
		return {'errors': str(e)}, 500


@upload_routes.route('/<cid>', methods=['GET', 'DELETE'])
def get_upload_information(cid):
	if not cid or cid == '':
		return 'Error: Not Found', 400
	if request.method == 'DELETE':
		upload = Upload.query.filter_by(ipfs_hash=cid).first()
		if not upload:
			return jsonify({'error': 'File not found'}), 404
		db.session.delete(upload)
		db.session.commit()
		return jsonify({'message': 'deleted successfully'}), 200
	try:
		res = verify_ipfs_hash(cid)

		if not res:
			return jsonify({'error': 'File not found'}), 404

		upload = Upload.query.filter_by(ipfs_hash=cid).first()
		return jsonify(upload.to_dict()), 200
	except Exception as e:
		return jsonify({'error': str(e)}), 500
