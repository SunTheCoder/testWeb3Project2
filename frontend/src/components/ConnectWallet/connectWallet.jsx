import React, { useState } from "react";
import { ethers } from "ethers";
import axios from "axios";

const ConnectWallet = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [error, setError] = useState(null);

  // Connect Metamask
  const connectMetamask = async () => {
    try {
      if (!window.ethereum) {
        setError("Metamask is not installed. Please install it to use this app.");
        return;
      }

      // Request wallet connection
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const address = accounts[0];
      setWalletAddress(address);
      console.log("Connected wallet:", address);

      // Optional: Sign a message to verify ownership
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const message = "Verify wallet ownership for My App";
      const signature = await signer.signMessage(message);

      console.log("Signature:", signature);

      // Send the wallet address and signature to the backend
      await axios.post("/api/wallets/verify", { walletAddress: address, signature });
    } catch (err) {
      console.error(err);
      setError("Failed to connect wallet. Please try again.");
    }
  };

  return (
    <div>
      {walletAddress ? (
        <div>
          <p>Connected Wallet: {walletAddress}</p>
        </div>
      ) : (
        <button onClick={connectMetamask}>Connect Wallet</button>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default ConnectWallet;
