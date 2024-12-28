import { Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { LiaFileUploadSolid } from "react-icons/lia";

function NavigateToUploadsButton() {
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate('/uploads');
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
