
import { useState } from "react";
import { useWallet } from "@/contexts/WalletContext";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Wallet, LogOut, ChevronDown } from "lucide-react";

const WalletButton = () => {
  const { publicKey, connected, connecting, connectWallet, disconnectWallet, balance, walletProvider } = useWallet();
  const [open, setOpen] = useState(false);

  const handleConnectWallet = async (type: 'phantom' | 'solflare') => {
    setOpen(false);
    await connectWallet(type);
  };

  if (connected && publicKey) {
    return (
      <div className="flex items-center gap-2">
        <div className="hidden md:flex flex-col items-end mr-2">
          <p className="text-xs font-medium">{balance.toFixed(4)} SOL</p>
          <p className="text-xs text-muted-foreground">
            {publicKey.toString().slice(0, 4)}...{publicKey.toString().slice(-4)}
          </p>
        </div>
        
        <Button 
          variant="outline" 
          className="bg-glass border-purple-200 hover:bg-purple-100/50"
          onClick={disconnectWallet}
        >
          <LogOut className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Disconnect</span>
        </Button>
      </div>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          className="bg-solana-gradient hover:opacity-90 transition-opacity" 
          disabled={connecting}
        >
          <Wallet className="h-4 w-4 mr-2" />
          {connecting ? "Connecting..." : "Connect Wallet"}
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-3" align="end">
        <div className="grid gap-2">
          <Button
            variant="ghost" 
            className="justify-start font-normal"
            onClick={() => handleConnectWallet('phantom')}
          >
            <img src="https://www.phantom.app/img/logo.svg" className="h-5 w-5 mr-2" alt="Phantom" />
            Phantom
          </Button>
          <Button 
            variant="ghost" 
            className="justify-start font-normal"
            onClick={() => handleConnectWallet('solflare')}
          >
            <img src="https://solflare.com/assets/logo.svg" className="h-5 w-5 mr-2" alt="Solflare" />
            Solflare
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default WalletButton;
