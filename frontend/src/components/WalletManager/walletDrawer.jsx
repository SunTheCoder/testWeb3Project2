import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ethers } from 'ethers';
import { useSelector, useDispatch } from 'react-redux';
import { thunkUpdateUser } from '../../redux/session';
import {
  Box,
  Collapsible,
  HStack,
  Text,
  VStack,
List,
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
    AccordionItem,
    AccordionItemContent,
    AccordionItemTrigger,
    AccordionRoot,
  } from "@/components/ui/accordion"
  import { Tooltip } from "@/components/ui/tooltip"


import {
  DrawerBackdrop,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerRoot,
  DrawerTitle,
  DrawerTrigger,
  DrawerCloseTrigger
} from '@/components/ui/drawer';

import { TbWallet } from "react-icons/tb";

import { LuInfo } from "react-icons/lu"

import CreateWallet from './createWallet';
import GasPrice from './gasPrice';
import MetamaskButton from './MetamaskButton';
import { toaster } from '../ui/toaster';

const WalletDrawer = ({user}) => {
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [userBalance, setUserBalance] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [currentWallet, setCurrentWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [promptUpdate, setPromptUpdate] = useState(false);
  
  const blockchainDescription = "Blockchain is a digital ledger technology that records transactions across a network of computers in a secure, transparent, and decentralized manner. Each transaction is grouped into a \"block,\" and these blocks are linked together in a chronological sequence, forming a \"chain.\""

  const blochchainHow = [
    "Decentralization: Unlike traditional systems that rely on a single central server, blockchain uses a distributed network where all participants (called nodes) share and validate data.",
    "Transparency: Every transaction is recorded on a shared ledger that is visible to all participants. Once a transaction is added, it is nearly impossible to alter without the agreement of the entire network.",
    "Security: Transactions are encrypted and grouped into blocks that are validated using consensus mechanisms such as Proof of Work (PoW) or Proof of Stake (PoS). This makes tampering extremely difficult.",
    "Immutability: Once data is recorded on the blockchain, it cannot be easily modified or deleted, ensuring trust and reliability.",
    "Smart Contracts: Many blockchains, like Ethereum and Polygon, allow for programmable agreements called smart contracts, which automatically execute predefined actions when conditions are met.",
  ];
  
  const blockchainImportance = [
    "Trust: Blockchain eliminates the need for intermediaries (like banks or authorities) by establishing trust through cryptographic proofs and consensus.",
    "Efficiency: Transactions can happen directly between parties, reducing time and costs.",
    "Inclusion: Blockchain provides opportunities for individuals and communities who lack access to traditional financial systems.",
  ];

  const layer2Description = "Layer 2 solutions are designed to make cryptocurrency transactions faster, cheaper, and more efficient by handling transactions off the main blockchain (Layer 1) while maintaining the security and decentralization of Ethereum. MATIC, a token used on the Polygon network, is an excellent example of a Layer 2 asset. Even though it operates on Polygon, it remains compatible with Ethereum's blockchain as an ERC-20 token. This means you can enjoy lower fees and quicker transactions without sacrificing the security of Ethereum. Using Layer 2, like Polygon, allows you to contribute to your community investments seamlessly and affordably."

  const blockchainMission = [
    "Decentralization: The app’s reliance on blockchain removes control from centralized entities, ensuring that no single party has undue influence over the system. This decentralization aligns with the values of fairness, autonomy, and self-governance.", 
    "Transparency and Trust: Blockchain ensures that community actions, such as resource sharing, transactions, or decision-making, are transparent and verifiable. -The immutable nature of the ledger fosters trust among users, which is crucial for building strong, resilient communities.",
    "Financial Resilience: Blockchain-based tokens or cryptocurrencies can enable communities to transact even in areas with limited banking infrastructure. Smart contracts ensure fair exchanges and reduce the risk of fraud or exploitation.",
    "Community Empowerment: The app can enable users to manage resources, vote on decisions, and participate in community activities directly through blockchain. This encourages active involvement and reduces reliance on external authorities.",
    "Resilience in Crises: During disruptions or disasters, a blockchain-based system remains operational as long as the network is active, offering a dependable platform for organizing aid, sharing resources, or rebuilding trust."
   ]

  
  const walletDescription = "This feature lets you connect your/a crypto wallet to participate in projects that benefit your community. Invest in local proposals, track funding goals, and see how your contributions create real impact. Secure and transparent transactions powered by blockchain ensure your support goes where it is needed most."
  
  const infoItems = [
    { value: "a", title: "What is Blockchain?", text: blockchainDescription },
    { value: "b", title: "How does Blockchain work?", text: blochchainHow },
    { value: "c", title: "Why is Blockchain important?", text: blockchainImportance },
    { value: "d", title: "Why Layer 2?", text: layer2Description },
    { value: "e", title: "Why Blockchain Supports This Mission?", text: blockchainMission },

    { value: "f", title: "Is this secure?", text: "Some value 3..." },
    { value: "g", title: "Why should I download the Metamask extension?", text: "Some value 4..." },
  ]
  
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
        setPromptUpdate(true);
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

   // Detect wallet changes
   useEffect(() => {
    const handleAccountsChanged = async (accounts) => {
      if (accounts.length === 0) {
        // Wallet disconnected
        setDefaultAccount(null);
        setUserBalance(null);
        console.log('Wallet disconnected');
      } else {
        // Wallet switched
        const walletAddress = accounts[0];
        setDefaultAccount(walletAddress);
        await dispatch(thunkUpdateUser(walletAddress)); // Update Redux store and backend
        await fetchBalance(walletAddress);
      }
    };

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, [dispatch]);

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

  if (!user) {
    return (
      <Button
        main
        fontWeight="bold"
        size="xs"
        color="gold"
        _dark={{ color: "gold" }}
        ml={5}
        onClick={() =>
          toaster.create({
            title: 'Login Required',
            description: 'You must be logged in to access the upload manager.',
            type: 'error',
            duration: 5000,
          })
        }
      >
        <TbWallet />
        Wallet Manager
      </Button>
    );
  }
  

  return (
    <DrawerRoot placement="start" size="sm" >
      <DrawerBackdrop />
      <DrawerTrigger asChild>
        <Button
          main
          fontWeight="bold"
          size="xs"
          color="gold"
          
          _dark={{ color: "gold" }}
          ml={5}
        >
            
            <TbWallet />
        Wallet Manager
        </Button>
      </DrawerTrigger>
      <DrawerContent 
        borderRightRadius="lg" 
        h="fit-content" 
        mt="60px"
        bg="rgb(220, 151, 222)" 
        border="2px solid"
        borderColor="gold"
        borderLeft="none"
        >
        <DrawerHeader>
          <DrawerTitle> {formattedUsername}'s Wallet Manager </DrawerTitle>
          <Collapsible.Root>
        <Tooltip content={"Info on Ethereum and Layer 2 Blockchain Solutions"}>
    <Collapsible.Trigger borderRadius="sm" cursor="pointer" my={1} p={1} fontSize="18px" _hover={{bg: "teal.200"}}> <LuInfo /></Collapsible.Trigger>
    </Tooltip>
    <Collapsible.Content>
    <AccordionRoot collapsible>
  {infoItems.map((item, index) => (
    <AccordionItem key={index} value={item.value}>
      <AccordionItemTrigger>{item.title}</AccordionItemTrigger>
      <AccordionItemContent>
        {Array.isArray(item.text) ? (
          <List.Root spacing={3}>
            {item.text.map((listItem, listIndex) => (
              <List.Item mb={3} key={listIndex}>{listItem}</List.Item>
            ))}
          </List.Root>
        ) : (
          <p>{item.text}</p>
        )}
      </AccordionItemContent>
    </AccordionItem>
  ))}
</AccordionRoot>


    </Collapsible.Content>
  </Collapsible.Root>
        </DrawerHeader>
        <DrawerBody>
          <VStack spacing={4} align="start">
            <HStack>
              <Button
                main
                size="xs"
                onClick={connectWalletHandler}
              >
                Connect Wallet
              </Button>
              <CreateWallet />
              <MetamaskButton />
            </HStack>

            {currentWallet && currentWallet !== defaultAccount && (
                <Box>
                    <Text fontWeight="bold">Existing Wallet:</Text>
                    <Text>{currentWallet}</Text>
                    <Text>Do you want to overwrite it?</Text>
                    <HStack spacing={2} mt={2}>
                    <Button
                        size="sm"
                        colorScheme="teal"
                        onClick={updateWalletHandler} // Call the existing handler
                    >
                        Yes, overwrite
                    </Button>
                    <Button
                        size="sm"
                        colorScheme="red"
                        onClick={() => setPromptUpdate(false)} // Dismiss the prompt
                    >
                        No, cancel
                    </Button>
                    </HStack>
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
          {/* <Button variant="outline" onClick={() => setDrawerOpen(false)}>
            Close
          </Button> */}
        </DrawerFooter>

        <DrawerCloseTrigger />
      </DrawerContent>
    </DrawerRoot>
  );
};

export default WalletDrawer;
