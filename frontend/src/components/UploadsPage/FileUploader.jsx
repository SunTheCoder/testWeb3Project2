import { useDropzone } from 'react-dropzone'
import { Field } from '../ui/field'
import { Box } from '@chakra-ui/react'

const FileUploader = ({ handleFiles }) => {
  const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
    useDropzone({ onDrop: handleFiles })

  return (
    <div>
      <h2>Add File(s) to Upload</h2>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive ? (
  <Box
    p={6}
    border="2px dashed"
    borderColor="gold"
    borderRadius="md"
    bg="purple.200"
    textAlign="center"
    color="gray.700"
    w="400px"
    _hover={{ bg: "purple.300", cursor: "pointer" }}
  >
    Drop the files here...
  </Box>
) : (
  <Box
    p={6}
    border="2px dashed"
    borderColor="gold"
    borderRadius="md"
    bg="purple.100"
    textAlign="center"
    color="gray.600"
    w="400px"

    _hover={{ bg: "gray.100", cursor: "pointer" }}
  >
    Drag 'n' drop a file here, or click to select files
  </Box>
)}

      </div>
    </div>
  )
}
export default FileUploader
