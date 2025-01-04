import { pinata } from '../../utils/config'
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ViewUploads from './ViewUploads';
import UploadQueue from './UploadQueue';
import FileUploader from './FileUploader';
import { 
  Box, 
  Heading, 
  VStack, 
  Separator,
  Input,
  Text,
  Flex,
  HStack
} from '@chakra-ui/react';
import { Field } from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import { toaster } from '../ui/toaster';

const UploadsPage = () => {
  const user = useSelector((state) => state.session.user);
  const [name, setName] = useState('');
  const [metadata, setMetadata] = useState({});
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [metadataKVPairs, setMetadataKVPairs] = useState([]);
  const [allFiles, setAllFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user) {
      const getFiles = async () => {
        try {
          const res = await fetch(`/api/uploads/${user.id}`);
          const data = await res.json();
          setAllFiles(data);
        } catch (error) {
          console.error('Error fetching files:', error);
        }
      };
      getFiles();
    }
  }, [user]);

  const handleFiles = useCallback((acceptedFiles) => {
    setSelectedFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  }, []);

  const deleteFile = (index) => {
    const newSelectedFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newSelectedFiles);
  };

  const handleKeyValuePairChange = (index, key, value) => {
    const newKVPairs = [...metadataKVPairs];
    newKVPairs[index][key] = value;
    setMetadataKVPairs(newKVPairs);

    const newMetadata = metadataKVPairs.reduce((acc, pair) => {
      if (pair.key) acc[pair.key] = pair.value;
      return acc;
    }, {});
    setMetadata(newMetadata);
  };

  const addKeyValuePair = () => {
    setMetadataKVPairs([...metadataKVPairs, { key: '', value: '' }]);
  };

  const deleteKeyValuePair = (index) => {
    const newMetadataKVPairs = metadataKVPairs.filter((_, i) => i !== index);
    setMetadataKVPairs(newMetadataKVPairs);

    const newMetadata = newMetadataKVPairs.reduce((acc, pair) => {
      if (pair.key) acc[pair.key] = pair.value;
      return acc;
    }, {});
    setMetadata(newMetadata);
  };

  const deleteAllKVPairs = () => {
    setMetadataKVPairs([]);
    setMetadata({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || selectedFiles.length === 0) return;

    try {
      setUploading(true);
      let upload;

      if (selectedFiles.length > 1) {
        upload = await pinata.upload.fileArray(selectedFiles).addMetadata({
          name,
          keyValues: { ...metadata },
        });
      } else {
        upload = await pinata.upload.file(selectedFiles[0]).addMetadata({
          name,
          keyValues: { ...metadata },
        });
      }

      if (upload.IpfsHash) {
        const res = await fetch('/api/uploads/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            userId: user.id,
            IpfsHash: upload.IpfsHash,
            PinSize: upload.PinSize,
            Timestamp: upload.Timestamp,
            Metadata: metadata || null,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          setAllFiles((prevFiles) => [...prevFiles, data.uploads]); // Add new upload to the list
          toaster.create({
            title: 'File Uploaded',
            description: 'File uploaded successfully.',
            type:'success',
            duration: 5000,
          });
        } else {
          console.error('Error uploading file:', await res.text());
          toaster.create({
            title: 'Error Uploading File',
            description: 'Failed to upload file. Please try again.',
            type:'error',
            duration: 5000,
          });
        }
      }

      setName('');
      setMetadata({});
      deleteAllKVPairs();
      setSelectedFiles([]);
    } catch (error) {
      console.error('Error during upload:', error);
      toaster.create({
        title: 'Error Uploading File',
        description: 'Failed to upload file. Please try again.',
        type:'error',
        duration: 5000,
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <VStack 
      gap={10}        
      maxH="90vh" 
      p="50px"
      overflowY="auto"
>
    {/* <Heading size="lg" mb={6} textAlign="center">
      Uploads Manager
    </Heading> */}
      <form onSubmit={handleSubmit}>
        <VStack alignItems="center" >
        <Heading size="md">Name this Upload:</Heading>
          <Field  width="200px">
            <Input
              variant="subtle"
              colorPalette="teal"
              _dark={{bg: "rgb(71, 39, 72)"}}
              size="xs"
              type="text"
              maxLength={50}
              value={name}
              onChange={(e) => setName(e.target.value)}
              mb="10px"
            />
          </Field>
        </VStack>

        <VStack>
          <Heading size="md">Additional Data:</Heading>
          {metadataKVPairs.map((pair, index) => (
            <Box key={index} >
              <Input
                type="text"
                placeholder="Key"
                value={pair.key}
                onChange={(e) =>
                  handleKeyValuePairChange(index, 'key', e.target.value)
                }
                mb="10px"
              />
              <Input
                type="text"
                placeholder="Value"
                value={pair.value}
                onChange={(e) =>
                  handleKeyValuePairChange(index, 'value', e.target.value)
                }
                mb="10px"
              />
              <VStack>
              <Button size ="xs" logout onClick={() => deleteKeyValuePair(index)}>
                Delete
              </Button>
              </VStack>
            </Box>
          ))}
          <Flex justifyContent="space-between" mb="10px">
            <Button mr="10px" main size="xs" onClick={addKeyValuePair} type="button" px="17px">
              Add Key-Value Pair
            </Button>
            <Button main size="xs" onClick={deleteAllKVPairs} type="button">
              Delete All Key-Values
            </Button>
          </Flex>
        </VStack>

        <FileUploader handleFiles={handleFiles} />
        <VStack mb="30px">
        <Button
          loading={uploading}
          loadingText="Uploading..."
          login
          size="xs"
          type="submit"
          mt="10px"
          
        >
          Submit
        </Button>
        </VStack>
        {selectedFiles.length > 0 && (
          <UploadQueue selectedFiles={selectedFiles} deleteFile={deleteFile} />
        )}
      </form>

      <ViewUploads allFiles={allFiles} setAllFiles={setAllFiles} user={user}/>
    </VStack>
  );
};

export default UploadsPage;
