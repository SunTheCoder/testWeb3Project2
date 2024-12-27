import { pinata } from '../../utils/config'

const ViewUploads = ({ allFiles }) => {
  const unpinFile = async (hash) => {
    try {
      const unpin = await pinata.unpin([hash])
      if (unpin) {
        const res = await fetch(`/api/uploads/${hash}`, {
          method: 'DELETE',
        })
        if (!res.ok) {
          const error = await res.text()
          throw new Error(error)
        }
        const data = await res.json()
        alert(data.message)
      }
    } catch (error) {
      console.log(error)
    }
  }
  return (
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
              <p>
                Total Size:{' '}
                {file.pinSize >= 1048576
                  ? `${(file.pinSize / 1048576).toFixed(2)} MB`
                  : `${(file.pinSize / 1024).toFixed(2)} KB`}
              </p>
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
                <button onClick={() => unpinFile(file.ipfsHash)}>Delete</button>
              </div>
            </div>
          ))}
        </>
      ) : (
        <>No uploads found</>
      )}
    </section>
  )
}
export default ViewUploads
