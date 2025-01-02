import React from "react";
import { Box, Heading, Text, VStack } from "@chakra-ui/react";

const HomePage = () => {


    return (

        <Box 
            px="60px" 
            py="20px"
            >
            <VStack>
            <Heading
            size="5xl"
            bg="radial-gradient(circle, rgba(146, 129, 81, 0.8), rgba(85, 18, 113, 0.8))"
            bgClip="text"
            textFillColor="transparent"
            w="fit"
            _dark={{
                bg:"radial-gradient(circle, rgba(95, 85, 58, 0.8), rgba(69, 15, 92, 0.8))",
                bgClip:"text",
                textFillColor:"transparent",
                w:"fit"
             }}
            
            
            >
            SpaceCase
            </Heading>
            </VStack>


            <Heading
                p="45px"
                size="xl"
                fontWeight="bold"
                textAlign="center"
                >

            Welcome
            </Heading>

            <Text 
                py="40px"
                px="20px"
                textAlign="center"
                >
            SpaceCase is a groundbreaking platform that leverages the power of IPFS (InterPlanetary File System) to provide a secure, scalable, and decentralized approach to content management and sharing. Whether you're exploring Web3 or simply looking for a more resilient way to store and share your files, our app offers a seamless solution.

Key Features:
Decentralized Storage with IPFS: Securely store and retrieve files in a distributed network, ensuring data permanence and resilience.
Pinning Made Easy: Using Pinata, manage your IPFS-pinned content effortlessly, keeping it available and accessible for your audience.
Intuitive User Experience: A user-friendly interface for uploading, managing, and sharing your files across the decentralized web.
Future-Ready Integration: Lay the foundation for integrating Web3 features like NFTs, smart contracts, and decentralized identities.
Why Decentralization Matters:
In a world where control over data is paramount, our app empowers users to break free from centralized limitations. By embracing the principles of Web3, you can take ownership of your digital assets and ensure they remain available and unaltered.

Who Is It For?
Whether you're an artist, developer, researcher, or blockchain enthusiast, SpaceCase is designed to meet your needs. From hosting artwork to archiving critical data, the possibilities are endless.
            </Text>

        </Box>



    )



}

export default HomePage;