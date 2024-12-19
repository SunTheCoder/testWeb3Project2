import os
from web3 import Web3

# Load Alchemy API key from environment variables
ALCHEMY_API_KEY = os.getenv("ALCHEMY_API_KEY")
alchemy_url = f"https://eth-mainnet.alchemyapi.io/v2/{ALCHEMY_API_KEY}"

# Create a Web3 instance
web3 = Web3(Web3.HTTPProvider(alchemy_url))

# Check connection
if web3.isConnected():
    print("Connected to Alchemy successfully!")
else:
    print("Failed to connect to Alchemy.")

def get_balance(wallet_address):
    """
    Fetch the balance of a wallet address in Ether.
    """
    try:
        balance = web3.eth.get_balance(wallet_address)  # Balance in Wei
        return web3.fromWei(balance, "ether")  # Convert to Ether
    except Exception as e:
        print("Error fetching balance:", e)
        return None
