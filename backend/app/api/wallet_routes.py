from cryptography.fernet import Fernet
from eth_account.messages import encode_defunct  # Import for signature verification
from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required
from web3 import Web3  # Import Web3 for address validation

from app.alchemy_utils import get_balance  # Updated import path
from app.models import User, db

# Encryption key for private keys (store this securely)
ENCRYPTION_KEY = Fernet.generate_key()
cipher_suite = Fernet(ENCRYPTION_KEY)

# print(f"Encryption Key: {ENCRYPTION_KEY}")
# print(f"Encryption Key: {ENCRYPTION_KEY.decode()}")


def encrypt_private_key(private_key):
	return cipher_suite.encrypt(private_key.encode('utf-8')).decode('utf-8')


wallet_routes = Blueprint('wallets', __name__)


@wallet_routes.route('/', methods=['POST'])
@login_required
def create_existing_wallet():
	"""
	Creates a wallet for the authenticated user using an existing wallet address.
	"""
	if current_user.wallet:
		return {'errors': {'message': 'Wallet already exists for this user'}}, 400

	data = request.get_json()
	wallet_address = data.get('wallet_address')

	if not wallet_address:
		return {'errors': {'message': 'Wallet address is required'}}, 400

	# Create and save wallet
	wallet = User(
		id=current_user.id,
		wallet_address=wallet_address,
		# wallet_key='example_wallet_key',  
	)
	db.session.add(wallet)
	db.session.commit()

	return wallet.to_dict(), 201


@wallet_routes.route('/create', methods=['POST'])
@login_required
def create_wallet():
	try:
		# Check if the user already has a wallet
		if current_user.wallet:
			return jsonify({'error': 'User already has a connected wallet'}), 400

		# Generate a new wallet
		new_wallet = Web3().eth.account.create()
		wallet_address = new_wallet.address
		private_key = new_wallet.key.hex()

		# Save only the public wallet address
		wallet = User(id=current_user.id, wallet_address=wallet_address)
		db.session.add(wallet)
		db.session.commit()

		# Return the wallet details to the user
		return jsonify(
			{
				'walletAddress': wallet_address,
				'privateKey': private_key,  # This is shown to the user once
			}
		), 201

	except Exception as e:
		print(f'Error creating wallet: {e}')
		return jsonify({'error': 'Internal server error'}), 500


@wallet_routes.route('/verify', methods=['POST'])
@login_required
def verify_wallet():
	"""
	Verifies wallet ownership using a signed message.
	"""
	data = request.get_json()
	wallet_address = data.get('walletAddress')
	signature = data.get('signature')
	message = 'Verify wallet ownership for My App'

	if not wallet_address or not signature:
		return {'errors': {'message': 'Wallet address and signature are required'}}, 400

	try:
		# Encode the message
		encoded_message = encode_defunct(text=message)

		# Recover the address from the signature
		recovered_address = Web3().eth.account.recover_message(encoded_message, signature=signature)

		if recovered_address.lower() == wallet_address.lower():
			return {'message': 'Wallet ownership verified!'}, 200
		else:
			return {'errors': {'message': 'Invalid signature'}}, 400
	except Exception as e:
		print('Error verifying wallet:', e)
		return {'errors': {'message': 'Verification failed'}}, 500


@wallet_routes.route('/connect', methods=['POST'])
@login_required
def connect_wallet():
    try:
        data = request.get_json()
        wallet_address = data.get('wallet_address')

        # Validate the wallet address
        if not wallet_address or not Web3.isChecksumAddress(wallet_address):
            return jsonify({'error': 'Invalid wallet address'}), 400

        # Check if the user already has a wallet
        if current_user.wallet_address:
            return jsonify({
                'message': 'User already has a connected wallet',
                'current_wallet': current_user.wallet_address,
                'prompt_update': True
            }), 200

        # If no wallet exists, save the new one
        current_user.wallet_address = wallet_address
        db.session.commit()

        return jsonify({'message': 'Wallet connected successfully!'}), 201

    except Exception as e:
        print(f'Error in /connect: {e}')
        return jsonify({'error': 'Internal server error'}), 500


@wallet_routes.route('/update', methods=['PUT'])
@login_required
def update_wallet():
    try:
        data = request.get_json()
        wallet_address = data.get('wallet_address')

        # Validate the wallet address
        if not wallet_address or not Web3.isChecksumAddress(wallet_address):
            return jsonify({'error': 'Invalid wallet address'}), 400

        # Update the user's wallet address
        current_user.wallet_address = wallet_address
        db.session.commit()

        return jsonify({'message': 'Wallet address updated successfully!'}), 200

    except Exception as e:
        print(f'Error in /update: {e}')
        return jsonify({'error': 'Internal server error'}), 500



@wallet_routes.route('/balance', methods=['GET'])
@login_required
def get_wallet_balance():
	"""
	Fetches the balance of a wallet address using Alchemy.
	"""
	print('Balance endpoint hit')  # Log route usage

	wallet_address = request.args.get('walletAddress')
	print(f'Received wallet address: {wallet_address}')  # Log received address

	# Check if the wallet address is valid
	if not Web3.is_address(wallet_address):
		print('Invalid wallet address')
		return {'errors': {'message': 'Invalid wallet address'}}, 400

	# Check Alchemy connection
	from alchemy_utils import web3  # Ensure you're importing the `web3` instance

	if not web3.is_connected():
		print('Alchemy provider is not connected')
		return {'errors': {'message': 'Failed to connect to Alchemy provider'}}, 500

	# Fetch balance
	balance = get_balance(wallet_address)
	print(f'Balance fetched: {balance}')  # Log fetched balance

	if balance is None:
		print('Failed to fetch balance')
		return {'errors': {'message': 'Failed to fetch balance'}}, 500

	return {'balance': str(balance)}, 200
