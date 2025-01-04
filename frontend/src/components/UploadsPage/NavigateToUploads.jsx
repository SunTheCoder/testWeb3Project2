import { Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { LiaFileUploadSolid } from "react-icons/lia";
import { useSelector } from 'react-redux';
import { Toaster, toaster } from '../ui/toaster';

function NavigateToUploadsButton() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.session?.user); // Replace with actual state path

  const handleNavigation = () => {
    if (user) {
      navigate('/uploads');
    } else {
      toaster.create({
        title: 'Login Required',
        description: 'You must be logged in to access the upload manager.',
        type: 'error',
        duration: 5000,
      })
    }
  };

  return (
    <Button
      onClick={handleNavigation}
      main
      color="gold"
      _hover={{ bgGradient: "linear(to-r, orange.300, gold)" }}
      size="xs"
      fontWeight="bold"
      
    >
    <LiaFileUploadSolid/> Upload Manager
    </Button>
  );
}

export default NavigateToUploadsButton;
