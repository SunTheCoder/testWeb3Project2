const ViewUploads = ({ allFiles }) => {
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
  )
}
export default ViewUploads
