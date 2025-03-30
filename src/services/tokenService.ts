import { 
  clusterApiUrl, 
  Connection, 
  Keypair, 
  PublicKey, 
  Transaction, 
  sendAndConfirmTransaction,
  SystemProgram
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
    // Create mint transaction
    const mintKeypair = Keypair.generate();
    const mintPubkey = mintKeypair.publicKey;

    // Use the SPL Token program's createMintToInstruction to create the mint
    const mintTransaction = new Transaction();
    
    // Add necessary system instruction to create account
    const lamports = await connection.getMinimumBalanceForRentExemption(
      splToken.MintLayout.span
    );
    
    mintTransaction.add(
      // First create account
      SystemProgram.createAccount({
        fromPubkey: payer.publicKey,
        newAccountPubkey: mintPubkey,
        space: splToken.MintLayout.span,
        lamports,
        programId: splToken.TOKEN_PROGRAM_ID
      })
    );
    
    // Create token mint account
    mintTransaction.add(
      splToken.createInitializeMintInstruction(
        mintPubkey,
        decimals,
        payer.publicKey,
        payer.publicKey,
        splToken.TOKEN_PROGRAM_ID
      )
    );
    
    // Set recent blockhash
    mintTransaction.recentBlockhash = (
      await connection.getLatestBlockhash()
    ).blockhash;
    
    // Set fee payer
    mintTransaction.feePayer = payer.publicKey;
    
    // Setup partial sign with the mint keypair
    mintTransaction.partialSign(mintKeypair);
    
    // Get wallet to sign transaction
    const signedTransaction = await payer.signTransaction(mintTransaction);
    
    // Send the transaction
    const transactionId = await connection.sendRawTransaction(
      signedTransaction.serialize()
    );
    
    // Wait for confirmation
    await connection.confirmTransaction(transactionId);
    
    console.log(`Token mint created: ${mintPubkey.toString()}`);

    return {
      tokenMint: mintPubkey,
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
    const associatedTokenAddress = await splToken.getAssociatedTokenAddress(
      mintAddress,
      destinationAddress
    );
    
    // Check if the token account already exists
    const tokenAccountInfo = await connection.getAccountInfo(associatedTokenAddress);
    
    // Create the transaction
    const transaction = new Transaction();
    
    // If the token account doesn't exist, create it
    if (!tokenAccountInfo) {
      transaction.add(
        splToken.createAssociatedTokenAccountInstruction(
          payer.publicKey,
          associatedTokenAddress,
          destinationAddress,
          mintAddress
        )
      );
    }
    
    // Calculate the amount with decimals
    const mintAmount = Math.floor(amount * Math.pow(10, decimals));
    
    // Add the mint instruction
    transaction.add(
      splToken.createMintToInstruction(
        mintAddress,
        associatedTokenAddress,
        payer.publicKey,
        mintAmount
      )
    );
    
    // Set recent blockhash
    transaction.recentBlockhash = (
      await connection.getLatestBlockhash()
    ).blockhash;
    
    // Set fee payer
    transaction.feePayer = payer.publicKey;
    
    // Get wallet to sign transaction
    const signedTransaction = await payer.signTransaction(transaction);
    
    // Send the transaction
    const signature = await connection.sendRawTransaction(
      signedTransaction.serialize()
    );
    
    // Wait for confirmation
    await connection.confirmTransaction(signature);
    
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
