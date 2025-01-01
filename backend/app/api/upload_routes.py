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
	
@upload_routes.route('/<file_id>', methods=['PUT'])
def update_metadata(file_id):
    data = request.get_json()

    if not data or 'upload_metadata' not in data:
        return jsonify({'error': 'Invalid input'}), 400

    try:
        # Retrieve the file from the database using the file_id
        upload = Upload.query.get(file_id)  # Query by primary key (id)
        if not upload:
            return jsonify({'error': 'File not found'}), 404

        # Update the metadata
        upload.upload_metadata = data['upload_metadata']
        db.session.commit()

        return jsonify({'message': 'Metadata updated successfully', 'upload': upload.to_dict()}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500



@upload_routes.route('/<int:id>/<cid>', methods=['DELETE'])
def delete_upload(id, cid):
    if not cid or not id:
        return jsonify({'error': 'Invalid ID or CID'}), 400
    
    # Ensure the combination of `id` and `ipfs_hash` is used
    upload = Upload.query.filter_by(id=id, ipfs_hash=cid).first()
    if not upload:
        return jsonify({'error': 'File not found'}), 404
    
    # Log the file being deleted for debugging
    print('Deleting upload:', upload.to_dict())

    db.session.delete(upload)
    db.session.commit()
    return jsonify({'message': 'Deleted successfully'}), 200

