import { NavLink } from 'react-router-dom'
import ProfileButton from './ProfileButton'
import './Navigation.css'
import { HStack } from '@chakra-ui/react'
import { ColorModeButton } from "@/components/ui/color-mode"
import WalletDrawer from '../WalletManager/walletDrawer'


function Navigation({user}) {
  return (
    <ul>
      <HStack mt="10px">
      <li>
        <NavLink to="/">Home</NavLink>
      </li>

      <li>
        <ProfileButton />
      </li>

      <li>
        <WalletDrawer user={user}/>
      </li>

      <li>
        <ColorModeButton 
          borderRadius="4xl"
          position="absolute"
          right="15px"
          top="0px"
          />
      </li>
    </HStack>
    </ul>
  )
}

export default Navigation
