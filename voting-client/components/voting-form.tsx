"use client"

import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useWeb3 } from "@/providers/web3-provider"
import { VOTING_CONTRACT_ADDRESS, VOTING_CONTRACT_ABI } from "@/lib/contract-config"

interface Candidate {
  name: string
  voteCount: number
}

export function VotingForm() {
  const { signer, address } = useWeb3()
  const { toast } = useToast()
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [selectedCandidate, setSelectedCandidate] = useState<string>("")
  const [isVoting, setIsVoting] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)
  const [votingActive, setVotingActive] = useState(false)

  useEffect(() => {
    const checkVotingStatus = async () => {
      if (!signer || !address) return

      try {
        const contract = new ethers.Contract(VOTING_CONTRACT_ADDRESS, VOTING_CONTRACT_ABI, signer)

        const [isActive, isVoterRegistered] = await Promise.all([
          contract.isVotingActive(),
          contract.registeredVoters(address),
        ])

        setVotingActive(isActive)
        setIsRegistered(isVoterRegistered)
      } catch (error) {
        console.error("Error checking voting status:", error)
      }
    }

    const fetchCandidates = async () => {
      if (!signer) return

      try {
        const contract = new ethers.Contract(VOTING_CONTRACT_ADDRESS, VOTING_CONTRACT_ABI, signer)

        const candidatesList = await contract.getAllCandidates()
        setCandidates(candidatesList)
      } catch (error) {
        console.error("Error fetching candidates:", error)
      }
    }

    checkVotingStatus()
    fetchCandidates()
  }, [signer, address])

  const handleVote = async () => {
    if (!signer || !selectedCandidate) return

    setIsVoting(true)
    try {
      const contract = new ethers.Contract(VOTING_CONTRACT_ADDRESS, VOTING_CONTRACT_ABI, signer)

      // Generate a random CID for this example
      // In a real app, you would upload vote data to IPFS and get the CID
      const mockCid = `vote-${Date.now()}`

      const tx = await contract.vote(selectedCandidate, mockCid)
      await tx.wait()

      toast({
        title: "Vote submitted!",
        description: "Your vote has been recorded on the blockchain.",
      })
      setSelectedCandidate("")
    } catch (error) {
      console.error("Error voting:", error)
      toast({
        title: "Error",
        description: "There was an error submitting your vote.",
        variant: "destructive",
      })
    } finally {
      setIsVoting(false)
    }
  }

  if (!votingActive) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Voting</CardTitle>
          <CardDescription>Voting is currently not active</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (!isRegistered) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Not Registered</CardTitle>
          <CardDescription>You are not registered to vote</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Cast Your Vote</CardTitle>
        <CardDescription>Select a candidate and submit your vote</CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup value={selectedCandidate} onValueChange={setSelectedCandidate} className="space-y-4">
          {candidates.map((candidate, index) => (
            <div key={index} className="flex items-center space-x-2">
              <RadioGroupItem value={index.toString()} id={`candidate-${index}`} />
              <Label htmlFor={`candidate-${index}`}>{candidate.name}</Label>
            </div>
          ))}
        </RadioGroup>
        <Button className="w-full mt-6" onClick={handleVote} disabled={!selectedCandidate || isVoting || !signer}>
          {isVoting ? "Submitting..." : "Submit Vote"}
        </Button>
      </CardContent>
    </Card>
  )
}

