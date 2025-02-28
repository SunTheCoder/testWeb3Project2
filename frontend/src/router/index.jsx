import { createBrowserRouter } from 'react-router-dom'
import LoginFormPage from '../components/LoginFormPage'
import SignupFormPage from '../components/SignupFormPage'
import Layout from './Layout'
import UploadsPage from '../components/UploadsPage/UploadsPage'
import HomePage from '@/components/HomePage/HomePage'

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <HomePage/>
      },
      {
        path: 'login',
        element: <LoginFormPage />,
      },
      {
        path: 'signup',
        element: <SignupFormPage />,
      },
      {
        path: 'uploads',
        element: <UploadsPage />,
      },
    ],
  },
])
