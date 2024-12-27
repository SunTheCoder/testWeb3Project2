const UploadQueue = ({ selectedFiles, deleteFile }) => {
  return (
    <>
      <h3>Files to waiting to upload</h3>
      <ul>
        {selectedFiles.map((file, index) => (
          <li key={index}>
            <span>{file.name}</span>
            <span style={{ fontWeight: 'bold' }}>{file.size / 1024} Kb</span>
            <button onClick={() => deleteFile(index)}>X</button>
          </li>
        ))}
      </ul>
    </>
  )
}
export default UploadQueue
