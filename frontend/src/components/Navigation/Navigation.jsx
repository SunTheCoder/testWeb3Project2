import { NavLink } from 'react-router-dom'
import ProfileButton from './ProfileButton'
import './Navigation.css'
import { HStack } from '@chakra-ui/react'

function Navigation() {
  return (
    <ul>
      <HStack mt="10px">
      <li>
        <NavLink to="/">Home</NavLink>
      </li>

      <li>
        <ProfileButton />
      </li>
    </HStack>
    </ul>
  )
}

export default Navigation
