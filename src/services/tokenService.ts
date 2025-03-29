
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

export async function createToken(
  connection: Connection,
  payer: any,
  name: string,
  symbol: string,
  decimals: number
): Promise<TokenInfo> {
  try {
    // Request signature from wallet for the transaction
    const mint = await splToken.createMint(
      connection,
      {
        publicKey: new PublicKey(payer.publicKey.toString()),
        secretKey: Uint8Array.from([]),
        signTransaction: payer.signTransaction,
        signAllTransactions: payer.signAllTransactions,
      },
      new PublicKey(payer.publicKey.toString()),
      new PublicKey(payer.publicKey.toString()),
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
  payer: any,
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
        publicKey: new PublicKey(payer.publicKey.toString()),
        secretKey: Uint8Array.from([]),
        signTransaction: payer.signTransaction,
        signAllTransactions: payer.signAllTransactions,
      },
      mintAddress,
      destinationAddress
    );

    // Mint tokens to the associated account
    const mintAmount = amount * Math.pow(10, decimals);
    
    const signature = await splToken.mintTo(
      connection,
      {
        publicKey: new PublicKey(payer.publicKey.toString()),
        secretKey: Uint8Array.from([]),
        signTransaction: payer.signTransaction,
        signAllTransactions: payer.signAllTransactions,
      },
      mintAddress,
      associatedTokenAccount.address,
      new PublicKey(payer.publicKey.toString()),
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
