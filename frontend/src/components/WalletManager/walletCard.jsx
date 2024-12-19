import React, { useState } from "react";
import axios from "axios";
import { ethers } from "ethers";

const WalletCard = () => {
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [userBalance, setUserBalance] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Connect to MetaMask
  const connectWalletHandler = async () => {
    try {
      if (!window.ethereum) {
        throw new Error("MetaMask is not installed.");
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const walletAddress = accounts[0];
      console.log("Connected wallet:", walletAddress);

      // Send the wallet address to your backend
      const response = await axios.post("/api/wallets/connect", {
        walletAddress,
      });

      setDefaultAccount(walletAddress);
      console.log("Wallet connected successfully:", response.data);
      await fetchBalance(walletAddress);
    } catch (error) {
      console.error("Error connecting wallet:", error);
      setErrorMessage(error.response?.data?.error || error.message);
    }
  };

  // Create a new wallet
  const createWalletHandler = async () => {
    try {
      const response = await axios.post("/api/wallets/create");
  
      const { walletAddress, privateKey } = response.data;
  
      // Alert the user with wallet details
      alert(
        `🎉 Wallet Created Successfully!\n\n` +
        `Wallet Address: ${walletAddress}\n` +
        `Private Key: ${privateKey}\n\n` +
        `⚠️ Save your private key securely! You will not be able to recover it.`
      );
  
      console.log("Wallet created:", walletAddress);
    } catch (error) {
      console.error("Error creating wallet:", error.response?.data || error.message);
    }
  };
  

  // Fetch wallet balance
  const fetchBalance = async (walletAddress) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const balance = await provider.getBalance(walletAddress);

      const formattedBalance = ethers.formatEther(balance);
      setUserBalance(formattedBalance);
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  return (
    <div>
      <h4>Wallet Manager</h4>
      <button onClick={connectWalletHandler}>Connect Wallet</button>
      <button onClick={createWalletHandler}>Create Wallet</button>
      <div>Address: {defaultAccount || "Not connected"}</div>
      <div>Balance: {userBalance !== null ? `${userBalance} ETH` : "N/A"}</div>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </div>
  );
};

export default WalletCard;
