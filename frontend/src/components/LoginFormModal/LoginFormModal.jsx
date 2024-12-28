import { useState } from 'react';
import { thunkLogin } from '../../redux/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { Heading, Input, Button, Box, Stack, Text, VStack } from '@chakra-ui/react';
import { InputGroup } from "@/components/ui/input-group"
import { Field } from '@/components/ui/field';
import { toaster } from '@/components/ui/toaster';
import {
  PasswordInput,
} from '@/components/ui/password-input';
import { LuUser } from "react-icons/lu"
import { MdOutlineEmail } from "react-icons/md";
import { TbLockPassword } from "react-icons/tb";




function LoginFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset errors
    setErrors({});

    // Validate fields before dispatch
    const newErrors = {};
    if (!email) newErrors.email = 'Email is required.';
    if (!password) newErrors.password = 'Password is required.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toaster.create({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
      });
      return;
    }

    try {
      const serverResponse = await dispatch(
        thunkLogin({
          email,
          password,
        })
      );

      if (serverResponse) {
        // Handle server errors
        setErrors(serverResponse);
        toaster.create({
          title: 'Login Failed',
          description: serverResponse.general || 'Logging in failed. Please try again.',
        });
      } else {
        // Successful login
        closeModal();
        toaster.create({
          title: 'Login Successful',
          description: 'You have logged in successfully.',
        });
      }
    } catch (err) {
      // Fallback for unexpected errors
      toaster.create({
        title: 'Unexpected Error',
        description: 'An unexpected error occurred. Please try again later.',
      });
      console.error('Login error:', err);
    }
  };

 
  return (
    <Box 
      p={4} 
      bg="white" 
      rounded="md" 
      shadow="md" 
      maxW="400px" 
      mx="auto" 
      _dark={{bg:"rgb(71, 39, 72)"}}
    >
      
      <form onSubmit={handleSubmit}>
        <Stack spacing={4}>
          <Box>
            <Field
              invalid={Boolean(errors.email)}
              outlineColor="gold"
              label="Email"
              errorText={errors.email || 'This field is required'}
              required
            >
            <InputGroup flex="1" startElement={<MdOutlineEmail />}>

              <Input
                variant="subtle"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                isInvalid={Boolean(errors.email)}
                w="224px"
              />

            </InputGroup>

            </Field>
          </Box>
          <Box maxW="300px">
            <Stack>
              <Field
                invalid={Boolean(errors.password)}
                label="Password"
                errorText={errors.password || 'This field is required'}
                required
              >
              <InputGroup flex="1" startElement={<TbLockPassword />}>
                <PasswordInput
                  variant="subtle"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  isInvalid={Boolean(errors.password)}
                />
              </InputGroup>
              </Field>
            </Stack>
          </Box>
          <VStack>
            <Button main color="gold" fontWeight="bold" mt="10px" type="submit" w="fit" size="xs">
              Log In
            </Button>
          </VStack>
        </Stack>
      </form>
    </Box>
  );
}

export default LoginFormModal;
