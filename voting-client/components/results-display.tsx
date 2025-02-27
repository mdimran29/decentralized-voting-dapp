"use client"

import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { VOTING_CONTRACT_ADDRESS, VOTING_CONTRACT_ABI } from "@/lib/contract-config"

interface Candidate {
  name: string
  voteCount: number
}

export function ResultsDisplay() {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [totalVotes, setTotalVotes] = useState(0)
  const [winner, setWinner] = useState<number | null>(null)
  const [votingActive, setVotingActive] = useState(true)

  useEffect(() => {
    const fetchResults = async () => {
      if (typeof window.ethereum === "undefined") return

      try {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const contract = new ethers.Contract(VOTING_CONTRACT_ADDRESS, VOTING_CONTRACT_ABI, provider)

        const [candidatesList, isActive] = await Promise.all([contract.getAllCandidates(), contract.isVotingActive()])

        setVotingActive(isActive)
        setCandidates(candidatesList)

        const total = candidatesList.reduce((sum: number, curr: Candidate) => sum + Number(curr.voteCount), 0)
        setTotalVotes(total)

        if (!isActive) {
          try {
            const winnerId = await contract.getWinner()
            setWinner(Number(winnerId))
          } catch (error) {
            console.error("Error getting winner:", error)
          }
        }
      } catch (error) {
        console.error("Error fetching results:", error)
      }
    }

    fetchResults()

    // Set up event listener for vote updates
    const provider = new ethers.BrowserProvider(window.ethereum)
    const contract = new ethers.Contract(VOTING_CONTRACT_ADDRESS, VOTING_CONTRACT_ABI, provider)

    const voteFilter = contract.filters.VoteCast()
    contract.on(voteFilter, () => {
      fetchResults()
    })

    return () => {
      contract.removeAllListeners(voteFilter)
    }
  }, [])

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{votingActive ? "Current Results" : "Final Results"}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {candidates.map((candidate, index) => (
          <div key={index} className={`space-y-2 ${winner === index ? "bg-primary/10 p-2 rounded-lg" : ""}`}>
            <div className="flex justify-between text-sm">
              <span>{candidate.name}</span>
              <span>{totalVotes > 0 ? Math.round((Number(candidate.voteCount) / totalVotes) * 100) : 0}%</span>
            </div>
            <Progress value={totalVotes > 0 ? (Number(candidate.voteCount) / totalVotes) * 100 : 0} />
            <div className="text-xs text-muted-foreground">{candidate.voteCount.toString()} votes</div>
          </div>
        ))}
        <div className="text-sm text-muted-foreground mt-4">Total votes: {totalVotes}</div>
      </CardContent>
    </Card>
  )
}

