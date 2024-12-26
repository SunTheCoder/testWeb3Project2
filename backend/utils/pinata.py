import os

import requests
from dotenv import load_dotenv

from app.models import IpfsCache
from app.models.db import db

load_dotenv()

PINATA_URL = os.getenv('PINATA_UPLOAD_URL')
headers = {'Authorization': f"Bearer {os.getenv('PINATA_JWT')}"}


# Function to retrieve IPFS files uploaded to Pinata
def retrieve_ipfs_files():
	url = 'https://api.pinata.cloud/data/pinList'
	response = requests.get(url, headers=headers)
	return response.json()


def verify_ipfs_hash_in_cache(ipfs_hash: str) -> bool:
	"""Checks if ipfs hash string is index in the database cache

	Args:
	    ipfs_hash: str

	Returns:
	    Boolean value if ipfs_hash is cached
	"""
	cached_hash = IpfsCache.query.filter_by(ipfs_hash=ipfs_hash).first()
	return cached_hash is not None


def verify_ipfs_hash_in_pinata(ipfs_hash: str):
	url = f'{PINATA_URL}/data/pinList'
	querystring = {'includeCount': 'true'}
	response = requests.get(url, headers=headers, params=querystring)

	if response.status_code == 200:
		# parse the response JSON
		pinned_files = response.json().get('rows', [])

		# Check if hash exists in array
		for file in pinned_files:
			if file['ipfs_pin_hash'] == ipfs_hash:
				store_ipfs_hash(ipfs_hash)
				return True
	return False


def verify_ipfs_hash(ipfs_hash: str):
	if verify_ipfs_hash_in_cache(ipfs_hash):
		return True
	elif verify_ipfs_hash_in_pinata(ipfs_hash):
		return True

	return False
