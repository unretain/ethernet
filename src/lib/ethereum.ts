import { createPublicClient, http, formatEther, formatGwei } from 'viem';
import { mainnet } from 'viem/chains';

// Override with the RPC_URL env var (e.g. an Alchemy/Infura key) for production.
const RPC_URL = process.env.RPC_URL || 'https://ethereum-rpc.publicnode.com';

export const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(RPC_URL),
});

export { formatEther, formatGwei };

export async function getLatestBlocks(count: number = 10) {
  const latestBlock = await publicClient.getBlockNumber();
  const blocks = [];

  for (let i = 0; i < count; i++) {
    const blockNumber = latestBlock - BigInt(i);
    if (blockNumber < 0n) break;
    const block = await publicClient.getBlock({ blockNumber });
    blocks.push(block);
  }

  return blocks;
}

export async function getBlock(blockNumber: bigint) {
  return publicClient.getBlock({
    blockNumber,
    includeTransactions: true
  });
}

export async function getTransaction(hash: `0x${string}`) {
  const tx = await publicClient.getTransaction({ hash });
  const receipt = await publicClient.getTransactionReceipt({ hash });
  return { tx, receipt };
}

export async function getAddressInfo(address: `0x${string}`) {
  const [balance, transactionCount] = await Promise.all([
    publicClient.getBalance({ address }),
    publicClient.getTransactionCount({ address }),
  ]);

  return { balance, transactionCount };
}
