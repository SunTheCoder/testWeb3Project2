import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { thunkSignup } from '../../redux/session';
import { Heading, Input, Button, Box, Stack, VStack } from '@chakra-ui/react';
import { InputGroup } from "@/components/ui/input-group";
import { Field } from '@/components/ui/field';
import { toaster } from '@/components/ui/toaster';
import { PasswordInput, PasswordStrengthMeter } from '@/components/ui/password-input';
import { LuUser } from "react-icons/lu";
import { MdOutlineEmail } from "react-icons/md";
import { TbLockPassword } from "react-icons/tb";

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors({}); // Reset errors

    const newErrors = {};
    if (!email) newErrors.email = 'Email is required.';
    if (!username) newErrors.username = 'Username is required.';
    if (!password) newErrors.password = 'Password is required.';
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toaster.create({
        title: 'Validation Error',
        description: 'Please fix the errors before submitting.',
      });
      return;
    }

    try {
      const serverResponse = await dispatch(
        thunkSignup({ email, username, password })
      );

      if (serverResponse) {
        setErrors(serverResponse);
        toaster.create({
          title: 'Signup Failed',
          description: serverResponse.general || 'Signup failed. Please try again.',
        });
      } else {
        closeModal();
        toaster.create({
          title: 'Signup Successful',
          description: 'You have successfully signed up!',
        });
      }
    } catch (err) {
      toaster.create({
        title: 'Unexpected Error',
        description: 'An unexpected error occurred. Please try again later.',
      });
      console.error('Signup error:', err);
    }
  };

  const calculatePasswordStrength = (password) => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength; // A number between 0 and 4
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
          <Box>
            <Field
              invalid={Boolean(errors.username)}
              label="Username"
              errorText={errors.username || 'This field is required'}
              required
            >
              <InputGroup flex="1" startElement={<LuUser />}>
                <Input
                  variant="subtle"
                  w="224px"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  isInvalid={Boolean(errors.username)}
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
                <PasswordInput
                  variant="subtle"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  isInvalid={Boolean(errors.password)}
                />
              </Field>
              <PasswordStrengthMeter value={calculatePasswordStrength(password)} />
            </Stack>
          </Box>
          <Box>
            <Field
              invalid={Boolean(errors.confirmPassword)}
              label="Confirm Password"
              errorText={errors.confirmPassword || 'This field is required'}
              required
            >
              <InputGroup flex="1" startElement={<TbLockPassword />}>
                <PasswordInput
                  variant="subtle"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm Password"
                  isInvalid={Boolean(errors.confirmPassword)}
                />
              </InputGroup>
            </Field>
          </Box>
          <VStack>
            <Button main color="gold" fontWeight="bold" mt="10px" type="submit" w="fit" size="xs">
              Sign Up
            </Button>
          </VStack>
        </Stack>
      </form>
    </Box>
  );
}

export default SignupFormModal;
