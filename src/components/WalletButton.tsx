
import React, { useState, useEffect } from "react";
import { useWallet } from "@/contexts/WalletContext";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Wallet, LogOut, ChevronDown } from "lucide-react";
import { toast } from "sonner";

const WalletButton = () => {
  const { publicKey, connected, connecting, connectWallet, disconnectWallet, balance, walletProvider } = useWallet();
  const [open, setOpen] = useState(false);
  const [walletAvailable, setWalletAvailable] = useState({
    phantom: false,
    solflare: false
  });

  // Check wallet availability on component mount
  useEffect(() => {
    const checkWalletAvailability = () => {
      const phantomAvailable = 'phantom' in window && (window as any).phantom?.solana;
      const solflareAvailable = 'solflare' in window && (window as any).solflare;
      
      setWalletAvailable({
        phantom: !!phantomAvailable,
        solflare: !!solflareAvailable
      });
      
      console.log("Wallet detection:", { 
        phantom: !!phantomAvailable, 
        solflare: !!solflareAvailable 
      });
    };
    
    // Check immediately
    checkWalletAvailability();
    // Then check again after a delay to ensure extensions are loaded
    setTimeout(checkWalletAvailability, 1000);
  }, []);

  const handleConnectWallet = async (type: 'phantom' | 'solflare') => {
    setOpen(false);
    
    // Double check wallet availability before trying to connect
    if (type === 'phantom' && !walletAvailable.phantom) {
      window.open('https://phantom.app/', '_blank');
      toast.error('Phantom wallet not found', {
        description: 'Please install Phantom wallet extension and reload the page'
      });
      return;
    }
    
    if (type === 'solflare' && !walletAvailable.solflare) {
      window.open('https://solflare.com/', '_blank');
      toast.error('Solflare wallet not found', {
        description: 'Please install Solflare wallet extension and reload the page'
      });
      return;
    }
    
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
            <div className="h-5 w-5 mr-2 flex items-center justify-center">
              {/* Inline SVG for Phantom logo */}
              <svg width="20" height="20" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="64" cy="64" r="64" fill="url(#paint0_linear)"/>
                <path d="M110.584 64.9142H99.142C99.142 41.7651 80.173 23 56.7726 23C33.7716 23 15 41.4556 15 64.1069C15 86.7582 33.7716 105.214 56.7726 105.214H64.4864C84.8 105.214 101.321 89.0843 101.321 69.1309C101.321 67.7504 110.584 64.9142 110.584 64.9142Z" fill="white"/>
                <path d="M78.0264 64.9142H89.4687C89.4687 41.7652 70.7497 23.0001 47.3493 23.0001C24.3307 23.0001 5.53674 41.4557 5.53674 64.107C5.53674 86.7583 24.3083 105.214 47.3493 105.214H55.0631C75.3992 105.214 91.8999 89.0843 91.8999 69.1309C91.8999 67.7504 78.0264 64.9142 78.0264 64.9142Z" fill="url(#paint1_linear)"/>
                <defs>
                  <linearGradient id="paint0_linear" x1="64" y1="0" x2="64" y2="128" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#534BB1"/>
                    <stop offset="1" stopColor="#551BF9"/>
                  </linearGradient>
                  <linearGradient id="paint1_linear" x1="48.7163" y1="23.0001" x2="48.7163" y2="105.214" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#534BB1"/>
                    <stop offset="1" stopColor="#551BF9"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            Phantom
            {walletAvailable.phantom && (
              <span className="ml-auto text-xs text-green-500">Available</span>
            )}
          </Button>
          <Button 
            variant="ghost" 
            className="justify-start font-normal"
            onClick={() => handleConnectWallet('solflare')}
          >
            <div className="h-5 w-5 mr-2 flex items-center justify-center">
              {/* Inline SVG for Solflare logo */}
              <svg width="20" height="20" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="48" cy="48" r="48" fill="black"/>
                <path d="M65.7 19.5H30.3C27.2 19.5 24.6 22.1 24.6 25.2V70.6C24.6 73.7 27.2 76.3 30.3 76.3H65.7C68.8 76.3 71.4 73.7 71.4 70.6V25.2C71.4 22.1 68.8 19.5 65.7 19.5Z" fill="url(#sf_grad_0)"/>
                <path d="M57.4 29.8H38.7C36.4 29.8 34.6 31.7 34.6 34V61.8C34.6 64.1 36.5 65.9 38.7 65.9H57.4C59.7 65.9 61.5 64 61.5 61.8V34C61.5 31.7 59.6 29.8 57.4 29.8Z" fill="white"/>
                <defs>
                  <linearGradient id="sf_grad_0" x1="24.6" y1="47.9" x2="71.4" y2="47.9" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FFC10B"/>
                    <stop offset="1" stopColor="#FB8C00"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            Solflare
            {walletAvailable.solflare && (
              <span className="ml-auto text-xs text-green-500">Available</span>
            )}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default WalletButton;
