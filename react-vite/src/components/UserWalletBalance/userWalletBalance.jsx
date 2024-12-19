import React, { useState, useEffect } from "react";
import axios from "axios";
import { ethers } from "ethers";

const UserWalletBalance = ({ user }) => {
  const [userBalance, setUserBalance] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Fetch ETH balance for the user's wallet
  const fetchBalance = async (walletAddress) => {
    try {
      // Use ethers.js to fetch the wallet balance
      const provider = new ethers.BrowserProvider(window.ethereum);
      const balance = await provider.getBalance(walletAddress);

      // Format balance to ETH
      const formattedBalance = ethers.formatEther(balance);
      setUserBalance(formattedBalance);
    } catch (error) {
      console.error("Error fetching balance:", error);
      setErrorMessage("Failed to fetch wallet balance.");
    }
  };

  useEffect(() => {
    // Check if the user is logged in and has a wallet
    if (user && user.wallet && user.wallet.wallet_address) {
      fetchBalance(user.wallet.wallet_address);
    }
  }, [user]);

  // Render nothing if the user isn't logged in or doesn't have a wallet
  if (!user || !user.wallet || !user.wallet.wallet_address) {
    return null;
  }

  return (
    <div>
      <h4>Your ETH Balance</h4>
      <div>
        Wallet Address: <strong>{user.wallet.wallet_address}</strong>
      </div>
      <div>
        Balance: {userBalance !== null ? `${userBalance} ETH` : "Loading..."}
      </div>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </div>
  );
};

export default UserWalletBalance;
