import { Box, Heading, Text, Link, VStack, HStack, Separator} from '@chakra-ui/react';
import { pinata } from '../../utils/config';
import { Button } from '../ui/button';
import { Alert } from "@/components/ui/alert"




const ViewUploads = ({ allFiles, user }) => {

  const formattedUsername = user.username.slice(0,1).toUpperCase() + user.username.slice(1).toLowerCase()

  const unpinFile = async (hash) => {
    try {
      const unpin = await pinata.unpin([hash]);
      if (unpin) {
        const res = await fetch(`/api/uploads/${hash}`, {
          method: 'DELETE',
        });
        if (!res.ok) {
          const error = await res.text();
          throw new Error(error);
        }
        const data = await res.json();
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box 
      p={4} 
      borderRadius="md" 
      maxH="90vh"            
      // border="2px solid"
      // borderColor="gold"
      maxW= "80vw"
      bg= "radial-gradient(circle, rgba(212, 192, 139, 0.8), rgba(142, 68, 173, 0.8))" 
      shadow="lg" 
      
    >
      <Heading size="2xl" fontWeight="bold" mb={4} color="gold" textAlign="center">
        {formattedUsername}'s Uploads
      </Heading>
      {allFiles?.length > 0 ? (
        <VStack spacing={4} align="stretch"
            maxH="500px" 
  overflowY="auto"
        >
          {[...allFiles].reverse().map((file) => (
            <Box
              key={file.id}
              p={4}
              
              borderRadius="md"
              shadow="sm"
              // borderWidth="1px"
              // borderColor="gold"
              bg="purple.100" 
              mx="20px"

            >
              <VStack align="start" spacing={2}>
                <HStack>
                  {file.mimeType === 'directory' && <Text fontWeight="bold">Directory:</Text>}
                  <Text fontWeight="bold">{file.name}</Text>
                </HStack>
                <Text>
                  <strong>IpfsHash:</strong> {file.ipfsHash}
                </Text>
                <Text>
                  <strong>Total Size:</strong>{' '}
                  {file.pinSize >= 1048576
                    ? `${(file.pinSize / 1048576).toFixed(2)} MB`
                    : `${(file.pinSize / 1024).toFixed(2)} KB`}
                </Text>
                {file.mimeType === 'directory' && (
                  <Text>
                    <strong>Number of Files:</strong> {file.numberOfFiles}
                  </Text>
                )}
                <Separator />
                <HStack spacing={4}>
                <Button
                  as="a"
                  login
                  href={file.gatewayUrl}
                  target="_blank"
                  rel="noreferrer"
                  
                  size="sm"
                >
                  View Upload{file.numberOfFiles > 1 ? 's' : ''}
                </Button>

                  <Button
                    logout
                    size="sm"
                    colorScheme="red"
                    onClick={() => unpinFile(file.ipfsHash)}
                  >
                    Delete
                  </Button>
                </HStack>
              </VStack>
            </Box>
          ))}
        </VStack>
      ) : (
        <Alert status="info" borderRadius="md">
          
          No uploads found.
        </Alert>
      )}
    </Box>
  );
};

export default ViewUploads;
