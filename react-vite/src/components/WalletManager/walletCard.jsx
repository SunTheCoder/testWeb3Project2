import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

const WalletCard = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [userBalance, setUserBalance] = useState(null);

  // Connect to MetaMask
  const connectWalletHandler = async () => {
    try {
      if (!window.ethereum) {
        throw new Error("MetaMask is not installed.");
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (!accounts || accounts.length === 0) {
        throw new Error("No accounts returned.");
      }

      console.log("Connected account:", accounts[0]);
      setDefaultAccount(accounts[0]);
      await fetchBalance(accounts[0]);
    } catch (error) {
      console.error("Error connecting wallet:", error);
      setErrorMessage(error.message);
    }
  };

  // Fetch user balance
  const fetchBalance = async (address) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const balance = await provider.getBalance(address);

      console.log("Raw balance (in Wei):", balance.toString()); // v6: Use `.toString()` for BigInt
      const formattedBalance = ethers.formatEther(balance); // Updated to `ethers.formatEther`
      console.log("Formatted balance (in ETH):", formattedBalance);

      setUserBalance(formattedBalance);
    } catch (error) {
      console.error("Error fetching balance:", error);
      setErrorMessage(error.message);
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", connectWalletHandler);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", connectWalletHandler);
      }
    };
  }, []);

  return (
    <div>
      <h4>Connect to MetaMask</h4>
      <button onClick={connectWalletHandler}>Connect Wallet</button>
      <div>Address: {defaultAccount || "Not connected"}</div>
      <div>Balance: {userBalance !== null ? `${userBalance} ETH` : "N/A"}</div>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </div>
  );
};

export default WalletCard;
