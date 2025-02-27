"use client"

import { useState } from "react"
import { ethers } from "ethers"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useWeb3 } from "@/providers/web3-provider"
import { VOTING_CONTRACT_ADDRESS, VOTING_CONTRACT_ABI } from "@/lib/contract-config"

export function AdminPanel() {
  const { signer, address } = useWeb3()
  const { toast } = useToast()
  const [candidateName, setCandidateName] = useState("")
  const [voterAddress, setVoterAddress] = useState("")
  const [duration, setDuration] = useState("")
  const [isOwner, setIsOwner] = useState(false)

  // Check if current user is owner
  const checkOwner = async () => {
    if (!signer) return

    const contract = new ethers.Contract(VOTING_CONTRACT_ADDRESS, VOTING_CONTRACT_ABI, signer)

    try {
      const owner = await contract.owner()
      setIsOwner(owner.toLowerCase() === address?.toLowerCase())
    } catch (error) {
      console.error("Error checking owner:", error)
    }
  }

  // Add candidate
  const handleAddCandidate = async () => {
    if (!signer || !candidateName) return

    try {
      const contract = new ethers.Contract(VOTING_CONTRACT_ADDRESS, VOTING_CONTRACT_ABI, signer)

      const tx = await contract.addCandidate(candidateName)
      await tx.wait()

      toast({
        title: "Success",
        description: "Candidate added successfully",
      })
      setCandidateName("")
    } catch (error) {
      console.error("Error adding candidate:", error)
      toast({
        title: "Error",
        description: "Failed to add candidate",
        variant: "destructive",
      })
    }
  }

  // Register voter
  const handleRegisterVoter = async () => {
    if (!signer || !voterAddress) return

    try {
      const contract = new ethers.Contract(VOTING_CONTRACT_ADDRESS, VOTING_CONTRACT_ABI, signer)

      const tx = await contract.registerVoter(voterAddress)
      await tx.wait()

      toast({
        title: "Success",
        description: "Voter registered successfully",
      })
      setVoterAddress("")
    } catch (error) {
      console.error("Error registering voter:", error)
      toast({
        title: "Error",
        description: "Failed to register voter",
        variant: "destructive",
      })
    }
  }

  // Start voting
  const handleStartVoting = async () => {
    if (!signer || !duration) return

    try {
      const contract = new ethers.Contract(VOTING_CONTRACT_ADDRESS, VOTING_CONTRACT_ABI, signer)

      const durationInSeconds = Number.parseInt(duration) * 60 * 60 // Convert hours to seconds
      const tx = await contract.startVoting(durationInSeconds)
      await tx.wait()

      toast({
        title: "Success",
        description: "Voting started successfully",
      })
      setDuration("")
    } catch (error) {
      console.error("Error starting voting:", error)
      toast({
        title: "Error",
        description: "Failed to start voting",
        variant: "destructive",
      })
    }
  }

  // End voting
  const handleEndVoting = async () => {
    if (!signer) return

    try {
      const contract = new ethers.Contract(VOTING_CONTRACT_ADDRESS, VOTING_CONTRACT_ABI, signer)

      const tx = await contract.endVoting()
      await tx.wait()

      toast({
        title: "Success",
        description: "Voting ended successfully",
      })
    } catch (error) {
      console.error("Error ending voting:", error)
      toast({
        title: "Error",
        description: "Failed to end voting",
        variant: "destructive",
      })
    }
  }

  if (!isOwner) {
    return null
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Admin Panel</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Input
            placeholder="Enter candidate name"
            value={candidateName}
            onChange={(e) => setCandidateName(e.target.value)}
          />
          <Button onClick={handleAddCandidate} className="w-full">
            Add Candidate
          </Button>
        </div>

        <div className="space-y-2">
          <Input
            placeholder="Enter voter address"
            value={voterAddress}
            onChange={(e) => setVoterAddress(e.target.value)}
          />
          <Button onClick={handleRegisterVoter} className="w-full">
            Register Voter
          </Button>
        </div>

        <div className="space-y-2">
          <Input
            type="number"
            placeholder="Voting duration (hours)"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
          <Button onClick={handleStartVoting} className="w-full">
            Start Voting
          </Button>
        </div>

        <Button onClick={handleEndVoting} variant="destructive" className="w-full">
          End Voting
        </Button>
      </CardContent>
    </Card>
  )
}

