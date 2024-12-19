from app.models import db, Wallet, User

def seed_wallets():
    # Fetch seeded users
    demo = User.query.filter_by(username='Demo').first()
    marnie = User.query.filter_by(username='marnie').first()
    bobbie = User.query.filter_by(username='bobbie').first()

    # Create wallets for the users
    wallet1 = Wallet(user_id=demo.id, wallet_address="0xDEMO123", wallet_key="demo_wallet_key")
    wallet2 = Wallet(user_id=marnie.id, wallet_address="0xMARNIE123", wallet_key="marnie_wallet_key")
    wallet3 = Wallet(user_id=bobbie.id, wallet_address="0xBOBBIE123", wallet_key="bobbie_wallet_key")

    # Add to session and commit
    db.session.add(wallet1)
    db.session.add(wallet2)
    db.session.add(wallet3)
    db.session.commit()

    print("Seeded wallets successfully!")


def undo_wallets():
    db.session.execute('TRUNCATE TABLE wallets RESTART IDENTITY CASCADE;')
    db.session.commit()
