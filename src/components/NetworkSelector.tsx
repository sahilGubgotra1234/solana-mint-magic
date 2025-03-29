
import { useWallet } from "@/contexts/WalletContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Cluster } from "@solana/web3.js";

const NetworkSelector = () => {
  const { cluster, setCluster } = useWallet();

  const handleChange = (value: string) => {
    setCluster(value as Cluster);
  };

  return (
    <div className="flex items-center gap-2">
      <Select value={cluster} onValueChange={handleChange}>
        <SelectTrigger className="w-[140px] h-9 bg-glass">
          <SelectValue placeholder="Network" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="devnet">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-orange-400" />
              Devnet
            </div>
          </SelectItem>
          <SelectItem value="testnet">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-blue-400" />
              Testnet
            </div>
          </SelectItem>
          <SelectItem value="mainnet-beta">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-400" />
              Mainnet
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default NetworkSelector;
