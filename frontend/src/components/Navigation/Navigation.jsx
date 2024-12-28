import { NavLink } from 'react-router-dom'
import ProfileButton from './ProfileButton'
import './Navigation.css'
import { Button, HStack } from '@chakra-ui/react'
import { ColorModeButton } from "@/components/ui/color-mode"
import WalletDrawer from '../WalletManager/walletDrawer'
import { TiHomeOutline } from "react-icons/ti";
import NavigateToUploadsButton from '../UploadsPage/NavigateToUploads'


function Navigation({user}) {
  return (
    <ul>
      <HStack mt="10px" mx="25px" _hover={{}}>
      <li>
        <NavLink to="/"><Button variant="ghost" m={1}
                p={1} size="sm" borderRadius="4xl">
                <TiHomeOutline />
                </Button></NavLink>
      </li>

      <li>
        <ProfileButton />
      </li>

      <li>
        <WalletDrawer user={user}/>
      </li>

      <li>
        <NavigateToUploadsButton/>
      </li>

      <li>
        <ColorModeButton 
          borderRadius="4xl"
          position="absolute"
          right="15px"
          top="15px"
          />
      </li>
    </HStack>
    </ul>
  )
}

export default Navigation
