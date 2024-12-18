from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import Wallet, db

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


@wallet_routes.route('/', methods=['GET'])
@login_required
def get_wallet():
    """
    Retrieves the authenticated user's wallet.
    """
    wallet = Wallet.query.filter_by(user_id=current_user.id).first()
    if not wallet:
        return {'errors': {'message': 'No wallet found'}}, 404

    return wallet.to_dict(), 200


@wallet_routes.route('/', methods=['DELETE'])
@login_required
def delete_wallet():
    """
    Deletes the authenticated user's wallet.
    """
    wallet = Wallet.query.filter_by(user_id=current_user.id).first()
    if not wallet:
        return {'errors': {'message': 'No wallet found'}}, 404

    db.session.delete(wallet)
    db.session.commit()
    return {'message': 'Wallet deleted successfully'}, 200
