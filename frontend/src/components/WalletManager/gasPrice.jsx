import React, { useState, useEffect } from 'react';
import { Text, VStack, Spinner } from '@chakra-ui/react';
import axios from 'axios';

const INFURA_KEY = import.meta.env.VITE_INFURA_API_KEY;

const GasPrice = () => {
  const [gasPrice, setGasPrice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGasPrice = async () => {
      try {
        const response = await axios.post(
          `https://mainnet.infura.io/v3/${INFURA_KEY}`,
          {
            jsonrpc: '2.0',
            method: 'eth_gasPrice',
            params: [],
            id: 1,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        const weiGasPrice = parseInt(response.data.result, 16); // Convert hex to decimal
        const gweiGasPrice = weiGasPrice / 1e9; // Convert wei to gwei
        setGasPrice(gweiGasPrice);
      } catch (error) {
        console.error('Error fetching gas price:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGasPrice();
  }, []);

  if (loading) {
    return <Spinner color="white" />;
  }

  return (
    <VStack>
      
      <Text color="white" fontSize="xs" textAlign="center">
        {gasPrice ? `${gasPrice.toFixed(2)} Gwei` : 'Unable to fetch gas price'}
      </Text>
    </VStack>
  );
};

export default GasPrice;
