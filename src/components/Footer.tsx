
import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full py-4 px-6 border-t text-center text-sm text-muted-foreground mt-auto">
      <div className="flex items-center justify-center gap-1">
        <span>Made with</span>
        <Heart className="h-3 w-3 text-red-500 fill-red-500" />
        <span>for the Solana ecosystem</span>
      </div>
      <div className="mt-1">
        <a
          href="https://solana.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-primary transition-colors"
        >
          Learn more about Solana
        </a>
      </div>
    </footer>
  );
};

export default Footer;
