"""
File helper functions for the backend file routes and Pinata API
"""

from app.models import Upload

from .pinata import retrieve_ipfs_files


def get_file_from_ipfs_files(cid):
	"""
	Retrieves a file from the Pinata request to return files array.
	Pinata does not have a direct endpoint to get upload by hash.
	"""
	results = retrieve_ipfs_files()
	for file in results['rows']:
		if file['ipfs_pin_hash'] == cid:
			return file
		return None


def create_new_upload(data, file_hash):
	return Upload(
		name=data['name'],
		owner_id=data['userId'],
		ipfs_hash=data['IpfsHash'],
		size=data['PinSize'],
		timestamp=data['Timestamp'],
		gateway_url=f'https://gateway.pinata.cloud/ipfs/{data["IpfsHash"]}',
		upload_metadata=data['Metadata'],
		mime_type=file_hash['mime_type'],
		number_of_files=file_hash['number_of_files'],
	)
