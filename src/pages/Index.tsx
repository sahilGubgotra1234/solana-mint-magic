
import { useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import TokenCreator from "@/components/TokenCreator";
import TokenMinter from "@/components/TokenMinter";
import Footer from "@/components/Footer";

const Index = () => {
  // Add Solana wallet detection
  useEffect(() => {
    const checkWalletAvailability = () => {
      if (!(window as any).phantom?.solana && !(window as any).solflare) {
        console.warn("No Solana wallet detected in browser. For the best experience, install Phantom or Solflare extensions.");
      }
    };
    
    // Wait a moment for browser extensions to load
    setTimeout(checkWalletAvailability, 1000);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-purple-50 dark:from-gray-900 dark:to-slate-900">
      <Header />
      
      <main className="flex-1">
        <Hero />
        <Features />
        
        <div className="py-12 px-6 bg-gradient-radial from-white/80 to-transparent dark:from-slate-800/30 dark:to-transparent">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-3">Create & Mint Tokens</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Connect your wallet to start creating and minting tokens
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6 justify-center max-w-4xl mx-auto">
            <TokenCreator />
            <TokenMinter />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
