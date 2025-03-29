
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/contexts/WalletContext";
import { createToken } from "@/services/tokenService";
import { toast } from "sonner";
import { CoinsIcon } from "lucide-react";
import { PublicKey } from "@solana/web3.js";

const TokenCreator = () => {
  const { connected, solanaConnection, wallet, publicKey } = useWallet();
  const [loading, setLoading] = useState(false);
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [tokenDecimals, setTokenDecimals] = useState("9");
  const [createdTokenMint, setCreatedTokenMint] = useState<PublicKey | null>(null);
  
  const handleCreateToken = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!connected || !solanaConnection || !wallet || !publicKey) {
      toast.error("Please connect your wallet first");
      return;
    }
    
    if (!tokenName || !tokenSymbol) {
      toast.error("Please fill all required fields");
      return;
    }
    
    try {
      setLoading(true);
      const decimals = parseInt(tokenDecimals);
      
      toast.info("Creating token...", {
        description: "Please approve the transaction in your wallet"
      });
      
      const tokenInfo = await createToken(
        solanaConnection, 
        wallet, 
        tokenName, 
        tokenSymbol, 
        decimals
      );
      
      setCreatedTokenMint(tokenInfo.tokenMint);
      
      toast.success("Token created successfully", {
        description: `Token mint: ${tokenInfo.tokenMint.toString().slice(0, 8)}...`
      });
    } catch (error: any) {
      console.error("Error creating token:", error);
      toast.error("Failed to create token", {
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
          <CoinsIcon className="h-5 w-5 text-solana-purple" />
          Create Token
        </CardTitle>
        <CardDescription>
          Create your own SPL token on Solana
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleCreateToken} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="tokenName" className="text-sm font-medium">
              Token Name
            </label>
            <Input
              id="tokenName"
              placeholder="e.g. My Awesome Token"
              value={tokenName}
              onChange={(e) => setTokenName(e.target.value)}
              required
              disabled={loading || !connected}
              className="bg-white/50 dark:bg-slate-950/50"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="tokenSymbol" className="text-sm font-medium">
              Token Symbol
            </label>
            <Input
              id="tokenSymbol"
              placeholder="e.g. MAT"
              value={tokenSymbol}
              onChange={(e) => setTokenSymbol(e.target.value)}
              required
              disabled={loading || !connected}
              className="bg-white/50 dark:bg-slate-950/50"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="tokenDecimals" className="text-sm font-medium">
              Decimals
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
            <p className="text-xs text-muted-foreground">
              Number of decimals for your token (0-9)
            </p>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-solana-gradient hover:opacity-90 transition-opacity"
            disabled={loading || !connected}
          >
            {loading ? "Creating..." : "Create Token"}
          </Button>
          
          {!connected && (
            <p className="text-xs text-center text-muted-foreground">
              Connect your wallet to create tokens
            </p>
          )}
        </form>
      </CardContent>
      
      {createdTokenMint && (
        <CardFooter className="border-t bg-secondary/50 flex flex-col items-start py-3 px-6">
          <p className="text-sm font-semibold">Token Created!</p>
          <p className="text-xs">
            Mint Address: {createdTokenMint.toString().slice(0, 16)}...
          </p>
          <div className="flex gap-2 mt-2">
            <Button 
              variant="outline" 
              size="sm"
              className="text-xs h-7 px-2"
              onClick={() => {
                navigator.clipboard.writeText(createdTokenMint.toString());
                toast.success("Address copied to clipboard");
              }}
            >
              Copy Address
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs h-7 px-2"
              onClick={() => window.open(`https://explorer.solana.com/address/${createdTokenMint.toString()}?cluster=${useWallet().cluster}`, '_blank')}
            >
              View in Explorer
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default TokenCreator;
