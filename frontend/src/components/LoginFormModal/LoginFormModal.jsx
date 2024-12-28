import { useState } from 'react'
import { thunkLogin } from '../../redux/session'
import { useDispatch } from 'react-redux'
import { useModal } from '../../context/Modal'
import { Heading, Input, Button, Box, Stack, Text, VStack} from '@chakra-ui/react'
import { Field } from "@/components/ui/field"
import { toaster } from "@/components/ui/toaster"

import {
  PasswordInput,
  PasswordStrengthMeter,
} from "@/components/ui/password-input"


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
      toaster.create({
        title: "Error",
        description: "Logging in failed. Please try again.",  
      })
    } else {
      closeModal()
      toaster.create({
        title: "Toast Title",
        description: "Toast Description",
      })
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
           
            <Field invalid label="Email" errorText="This field is required">
              <Input
                variant="subtle"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
              />
            </Field>
            {errors.email && (
              <Text color="red.500" fontSize="sm" mt={1}>
                {errors.email}
              </Text>
            )}
          </Box>
          <Box maxW="300px">
            <Stack >
              <Field invalid label="Password" errorText="This field is required">
                <PasswordInput
                  variant="subtle"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                />
                
              </Field>
            </Stack>
            {errors.password && (
              <Text color="red.500" fontSize="sm" mt={1}>
                {errors.password}
              </Text>
            )}
          </Box>
          <VStack>
          <Button main type="submit" w="fit" >
            Log In
          </Button>
          </VStack>
        </Stack>
      </form>
    </Box>
  )
}

export default LoginFormModal
