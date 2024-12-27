import { pinata } from '../../utils/config'
import { useCallback, useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const gateway = import.meta.env.VITE_GATEWAY_URL

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
  const handleFiles = useCallback((e) => {
    const files = Array.from(e.target.files)
    setSelectedFiles((prevFiles) => [...prevFiles, ...files])
    e.target.value = null
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
    <div>
      <h1>Uploads</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name this Upload</label>
          <input
            type="text"
            maxLength={50}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <h2>Additional Data</h2>
          {metadataKVPairs.map((pair, index) => (
            <div key={index}>
              <input
                type="text"
                placeholder="Key"
                value={pair.key}
                onChange={(e) =>
                  handleKeyValuePairChange(index, 'key', e.target.value)
                }
              />

              <input
                type="text"
                placeholder="Value"
                value={pair.value}
                onChange={(e) =>
                  handleKeyValuePairChange(index, 'value', e.target.value)
                }
              />
              <button onClick={() => deleteKeyValuePair(index)}>Delete</button>
            </div>
          ))}

          <button onClick={addKeyValuePair} type="button">
            Add Key-Value Pair
          </button>
          <button onClick={deleteAllKVPairs} type="button">
            Delete All Key-Values
          </button>
        </div>

        {/* Upload zone */}
        <div>
          <h2>Uploads</h2>
          <div>
            <label>Upload File(s)</label>
            <input type="file" multiple onChange={handleFiles} />
          </div>

          <button type="submit">Submit</button>
        </div>

        {selectedFiles.length > 0 && (
          <>
            <h3>Files to waiting to upload</h3>
            <ul>
              {selectedFiles.map((file, index) => (
                <li key={index}>
                  <span>{file.name}</span>
                  <span style={{ fontWeight: 'bold' }}>
                    {file.size / 1024} Kb
                  </span>
                  <button onClick={() => deleteFile(index)}>X</button>
                </li>
              ))}
            </ul>
          </>
        )}
      </form>

      <section>
        <h2>My Uploads</h2>
        {allFiles?.length > 0 ? (
          <>
            {allFiles.map((file) => (
              <div key={file.id}>
                <div>
                  <h3>
                    {' '}
                    {file.mimeType === 'directory' && (
                      <span>Directory:</span>
                    )}{' '}
                    {file.name}
                  </h3>
                </div>
                <p>IpfsHash: {file.ipfsHash}</p>
                <p>Total Size: {(file.pinSize / 1024 / 1024).toFixed(2)}Mb</p>
                {file.mimeType === 'directory' && (
                  <span>
                    Total number of files in this upload: {file.numberOfFiles}
                  </span>
                )}
                {/* Delete Section */}
                <div>
                  <a href={file.gatewayUrl} target="_blank" rel="noreferrer">
                    View Upload{file.numberOfFiles > 1 ? 's' : ''}
                  </a>
                </div>
              </div>
            ))}
          </>
        ) : (
          <>No uploads found</>
        )}
      </section>
    </div>
  )
}
export default UploadsPage
