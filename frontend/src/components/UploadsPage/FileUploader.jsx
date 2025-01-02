import { useDropzone } from 'react-dropzone'
import { Field } from '../ui/field'
import { Box, Heading, Input, VStack } from '@chakra-ui/react'

const FileUploader = ({ handleFiles }) => {
  const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
    useDropzone({ onDrop: handleFiles })

  return (
    <Box>
      <VStack>
      <Heading size="md">Add File(s) to Upload</Heading>
      <Box {...getRootProps()}>
        <Input {...getInputProps()} />
        {isDragActive ? (
  <Box
    p={6}
    border="2px dashed"
    borderColor="gold"
    borderRadius="md"
    bg="purple.200"
    _dark={{bg: "rgb(71, 39, 72)"}}
    textAlign="center"
    color="gray.700"
    w="400px"
    shadow="md"
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
    bg="purple.200"
    _dark={{bg: "rgb(71, 39, 72)"}}

    textAlign="center"
    color="gray.600"
    w="400px"
    shadow="md"
    _hover={{ bg: "gray.100", cursor: "pointer" }}
  >
    Drag 'n' drop a file here, or click to select files
  </Box>
)}

      </Box>
      </VStack>
    </Box>
  )
}
export default FileUploader
