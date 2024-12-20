import React, { useState } from 'react'
import { useSDK } from '@metamask/sdk-react'
import { ethers } from 'ethers'

export const WalletManagerDocs = () => {
  const [account, setAccount] = useState(null)
  const [balance, setBalance] = useState(null)
  const { sdk, connected, connecting, provider, chainId } = useSDK()

  const connect = async () => {
    try {
      console.log('Attempting to connect with MetaMask SDK...')
      const accounts = await sdk?.connect()

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts returned.')
      }

      const walletAddress = accounts[0]
      console.log('Connected wallet address:', walletAddress)
      setAccount(walletAddress)

      // Fetch the balance after connecting
      fetchBalance(walletAddress)
    } catch (err) {
      console.warn('Failed to connect:', err)
    }
  }

  const fetchBalance = async (walletAddress) => {
    try {
      console.log("Using SDK's provider:", provider)

      if (!provider) {
        throw new Error('Provider is undefined.')
      }

      // Use ethers.js with the SDK's provider
      const ethProvider = new ethers.providers.Web3Provider(provider)
      const balanceWei = await ethProvider.getBalance(walletAddress)
      const balanceEth = ethers.utils.formatEther(balanceWei) // Convert to Ether
      console.log('Formatted balance in ETH:', balanceEth)
      setBalance(balanceEth)
    } catch (err) {
      console.error('Failed to fetch balance:', err)
    }
  }

  return (
    <div className="App" style={{ padding: '20px' }}>
      <button
        onClick={connect}
        disabled={connecting}
        style={{ padding: '10px', margin: '10px' }}
      >
        {connecting ? 'Connecting...' : 'Connect'}
      </button>
      {connected && (
        <div>
          <p>Connected chain: {chainId}</p>
          <p>Connected account: {account}</p>
          <p>Balance: {balance !== null ? `${balance} ETH` : 'Loading...'}</p>
        </div>
      )}
    </div>
  )
}

export default WalletManagerDocs
