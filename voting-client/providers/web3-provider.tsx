"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { ethers } from "ethers"
import { Button } from "@/components/ui/button"

interface Web3ContextType {
  address: string | null
  signer: ethers.Signer | null
  connect: () => Promise<void>
}

const Web3Context = createContext<Web3ContextType>({
  address: null,
  signer: null,
  connect: async () => {},
})

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null)
  const [signer, setSigner] = useState<ethers.Signer | null>(null)

  const connect = useCallback(async () => {
    if (typeof window.ethereum === "undefined") {
      alert("Please install MetaMask to use this app")
      return
    }

    try {
      await window.ethereum.request({ method: "eth_requestAccounts" })
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const address = await signer.getAddress()

      setSigner(signer)
      setAddress(address)
    } catch (error) {
      console.error("Error connecting wallet:", error)
    }
  }, [])

  useEffect(() => {
    // Check if already connected
    if (window.ethereum) {
      window.ethereum.request({ method: "eth_accounts" }).then((accounts: string[]) => {
        if (accounts.length > 0) {
          connect()
        }
      })
    }
  }, [connect])

  return <Web3Context.Provider value={{ address, signer, connect }}>{children}</Web3Context.Provider>
}

export function useWeb3() {
  return useContext(Web3Context)
}

export function ConnectWallet() {
  const { address, connect } = useWeb3()

  if (address) {
    return (
      <div className="text-sm text-muted-foreground">
        Connected: {address.slice(0, 6)}...{address.slice(-4)}
      </div>
    )
  }

  return (
    <Button onClick={connect} variant="outline">
      Connect Wallet
    </Button>
  )
}

