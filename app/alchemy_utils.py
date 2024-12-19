import os
from web3 import Web3

# Alchemy connection setup
ALCHEMY_API_KEY = os.getenv("ALCHEMY_API_KEY")
alchemy_url = f"https://eth-mainnet.g.alchemy.com/v2/{ALCHEMY_API_KEY}"

web3 = Web3(Web3.HTTPProvider(alchemy_url))

# Ensure Alchemy connection works
if web3.is_connected():
    print("Connected to Alchemy successfully!")
else:
    print("Failed to connect to Alchemy provider.")

def get_balance(wallet_address):
    """
    Fetch the balance of a wallet address in Ether.
    """
    try:
        balance = web3.eth.get_balance(wallet_address)  # Balance in Wei
        return web3.fromWei(balance, "ether")  # Convert to Ether
    except Exception as e:
        print(f"Error fetching balance: {e}")
        return None
