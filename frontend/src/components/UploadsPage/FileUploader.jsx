import { useDropzone } from 'react-dropzone'

const FileUploader = ({ handleFiles }) => {
  const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
    useDropzone({ onDrop: handleFiles })

  return (
    <div>
      <h2>Add File(s) to Upload</h2>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag 'n' drop some files here, or click to select files</p>
        )}
      </div>
    </div>
  )
}
export default FileUploader
