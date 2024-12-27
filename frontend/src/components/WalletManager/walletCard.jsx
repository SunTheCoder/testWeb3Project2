import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { ethers } from 'ethers';
import { useSelector, useDispatch } from 'react-redux';
import { thunkUpdateUser } from '../../redux/session'; // Assuming the thunk is exported from the session file
import { Box, Heading, HStack, Text, VStack } from '@chakra-ui/react';
import CreateWallet from './createWallet';

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
    <Box bg="teal.700"


    w="fit-content" border="2px solid" borderColor="black" ml="20px" p="15px" borderRadius="sm">
      <VStack>
      <Heading color="white" size="lg">Wallet Manager</Heading>
      <HStack>
      <Button size="xs" onClick={connectWalletHandler}>Connect Wallet</Button>
      <CreateWallet/>
      </HStack>
      {promptUpdate && (
        <Box>
          <Text color="white">You already have a wallet connected: {currentWallet}</Text>
          <Text color="white">Do you want to overwrite it?</Text>
          <Button size="xs" onClick={updateWalletHandler}>Yes, overwrite</Button>
          <Button size="xs" onClick={() => setPromptUpdate(false)}>No, cancel</Button>
        </Box>
      )}

      <Text color="white" fontWeight="bold">Address:</Text>
      <Text color="white" fontSize="sm">{defaultAccount || 'Not connected'}</Text>
      <Text color="white" fontWeight="bold">Balance:</Text>
      <Text color="white" fontSize="sm">{userBalance !== null ? `${userBalance} ETH` : 'N/A'}</Text>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      </VStack>
    </Box>
  );
};

export default WalletCard;
