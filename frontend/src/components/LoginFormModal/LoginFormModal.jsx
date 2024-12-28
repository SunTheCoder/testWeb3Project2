import { useState } from 'react'
import { thunkLogin } from '../../redux/session'
import { useDispatch } from 'react-redux'
import { useModal } from '../../context/Modal'
import { Heading, Input, Button, Box, Stack, Text } from '@chakra-ui/react'

function LoginFormModal() {
  const dispatch = useDispatch()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const { closeModal } = useModal()

  const handleSubmit = async (e) => {
    e.preventDefault()

    const serverResponse = await dispatch(
      thunkLogin({
        email,
        password,
      }),
    )

    if (serverResponse) {
      setErrors(serverResponse)
    } else {
      closeModal()
    }
  }

  return (
    <Box p={4} bg="white" rounded="md" shadow="md" maxW="400px" mx="auto" >
      <Heading size="lg" mb={4}>
        Log In
      </Heading>
      <form onSubmit={handleSubmit}>
        <Stack spacing={4}>
          <Box>
            <Text fontSize="sm" fontWeight="medium" mb={1}>
              Email
            </Text>
            <Input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
            {errors.email && (
              <Text color="red.500" fontSize="sm" mt={1}>
                {errors.email}
              </Text>
            )}
          </Box>
          <Box>
            <Text fontSize="sm" fontWeight="medium" mb={1}>
              Password
            </Text>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
            {errors.password && (
              <Text color="red.500" fontSize="sm" mt={1}>
                {errors.password}
              </Text>
            )}
          </Box>
          <Button main type="submit" colorScheme="blue" w="full">
            Log In
          </Button>
        </Stack>
      </form>
    </Box>
  )
}

export default LoginFormModal
