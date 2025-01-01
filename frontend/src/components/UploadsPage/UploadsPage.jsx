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
  Input
} from '@chakra-ui/react';
import { Field } from '@/components/ui/field';
import { Button } from '@/components/ui/button';

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
          alert('Upload successful');
        } else {
          console.error('Error uploading file:', await res.text());
        }
      }

      setName('');
      setMetadata({});
      deleteAllKVPairs();
      setSelectedFiles([]);
    } catch (error) {
      console.error('Error during upload:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <VStack >
    <Heading size="lg" mb={6} textAlign="center">
      Uploads Manager
    </Heading>
      <form onSubmit={handleSubmit}>
        <Box>
          <Field label="Name this Upload" width="200px">
            <Input
              size="xs"
              type="text"
              maxLength={50}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Field>
        </Box>

        <Box >
          <h2>Additional Data</h2>
          {metadataKVPairs.map((pair, index) => (
            <Box key={index}>
              <Input
                type="text"
                placeholder="Key"
                value={pair.key}
                onChange={(e) =>
                  handleKeyValuePairChange(index, 'key', e.target.value)
                }
              />
              <Input
                type="text"
                placeholder="Value"
                value={pair.value}
                onChange={(e) =>
                  handleKeyValuePairChange(index, 'value', e.target.value)
                }
              />
              <Button main onClick={() => deleteKeyValuePair(index)}>
                Delete
              </Button>
            </Box>
          ))}
          <Button main size="xs" onClick={addKeyValuePair} type="button">
            Add Key-Value Pair
          </Button>
          <Button main size="xs" onClick={deleteAllKVPairs} type="button">
            Delete All Key-Values
          </Button>
        </Box>

        <FileUploader handleFiles={handleFiles} />
        <Button
          loading={uploading}
          loadingText="Uploading..."
          main
          size="xs"
          type="submit"
        >
          Submit
        </Button>

        {selectedFiles.length > 0 && (
          <UploadQueue selectedFiles={selectedFiles} deleteFile={deleteFile} />
        )}
      </form>

      <ViewUploads allFiles={allFiles} user={user}/>
    </VStack>
  );
};

export default UploadsPage;
