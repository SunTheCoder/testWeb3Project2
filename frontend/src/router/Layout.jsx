import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { ModalProvider, Modal } from '../context/Modal'
import { thunkAuthenticate } from '../redux/session'
import Navigation from '../components/Navigation/Navigation'
import WalletDrawer from '@/components/WalletManager/walletDrawer'
import { Box } from '@chakra-ui/react'



export default function Layout() {
  const dispatch = useDispatch()
  const [isLoaded, setIsLoaded] = useState(false)

  // Retrieve the current user from Redux
  const user = useSelector((state) => state.session.user)
  

  useEffect(() => {
    dispatch(thunkAuthenticate()).then(() => setIsLoaded(true))
  }, [dispatch])

  return (
    <Box
                        bg= "radial-gradient(circle, rgba(212, 192, 139, 0.8), rgba(142, 68, 173, 0.8))" h= "100vh" p="1px"
                         >
      <ModalProvider>
        <Navigation user={user}/>
        {isLoaded && (
          <main>
            
            {/* <WalletDrawer user={user}/> */}
            <Outlet />
          </main>
        )}
        <Modal />
      </ModalProvider>
    </Box>
  )
}
