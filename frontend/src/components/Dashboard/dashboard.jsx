import React from 'react'
import UserWalletBalance from '../UserWalletBalance/userWalletBalance'

const Dashboard = ({ user }) => {
  const formattedUsername = user?.username.slice(0,1).toUpperCase() + user?.username.slice(1).toLowerCase()
  return (
    <div>
      <h1>Welcome, {formattedUsername || 'Guest'}!</h1>
      {user && <UserWalletBalance user={user} />}
    </div>
  )
}

export default Dashboard
