import { Web3Provider } from "@/providers/web3-provider"
import { ConnectWallet } from "@/providers/web3-provider"
import { AdminPanel } from "@/components/admin-panel"
import { VotingForm } from "@/components/voting-form"
import { ResultsDisplay } from "@/components/results-display"
import { Toaster } from "@/components/ui/toaster"

export default function Home() {
  return (
    <Web3Provider>
      <div className="min-h-screen bg-background">
        <header className="border-b">
          <div className="container flex items-center justify-between h-16">
            <h1 className="text-xl font-bold">Decentralized Voting</h1>
            <ConnectWallet />
          </div>
        </header>
        <main className="container py-8">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-8">
              <AdminPanel />
              <VotingForm />
            </div>
            <ResultsDisplay />
          </div>
        </main>
      </div>
      <Toaster />
    </Web3Provider>
  )
}

