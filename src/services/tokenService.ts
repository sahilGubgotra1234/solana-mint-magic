
import { 
  clusterApiUrl, 
  Connection, 
  Keypair, 
  PublicKey, 
  Transaction, 
  sendAndConfirmTransaction 
} from '@solana/web3.js';
import * as splToken from '@solana/spl-token';

export interface TokenInfo {
  tokenMint: PublicKey;
  tokenAccount?: PublicKey;
  tokenName: string;
  tokenSymbol: string;
  tokenDecimals: number;
}

// Custom signer interface to match what wallets provide
interface WalletSigner {
  publicKey: PublicKey;
  signTransaction: (transaction: Transaction) => Promise<Transaction>;
  signAllTransactions: (transactions: Transaction[]) => Promise<Transaction[]>;
}

export async function createToken(
  connection: Connection,
  payer: WalletSigner,
  name: string,
  symbol: string,
  decimals: number
): Promise<TokenInfo> {
  try {
    // Request signature from wallet for the transaction
    const mint = await splToken.createMint(
      connection,
      {
        publicKey: payer.publicKey,
        secretKey: Uint8Array.from([]), // Not used with wallet adapter
        signTransaction: payer.signTransaction,
        signAllTransactions: payer.signAllTransactions,
      } as any, // Using any to bridge the type gap between wallet adapter and @solana/web3.js
      payer.publicKey,
      payer.publicKey,
      decimals
    );

    return {
      tokenMint: mint,
      tokenName: name,
      tokenSymbol: symbol,
      tokenDecimals: decimals,
    };
  } catch (error) {
    console.error('Error creating token:', error);
    throw error;
  }
}

export async function mintTokens(
  connection: Connection,
  payer: WalletSigner,
  mintAddress: PublicKey,
  destinationAddress: PublicKey,
  amount: number,
  decimals: number
): Promise<string> {
  try {
    // Create associated token account if it doesn't exist
    const associatedTokenAccount = await splToken.getOrCreateAssociatedTokenAccount(
      connection,
      {
        publicKey: payer.publicKey,
        secretKey: Uint8Array.from([]), // Not used with wallet adapter
        signTransaction: payer.signTransaction,
        signAllTransactions: payer.signAllTransactions,
      } as any, // Using any to bridge the type gap
      mintAddress,
      destinationAddress
    );

    // Mint tokens to the associated account
    const mintAmount = amount * Math.pow(10, decimals);
    
    const signature = await splToken.mintTo(
      connection,
      {
        publicKey: payer.publicKey,
        secretKey: Uint8Array.from([]), // Not used with wallet adapter
        signTransaction: payer.signTransaction,
        signAllTransactions: payer.signAllTransactions,
      } as any, // Using any to bridge the type gap
      mintAddress,
      associatedTokenAccount.address,
      payer.publicKey,
      mintAmount
    );

    return signature;
  } catch (error) {
    console.error('Error minting tokens:', error);
    throw error;
  }
}

export async function getTokenBalance(
  connection: Connection,
  tokenAccount: PublicKey,
  decimals: number
): Promise<number> {
  try {
    const accountInfo = await connection.getTokenAccountBalance(tokenAccount);
    return Number(accountInfo.value.amount) / Math.pow(10, decimals);
  } catch (error) {
    console.error('Error getting token balance:', error);
    throw error;
  }
}

export async function getOwnedTokenAccounts(
  connection: Connection,
  ownerAddress: PublicKey
): Promise<any[]> {
  try {
    const tokenAccounts = await connection.getTokenAccountsByOwner(
      ownerAddress,
      { programId: splToken.TOKEN_PROGRAM_ID }
    );
    
    return tokenAccounts.value.map(({ pubkey, account }) => {
      const accountData = splToken.AccountLayout.decode(account.data);
      return {
        pubkey,
        mint: new PublicKey(accountData.mint),
        amount: Number(accountData.amount),
        owner: new PublicKey(accountData.owner),
      };
    });
  } catch (error) {
    console.error('Error fetching owned token accounts:', error);
    return [];
  }
}
