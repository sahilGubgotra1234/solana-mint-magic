
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Coins, Wallet, Zap } from "lucide-react";

const Features = () => {
  return (
    <div id="features" className="py-12 px-6">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-3">Key Features</h2>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Everything you need to create and manage your Solana tokens
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        <Card className="bg-glass">
          <CardHeader>
            <Sparkles className="h-10 w-10 text-solana-purple mb-4 p-2 bg-purple-100 rounded-lg" />
            <CardTitle>Token Creation</CardTitle>
            <CardDescription>
              Create your own SPL tokens with custom name, symbol and decimals
            </CardDescription>
          </CardHeader>
        </Card>
        
        <Card className="bg-glass">
          <CardHeader>
            <Coins className="h-10 w-10 text-solana-blue mb-4 p-2 bg-blue-100 rounded-lg" />
            <CardTitle>Token Minting</CardTitle>
            <CardDescription>
              Mint new tokens to any wallet address in seconds
            </CardDescription>
          </CardHeader>
        </Card>
        
        <Card className="bg-glass">
          <CardHeader>
            <Wallet className="h-10 w-10 text-amber-500 mb-4 p-2 bg-amber-100 rounded-lg" />
            <CardTitle>Wallet Integration</CardTitle>
            <CardDescription>
              Connect with popular Solana wallets like Phantom and Solflare
            </CardDescription>
          </CardHeader>
        </Card>
        
        <Card className="bg-glass">
          <CardHeader>
            <Zap className="h-10 w-10 text-emerald-500 mb-4 p-2 bg-emerald-100 rounded-lg" />
            <CardTitle>Fast & Efficient</CardTitle>
            <CardDescription>
              Leverage Solana's speed and low transaction fees
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};

export default Features;
