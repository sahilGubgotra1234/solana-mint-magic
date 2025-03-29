
import React from "react";
import WalletButton from "./WalletButton";
import NetworkSelector from "./NetworkSelector";
import { Sparkles } from "lucide-react";

const Header = () => {
  return (
    <header className="w-full py-4 px-6 flex items-center justify-between border-b bg-white/50 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-solana-purple" />
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-solana-gradient">
          Solana Mint Magic
        </h1>
      </div>
      
      <div className="flex items-center gap-2">
        <NetworkSelector />
        <WalletButton />
      </div>
    </header>
  );
};

export default Header;
