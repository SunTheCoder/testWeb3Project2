import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { useDispatch, useSelector } from 'react-redux';
import { ethers } from 'ethers';
import { thunkUpdateUser } from '../../redux/session'; // Assuming the thunk is in session
import { Box, Text } from '@chakra-ui/react';

const CreateWallet = () => {
  const [walletCreated, setWalletCreated] = useState(false);
  const [walletDetails, setWalletDetails] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const user = useSelector((state) => state.session?.user);
  const dispatch = useDispatch();

  const createWalletHandler = async () => {
    try {
      // Generate a new wallet
      const wallet = ethers.Wallet.createRandom();

      const walletAddress = wallet.address;
      const privateKey = wallet.privateKey;

      // Save the wallet address to the backend
      await dispatch(thunkUpdateUser(walletAddress));

      setWalletDetails({ walletAddress, privateKey });
      setWalletCreated(true);

      console.log('Wallet created:', { walletAddress, privateKey });
    } catch (error) {
      console.error('Error creating wallet:', error);
      setErrorMessage(error.response?.data?.error || error.message);
    }
  };

  return (
    <Box>
      {!walletCreated ? (
        <Button 
        
        main
            size="xs" 
            onClick={createWalletHandler}>Create Wallet</Button>
      ) : (
        <Box>
          <Text>🎉 Wallet Created Successfully!</Text>
          <Text><strong>Wallet Address:</strong> {walletDetails?.walletAddress}</Text>
          <Text><strong>Private Key:</strong> {walletDetails?.privateKey}</Text>
          <Text>⚠️ Save your private key securely. You won't be able to recover it later!</Text>
        </Box>
      )}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </Box>
  );
};

export default CreateWallet;
