import React, { useState } from 'react'
import { AlchemyProvider, ethers } from 'ethers'
import axios from 'axios'

const WalletManager = () => {
  const [walletAddress, setWalletAddress] = useState(null)
  const [balance, setBalance] = useState(null)
  const [status, setStatus] = useState('')

  // Connect to MetaMask and retrieve wallet address
  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        setStatus(
          'MetaMask is not installed. Please install it to use this app.',
        )
        return
      }

      // Request wallet connection
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })
      const address = accounts[0]
      setWalletAddress(address)
      setStatus('Wallet connected!')

      // Save wallet address to backend
      await saveWalletAddress(address)

      // Fetch balance after wallet is connected
      fetchBalance(address)
    } catch (error) {
      console.error('Error connecting wallet:', error)
      setStatus('Failed to connect wallet. Please try again.')
    }
  }

  // Save wallet address to backend
  const saveWalletAddress = async (address) => {
    try {
      setStatus('Saving wallet address...')
      console
      await axios.post('/connect', { walletAddress: address })
      setStatus('Wallet address saved to backend!')
    } catch (error) {
      console.error(
        'Error saving wallet address:',
        error.response || error.message,
      )
      setStatus('Failed to save wallet address.')
    }
  }

  // Fetch wallet balance
  const fetchBalance = async (address) => {
    try {
      setStatus('Fetching balance...')

      // Use Flask backend to fetch balance
      const response = await axios.get(`/balance?walletAddress=${address}`)
      setBalance(response.data.balance)
      setStatus('')
    } catch (error) {
      console.error('Error fetching balance:', error.response || error.message)
      setStatus('Failed to fetch balance.')
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Wallet Manager</h1>
      {!walletAddress ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <div>
          <p>Wallet Address: {walletAddress}</p>
          <p>Balance: {balance !== null ? `${balance} ETH` : 'Loading...'}</p>
        </div>
      )}
      {status && <p>{status}</p>}
    </div>
  )
}

export default WalletManager
