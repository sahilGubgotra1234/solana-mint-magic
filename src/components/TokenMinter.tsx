
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/contexts/WalletContext";
import { mintTokens } from "@/services/tokenService";
import { toast } from "sonner";
import { Coins } from "lucide-react";
import { PublicKey } from "@solana/web3.js";

const TokenMinter = () => {
  const { connected, solanaConnection, wallet, publicKey } = useWallet();
  const [loading, setLoading] = useState(false);
  const [mintAddress, setMintAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [tokenDecimals, setTokenDecimals] = useState("9");
  const [txSignature, setTxSignature] = useState<string | null>(null);
  
  const handleMintTokens = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!connected || !solanaConnection || !wallet || !publicKey) {
      toast.error("Please connect your wallet first");
      return;
    }
    
    if (!mintAddress || !amount) {
      toast.error("Please fill all required fields");
      return;
    }
    
    try {
      setLoading(true);
      
      let mintPublicKey: PublicKey;
      try {
        mintPublicKey = new PublicKey(mintAddress);
      } catch (error) {
        toast.error("Invalid mint address");
        setLoading(false);
        return;
      }
      
      toast.info("Minting tokens...", {
        description: "Please approve the transaction in your wallet"
      });
      
      const signature = await mintTokens(
        solanaConnection,
        wallet,
        mintPublicKey,
        publicKey,
        parseFloat(amount),
        parseInt(tokenDecimals)
      );
      
      setTxSignature(signature);
      
      toast.success("Tokens minted successfully", {
        description: `Transaction: ${signature.slice(0, 8)}...`
      });
    } catch (error: any) {
      console.error("Error minting tokens:", error);
      toast.error("Failed to mint tokens", {
        description: error.message || "An unexpected error occurred"
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card className="w-full max-w-md bg-glass">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Coins className="h-5 w-5 text-solana-blue" />
          Mint Tokens
        </CardTitle>
        <CardDescription>
          Mint new tokens to your wallet
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleMintTokens} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="mintAddress" className="text-sm font-medium">
              Token Mint Address
            </label>
            <Input
              id="mintAddress"
              placeholder="e.g. EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
              value={mintAddress}
              onChange={(e) => setMintAddress(e.target.value)}
              required
              disabled={loading || !connected}
              className="bg-white/50 dark:bg-slate-950/50"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="amount" className="text-sm font-medium">
              Amount
            </label>
            <Input
              id="amount"
              type="number"
              placeholder="e.g. 1000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              min="0"
              disabled={loading || !connected}
              className="bg-white/50 dark:bg-slate-950/50"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="tokenDecimals" className="text-sm font-medium">
              Token Decimals
            </label>
            <Input
              id="tokenDecimals"
              type="number"
              placeholder="9"
              value={tokenDecimals}
              onChange={(e) => setTokenDecimals(e.target.value)}
              min="0"
              max="9"
              disabled={loading || !connected}
              className="bg-white/50 dark:bg-slate-950/50"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-solana-gradient hover:opacity-90 transition-opacity"
            disabled={loading || !connected}
          >
            {loading ? "Minting..." : "Mint Tokens"}
          </Button>
          
          {!connected && (
            <p className="text-xs text-center text-muted-foreground">
              Connect your wallet to mint tokens
            </p>
          )}
        </form>
      </CardContent>
      
      {txSignature && (
        <CardFooter className="border-t bg-secondary/50 flex flex-col items-start py-3 px-6">
          <p className="text-sm font-semibold">Tokens Minted!</p>
          <p className="text-xs">
            Transaction: {txSignature.slice(0, 20)}...
          </p>
          <div className="flex gap-2 mt-2">
            <Button 
              variant="outline" 
              size="sm"
              className="text-xs h-7 px-2"
              onClick={() => {
                navigator.clipboard.writeText(txSignature);
                toast.success("Transaction ID copied to clipboard");
              }}
            >
              Copy Tx ID
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs h-7 px-2"
              onClick={() => window.open(`https://explorer.solana.com/tx/${txSignature}?cluster=${useWallet().cluster}`, '_blank')}
            >
              View in Explorer
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default TokenMinter;
