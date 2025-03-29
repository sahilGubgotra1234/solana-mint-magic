
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <div className="flex flex-col items-center text-center max-w-3xl mx-auto py-10 md:py-16 px-6">
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
        Create and mint{" "}
        <span className="bg-clip-text text-transparent bg-solana-gradient">
          Solana tokens
        </span>{" "}
        in minutes
      </h1>
      <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
        Build your own Solana SPL tokens without any coding knowledge. Connect your wallet, create tokens, and mint them with our simple interface.
      </p>
      
      <div className="flex flex-wrap gap-4 justify-center">
        <Button 
          className="bg-solana-gradient hover:opacity-90 transition-opacity text-white px-6"
          onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
        >
          Get Started
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        <Button 
          variant="outline" 
          className="border-purple-200 bg-glass hover:bg-purple-100/50"
          onClick={() => window.open("https://spl.solana.com/token", "_blank")}
        >
          Learn about SPL Tokens
        </Button>
      </div>
      
      <div className="hidden md:flex mt-10 gap-2 text-xs text-muted-foreground">
        <div className="flex items-center">
          <div className="h-2 w-2 rounded-full bg-purple-400 mr-1" />
          Safe & Secure
        </div>
        <span>•</span>
        <div className="flex items-center">
          <div className="h-2 w-2 rounded-full bg-blue-400 mr-1" />
          No Coding Required
        </div>
        <span>•</span>
        <div className="flex items-center">
          <div className="h-2 w-2 rounded-full bg-green-400 mr-1" />
          Full SPL Support
        </div>
      </div>
    </div>
  );
};

export default Hero;
