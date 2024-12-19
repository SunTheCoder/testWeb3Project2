from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import Wallet, db
from app.alchemy_utils import web3, get_balance  # Updated import path
from web3 import Web3  # Import Web3 for address validation
from eth_account.messages import encode_defunct  # Import for signature verification

wallet_routes = Blueprint('wallets', __name__)

@wallet_routes.route('/', methods=['POST'])
@login_required
def create_wallet():
    """
    Creates a new wallet for the authenticated user.
    """
    if current_user.wallet:
        return {'errors': {'message': 'Wallet already exists for this user'}}, 400

    data = request.get_json()
    wallet_address = data.get('wallet_address')

    if not wallet_address:
        return {'errors': {'message': 'Wallet address is required'}}, 400

    # Create and save wallet
    wallet = Wallet(
        user_id=current_user.id,
        wallet_address=wallet_address,
        api_key="example_api_key"  # Replace with secure generation later
    )
    db.session.add(wallet)
    db.session.commit()

    return wallet.to_dict(), 201

@wallet_routes.route("/verify", methods=["POST"])
def verify_wallet():
    """
    Verifies wallet ownership using a signed message.
    """
    data = request.get_json()
    wallet_address = data.get("walletAddress")
    signature = data.get("signature")
    message = "Verify wallet ownership for My App"

    if not wallet_address or not signature:
        return {"errors": {"message": "Wallet address and signature are required"}}, 400

    try:
        # Encode the message
        encoded_message = encode_defunct(text=message)

        # Recover the address from the signature
        recovered_address = Web3().eth.account.recover_message(encoded_message, signature=signature)

        if recovered_address.lower() == wallet_address.lower():
            return {"message": "Wallet ownership verified!"}, 200
        else:
            return {"errors": {"message": "Invalid signature"}}, 400
    except Exception as e:
        print("Error verifying wallet:", e)
        return {"errors": {"message": "Verification failed"}}, 500

@wallet_routes.route('/connect', methods=['POST'])
def connect_wallet():
    data = request.get_json()
    wallet_address = data.get("walletAddress")

    if not wallet_address or not Web3.is_address(wallet_address):
        return {"error": "Invalid wallet address"}, 400

    existing_wallet = Wallet.query.filter_by(wallet_address=wallet_address).first()
    if existing_wallet:
        return {"message": "Wallet already connected"}, 200

    new_wallet = Wallet(user_id=current_user.id, wallet_address=wallet_address)
    db.session.add(new_wallet)
    db.session.commit()

    return {"message": "Wallet connected successfully!"}, 201


@wallet_routes.route("/balance", methods=["GET"])
def get_wallet_balance():
    """
    Fetches the balance of a wallet address using Alchemy.
    """
    print("Balance endpoint hit")  # Log route usage

    wallet_address = request.args.get("walletAddress")
    print(f"Received wallet address: {wallet_address}")  # Log received address

    # Check if the wallet address is valid
    if not Web3.is_address(wallet_address):
        print("Invalid wallet address")
        return {"errors": {"message": "Invalid wallet address"}}, 400

    # Check Alchemy connection
    from alchemy_utils import web3  # Ensure you're importing the `web3` instance
    if not web3.is_connected():
        print("Alchemy provider is not connected")
        return {"errors": {"message": "Failed to connect to Alchemy provider"}}, 500

    # Fetch balance
    balance = get_balance(wallet_address)
    print(f"Balance fetched: {balance}")  # Log fetched balance

    if balance is None:
        print("Failed to fetch balance")
        return {"errors": {"message": "Failed to fetch balance"}}, 500

    return {"balance": str(balance)}, 200
