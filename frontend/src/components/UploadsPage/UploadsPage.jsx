import { pinata } from '../../utils/config'
import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import ViewUploads from './ViewUploads'
import UploadQueue from './UploadQueue'
import FileUploader from './FileUploader'
import { Box, Button, Input } from '@chakra-ui/react'
import { Field } from "@/components/ui/field"



const UploadsPage = () => {
  const user = useSelector((state) => state.session.user)
  const [name, setName] = useState('')
  const [metadata, setMetadata] = useState({})
  const [selectedFiles, setSelectedFiles] = useState([])
  const [metadataKVPairs, setMetadataKVPairs] = useState([])
  const [allFiles, setAllFiles] = useState([])

  useEffect(() => {
    if (user) {
      const getFiles = async () => {
        try {
          const res = await fetch(`/api/uploads/${user.id}`)
          const data = await res.json()
          console.log(data)
          setAllFiles(data)
        } catch (error) {
          alert('Uh Oh! Something went wrong with getting your files!')
          console.log(error)
          setAllFiles([])
        }
      }
      getFiles()
    }
  }, [])

  // Function to handle adding files to the selectedFiles state
  // Will use useCallback to memoize the function
  const handleFiles = useCallback((acceptedFiles) => {
    // const files = Array.from(e.target.files)
    setSelectedFiles((prevFiles) => [...prevFiles, ...acceptedFiles])
  }, [])

  // Function to delete file
  const deleteFile = (index) => {
    const newSelectedFiles = selectedFiles.filter((_, i) => i !== index)
    setSelectedFiles(newSelectedFiles)
  }

  // Function to update any metadata key-value pair input field
  const handleKeyValuePairChange = (index, key, value) => {
    const newKVPairs = [...metadataKVPairs]
    newKVPairs[index][key] = value
    setMetadataKVPairs(newKVPairs)

    // Update metadata based on the entire keyValuePairs array
    const newMetadata = metadataKVPairs.reduce((acc, pair) => {
      if (pair.key) acc[pair.key] = pair.value
      return acc
    }, {})
    setMetadata(newMetadata)
  }

  // Add new key-value pair to metadataKVPairs
  const addKeyValuePair = () => {
    setMetadataKVPairs([...metadataKVPairs, { key: '', value: '' }])
  }

  // Remove KV pair
  const deleteKeyValuePair = (index) => {
    const newMetadataKVPairs = metadataKVPairs.filter((pair, i) => i !== index)
    setMetadataKVPairs(newMetadataKVPairs)

    const newMetadata = newMetadataKVPairs.reduce((acc, pair) => {
      if (pair.key) acc[pair.key] = pair.value
      return acc
    }, {})

    setMetadata(newMetadata)
  }

  const deleteAllKVPairs = () => {
    setMetadataKVPairs([])
    setMetadata({})
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!name || selectedFiles.length === 0) return

    try {
      let upload

      // upload based on number of files
      if (selectedFiles.length > 1) {
        upload = await pinata.upload.fileArray(selectedFiles).addMetadata({
          name,
          keyValues: {
            ...metadata,
          },
        })
      } else {
        upload = await pinata.upload.file(selectedFiles[0]).addMetadata({
          name,
          keyValues: {
            ...metadata,
          },
        })
      }

      if (upload.IpfsHash) {
        const res = await fetch('/api/uploads/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            userId: user.id,
            IpfsHash: upload.IpfsHash,
            PinSize: upload.PinSize,
            Timestamp: upload.Timestamp,
            Metadata: metadata || null,
          }),
        })

        if (!res.ok) {
          const error = await res.text()
          throw new Error(error)
        }

        const data = await res.json()

        alert('Upload successful')
        setName('')
        setMetadata({})
        deleteAllKVPairs()
        setSelectedFiles([])
        setAllFiles([...allFiles, data])
      }
    } catch (error) {
      alert('Uh Oh! Something went wrong')
      console.error(error)
    }
  }

  return (
    <Box>
      <h1>Uploads</h1>
      <form onSubmit={handleSubmit}>
        <Box>
          <Field
            label="Name this Upload"
            width="200px"
            
          >
            <Input
              size="xs"
              type="text"
              maxLength={50}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Field>
        </Box>

        {/* Dynamically add Metadata as KV Pairs */}
        <Box>
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
              <Button main onClick={() => deleteKeyValuePair(index)}>Delete</Button>
            </Box>
          ))}

          <Button main size="xs"  onClick={addKeyValuePair} type="button">
            Add Key-Value Pair
          </Button>
          <Button main size="xs"  onClick={deleteAllKVPairs} type="button">
            Delete All Key-Values
          </Button>
        </Box>

        {/* Upload zone */}
        <FileUploader handleFiles={handleFiles} />
        <Button main size="xs" type="submit">Submit</Button>

        {selectedFiles.length > 0 && (
          <UploadQueue selectedFiles={selectedFiles} deleteFile={deleteFile} />
        )}
      </form>

      <ViewUploads allFiles={allFiles} />
    </Box>
  )
}
export default UploadsPage
