import { Box, Heading, Text, VStack, HStack, Input, Textarea } from '@chakra-ui/react';
import { pinata } from '../../utils/config';
import { Button } from '../ui/button';
import { Alert } from "@/components/ui/alert";
import { useState } from 'react';

const ViewUploads = ({ allFiles,  setAllFiles, user }) => {
  const formattedUsername = user.username.slice(0, 1).toUpperCase() + user.username.slice(1).toLowerCase();

  const [editingFileId, setEditingFileId] = useState(null);
  const [editedMetadata, setEditedMetadata] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  const unpinFile = async (id, hash) => {
    try {
      console.log('Attempting to delete file with ID and hash:', id, hash);
      
      const unpin = await pinata.unpin([hash]);
      if (unpin) {
        const res = await fetch(`/api/uploads/${id}/${hash}`, {
          method: 'DELETE',
        });
        if (!res.ok) {
          const error = await res.text();
          throw new Error(error);
        }
        const data = await res.json();
        console.log('Deleted file response:', data);
        alert(data.message);

        setAllFiles((prevFiles) => prevFiles.filter((file) => file.id !== id));

      }
    } catch (error) {
      console.error('Error during deletion:', error);
    }
  };
  

  const handleEditMetadata = (fileId, currentMetadata) => {
    setEditingFileId(fileId);
    setEditedMetadata(Object.entries(currentMetadata || {}).map(([key, value]) => ({ key, value })));
  };

  const handleMetadataChange = (index, field, value) => {
    setEditedMetadata((prev) => {
      const updatedMetadata = [...prev];
      updatedMetadata[index][field] = value;
      return updatedMetadata;
    });
  };

  const saveMetadata = async (fileId) => {
    setIsSaving(true);
    try {
      const newMetadata = editedMetadata.reduce((acc, { key, value }) => {
        acc[key] = value;
        return acc;
      }, {});
  
      const res = await fetch(`/api/uploads/${fileId}`, { // Ensure fileId matches backend's expectation
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ upload_metadata: newMetadata }),
      });
  
      if (res.ok) {
        alert('Metadata updated successfully!');
        setEditingFileId(null);
      } else {
        console.error('Error saving metadata:', await res.text());
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSaving(false);
    }
  };
  

  return (
    <Box
      p={4}
      borderRadius="md"
      maxH="90vh"
      maxW="80vw"
      bg="radial-gradient(circle, rgba(212, 192, 139, 0.8), rgba(142, 68, 173, 0.8))"
      shadow="lg"
    >
      <Heading size="2xl" fontWeight="bold" mb={4} color="gold" textAlign="center">
        {formattedUsername}'s Uploads
      </Heading>
      {allFiles?.length > 0 ? (
        <VStack spacing={4} align="stretch" maxH="500px" overflowY="auto">
          {[...allFiles].reverse().map((file) => (
            <Box
              key={file.id}
              p={4}
              borderRadius="md"
              shadow="sm"
              bg="purple.100"
              mx="20px"
            >
              <VStack align="start" spacing={2}>
                <HStack>
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
                <HStack spacing={4}>
                  <Button
                    as="a"
                    href={file.gatewayUrl}
                    target="_blank"
                    rel="noreferrer"
                    size="sm"
                  >
                    View Upload
                  </Button>
                  <Button
                    colorScheme="red"
                    size="sm"
                    onClick={() => unpinFile(file.id, file.ipfsHash)}

                  >
                    Delete
                  </Button>
                  <Button
                    colorScheme="blue"
                    size="sm"
                    onClick={() => handleEditMetadata(file.id, file.uploadMetadata)}
                  >
                    Edit Metadata
                  </Button>
                </HStack>
                {editingFileId === file.id && (
                  <Box p={4} bg="gray.100" borderRadius="md" mt={2} w="full">
                    <Heading size="sm" mb={2}>
                      Edit Metadata
                    </Heading>
                    {editedMetadata.map(({ key, value }, index) => (
                      <HStack key={index} mb={2}>
                        <Input
                          placeholder="Key"
                          value={key}
                          onChange={(e) => handleMetadataChange(index, 'key', e.target.value)}
                        />
                        <Textarea
                          placeholder="Value"
                          value={value}
                          onChange={(e) => handleMetadataChange(index, 'value', e.target.value)}
                        />
                      </HStack>
                    ))}
                    <Button
                      colorScheme="green"
                      size="sm"
                      onClick={() => saveMetadata(file.id)}
                      isLoading={isSaving}
                    >
                      Save
                    </Button>
                  </Box>
                )}
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
