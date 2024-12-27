import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ethers } from 'ethers';
import { useSelector, useDispatch } from 'react-redux';
import { thunkUpdateUser } from '../../redux/session'; // Assuming the thunk is exported from the session file
import {
  Box,
  Heading,
  HStack,
  Text,
  VStack  
} from '@chakra-ui/react';
import {
  Skeleton,
  SkeletonCircle,
  SkeletonText,
} from "@/components/ui/skeleton"
import CreateWallet from './createWallet';
import GasPrice from './gasPrice';


const WalletCard = () => {
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [userBalance, setUserBalance] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [promptUpdate, setPromptUpdate] = useState(false);
  const [currentWallet, setCurrentWallet] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state for Skeletons
  const [showGas, setShowGas] = useState(false); // Show gas prices only after fetching balance

  const user = useSelector((state) => state.session?.user);
  const dispatch = useDispatch();

  // Connect to MetaMask
  const connectWalletHandler = async () => {
    
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed.');
      }

      setLoading(true); // Start loading
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      const walletAddress = accounts[0];
      console.log('Connected wallet:', walletAddress);

      // Check if the user already has a wallet address
      if (user?.wallet_address) {
        setPromptUpdate(true);
        setCurrentWallet(user.wallet_address);
        setLoading(false); // Stop loading
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
    } finally {
      setLoading(false); // Stop loading
      setShowGas(true);
    }
  };

  // Update the wallet address
  const updateWalletHandler = async () => {
    try {
      setLoading(true); // Start loading
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
    } finally {
      setLoading(false); // Stop loading
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
    <Box
      bg="rgb(98, 64, 96)"
      w="fit-content"
      h="fit-content"
      border="2px solid"
      borderColor="black"
      ml="20px"
      p="15px"
      borderRadius="sm"
      shadow="md"
      mb={10}
    >
      <VStack>
        <Heading color="white" size="lg">
          Wallet Manager
        </Heading>
        <HStack>
          <Button 
            bg= "radial-gradient(circle,rgb(135, 16, 131),rgb(161, 77, 166))"
            _hover={{background: "radial-gradient(circle,rgb(135, 11, 131),rgb(191, 97, 196))"}}
            shadow="md"
            border="1px solid"
            borderColor="teal.500"
            borderRadius="sm" 
            size="xs" 
            onClick={connectWalletHandler}
            >
            Connect Wallet
          </Button>
          <CreateWallet />
        </HStack>
        {promptUpdate && (
          <Box>
            <Text color="white">
              You already have a wallet connected: {currentWallet}
            </Text>
            <Text color="white">Do you want to overwrite it?</Text>
            <Button size="xs" onClick={updateWalletHandler}>
              Yes, overwrite
            </Button>
            <Button size="xs" onClick={() => setPromptUpdate(false)}>
              No, cancel
            </Button>
          </Box>
        )}

        <VStack pb={4}>
        <Text color="white" fontWeight="bold">
          Address:
        </Text>
        <Skeleton loading={loading} width="210px">
          <Text color="white" fontSize="xs">
            {defaultAccount || 'Not connected'}
          </Text>
        </Skeleton>

        <Text color="white" fontWeight="bold">
          Balance:
        </Text>
        <SkeletonText loading={loading} noOfLines={1} width="210px">
          <Text  color="white" fontSize="xs" textAlign="center">
            {userBalance !== null ? `${userBalance} ETH` : 'N/A'}
          </Text>
          
         
          
        </SkeletonText>
        <Text color="white" fontWeight="bold">
          Gas Price:
        </Text>
        <SkeletonText loading={loading} noOfLines={1} width="210px">
          <GasPrice />          
        </SkeletonText>
        </VStack>

        {errorMessage && <Text color="red.500">{errorMessage}</Text>}
      </VStack>
    </Box>
  );
};

export default WalletCard;
