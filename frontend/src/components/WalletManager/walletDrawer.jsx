import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ethers } from 'ethers';
import { useSelector, useDispatch } from 'react-redux';
import { thunkUpdateUser } from '../../redux/session';
import {
  Box,
  HStack,
  Text,
  VStack,

} from '@chakra-ui/react';
import {
    Skeleton,
    SkeletonCircle,
    SkeletonText,
  } from "@/components/ui/skeleton"
  import {
    ClipboardRoot, 
    ClipboardButton,
    ClipboardIconButton,
    ClipboardInput,
  } from "@/components/ui/clipboard"

import {
  DrawerBackdrop,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerRoot,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { CiWallet } from "react-icons/ci";

import CreateWallet from './createWallet';
import GasPrice from './gasPrice';

const WalletDrawer = ({user}) => {
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [userBalance, setUserBalance] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [currentWallet, setCurrentWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  
  
  
  const formattedUsername = user?.username.slice(0,1).toUpperCase() + user?.username.slice(1).toLowerCase()
  const dispatch = useDispatch();

  // Connect to MetaMask
  const connectWalletHandler = async () => {
    setLoading(true);
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed.');
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      const walletAddress = accounts[0];
      setCurrentWallet(user?.wallet_address || null);

      if (user?.wallet_address && user.wallet_address !== walletAddress) {
        setCurrentWallet(user.wallet_address);
        return;
      }

      await dispatch(thunkUpdateUser(walletAddress));
      setDefaultAccount(walletAddress);
      await fetchBalance(walletAddress);
    } catch (error) {
      setErrorMessage(error.message || 'Error connecting wallet');
    } finally {
      setLoading(false);
    }
  };

  // Fetch wallet balance
  const fetchBalance = async (walletAddress) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const balance = await provider.getBalance(walletAddress);
      setUserBalance(ethers.formatEther(balance));
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <DrawerRoot placement="start" size="sm" >
      <DrawerBackdrop />
      <DrawerTrigger asChild>
        <Button
          bg="radial-gradient(circle,rgb(135, 16, 131),rgb(161, 77, 166))"
          _hover={{
            background: 'radial-gradient(circle,rgb(135, 11, 131),rgb(191, 97, 196))',
          }}
          shadow="md"
          border="1px solid"
          borderColor="teal.500"
          borderRadius="sm"
          size="sm"
        >
            
         <CiWallet/>
        Wallet Manager
        </Button>
      </DrawerTrigger>
      <DrawerContent borderRightRadius="lg" h="50%" mt="50px">
        <DrawerHeader>
          <DrawerTitle> {formattedUsername}'s Wallet Manager </DrawerTitle>
        </DrawerHeader>
        <DrawerBody>
          <VStack spacing={4} align="start">
            <HStack>
              <Button
                border="1px solid"
                borderColor="teal.500"
                borderRadius="sm"
                shadow="md"
                bg="radial-gradient(circle,rgb(135, 16, 131),rgb(161, 77, 166))"
                _hover={{ background: 'radial-gradient(circle,rgb(135, 11, 131),rgb(191, 97, 196))' }}
                size="xs"
                onClick={connectWalletHandler}
              >
                Connect Wallet
              </Button>
              <CreateWallet />
            </HStack>

            {currentWallet && currentWallet !== defaultAccount && (
              <Box>
                <Text fontWeight="bold">Existing Wallet:</Text>
                <Text>{currentWallet}</Text>
                <Text>Do you want to overwrite it?</Text>
              </Box>
            )}
                
            <Box>
              <Text fontWeight="bold">Address:</Text>
              <Skeleton loading={loading}>
              <ClipboardRoot value={defaultAccount}>
        <HStack>
            
                <Text fontSize="xs">{defaultAccount || 'Not connected'}</Text>
            <ClipboardIconButton size="xs" variant="ghost"/>
        </HStack>
      </ClipboardRoot>
              </Skeleton>
            </Box>

            <Box>
              <Text fontWeight="bold">Balance:</Text>
              <Skeleton loading={loading}>
                <Text fontSize="xs">{userBalance ? `${userBalance} ETH` : 'N/A'}</Text>
              </Skeleton>
            </Box>

            <Text fontWeight="bold">Gas Price:</Text>
            {/* {defaultAccount && ( */}
              <Box>
                <Skeleton loading={loading}>
                    <GasPrice />
                </Skeleton>
              </Box>
            {/* )} */}

            {errorMessage && <Text color="red.500">{errorMessage}</Text>}
          </VStack>
        </DrawerBody>
        <DrawerFooter>
          <Button variant="outline" onClick={() => setDrawerOpen(false)}>
            Close
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </DrawerRoot>
  );
};

export default WalletDrawer;
