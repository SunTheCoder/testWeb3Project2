import React, { useState } from 'react';
import { ethers } from 'ethers';
import { useSelector, useDispatch } from 'react-redux';
import { thunkUpdateUser } from '../../redux/session'; // Assuming the thunk is exported from the session file

const WalletCard = () => {
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [userBalance, setUserBalance] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [promptUpdate, setPromptUpdate] = useState(false);
  const [currentWallet, setCurrentWallet] = useState(null);
  const user = useSelector((state) => state.session?.user);
  const dispatch = useDispatch();

  // Connect to MetaMask
  const connectWalletHandler = async () => {
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed.');
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      const walletAddress = accounts[0];
      console.log('Connected wallet:', walletAddress);

      // Check if the user already has a wallet address
      if (user?.wallet_address) {
        setPromptUpdate(true);
        setCurrentWallet(user.wallet_address);
        return;
      }

      // Update wallet address directly if there's no existing one
      await dispatch(thunkUpdateUser(walletAddress));
      setDefaultAccount(walletAddress);
      console.log('Wallet connected successfully');
      await fetchBalance(walletAddress);
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setErrorMessage(error.response?.data?.error || error.message);
    }
  };

  // Update the wallet address
  const updateWalletHandler = async () => {
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      const walletAddress = accounts[0];
      await dispatch(thunkUpdateUser(walletAddress));

      setDefaultAccount(walletAddress);
      setPromptUpdate(false);
      setCurrentWallet(null);
      console.log('Wallet updated successfully');
      await fetchBalance(walletAddress);
    } catch (error) {
      console.error('Error updating wallet:', error);
      setErrorMessage(error.response?.data?.error || error.message);
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
      console.error('Error fetching balance:', error);
    }
  };

  return (
    <div>
      <h4>Wallet Manager</h4>
      <button onClick={connectWalletHandler}>Connect Wallet</button>

      {promptUpdate && (
        <div>
          <p>You already have a wallet connected: {currentWallet}</p>
          <p>Do you want to overwrite it?</p>
          <button onClick={updateWalletHandler}>Yes, overwrite</button>
          <button onClick={() => setPromptUpdate(false)}>No, cancel</button>
        </div>
      )}

      <div>Address: {defaultAccount || 'Not connected'}</div>
      <div>Balance: {userBalance !== null ? `${userBalance} ETH` : 'N/A'}</div>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
};

export default WalletCard;
