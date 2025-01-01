import React from 'react';
import {
  Box,
  Image,
  Text,
  Button,
  VStack,
  HStack,
  Heading,
} from '@chakra-ui/react';

const UploadQueue = ({ selectedFiles, deleteFile }) => {
  return (
    <Box 
      p={4} 
      bg= "radial-gradient(circle, rgba(212, 192, 139, 0.8), rgba(142, 68, 173, 0.8))" 
      borderRadius="md" 
      shadow="md"
      >
      <Heading size="md" fontWeight="bold" mb={4}>
        Files Waiting to Upload
      </Heading>
      <VStack spacing={4} align="stretch">
        {selectedFiles.map((file, index) => {
          const isImage = file.type.startsWith('image/');
          const preview = isImage ? URL.createObjectURL(file) : null;

          return (
            <HStack
              key={index}
              p={3}
              bg="purple.100" 

              borderRadius="md"
              shadow="sm"
              // borderWidth="1px"
              // borderColor="gray.200"
              align="center"
              spacing={4}
            >
              {isImage && (
                <Image
                  src={preview}
                  alt={file.name}
                  boxSize="50px"
                  objectFit="cover"
                  borderRadius="md"
                />
              )}
              <VStack align="start" spacing={0} flex="1">
                <Text fontWeight="medium">{file.name}</Text>
                <Text fontSize="sm" color="gray.500">
                  {Math.round(file.size / 1024)} KB
                </Text>
              </VStack>
              <Button
                logout
                size="xs"
                colorScheme="red"
                onClick={() => deleteFile(index)}
              >
                Remove
              </Button>
            </HStack>
          );
        })}
      </VStack>
    </Box>
  );
};

export default UploadQueue;
