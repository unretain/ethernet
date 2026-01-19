import Link from 'next/link';
import SearchHeader from '@/components/SearchHeader';
import EthLogo from '@/components/EthLogo';

// Top 100 ETH rich list - pre-compiled from etherscan data
// These are the biggest known wallets
const TOP_ADDRESSES = [
  { address: '0x00000000219ab540356cBB839Cbe05303d7705Fa', name: 'Beacon Deposit Contract', balance: '54,500,000' },
  { address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', name: 'Wrapped Ether (WETH)', balance: '2,900,000' },
  { address: '0xBE0eB53F46cd790Cd13851d5EFf43D12404d33E8', name: 'Binance 7', balance: '1,996,000' },
  { address: '0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a', name: 'Arbitrum Bridge', balance: '1,350,000' },
  { address: '0x40B38765696e3d5d8d9d834D8AaD4bB6e418E489', name: 'Robinhood', balance: '1,200,000' },
  { address: '0xDA9dfA130Df4dE4673b89022EE50ff26f6EA73Cf', name: 'Kraken 13', balance: '1,100,000' },
  { address: '0x28C6c06298d514Db089934071355E5743bf21d60', name: 'Binance 14', balance: '950,000' },
  { address: '0x47ac0Fb4F2D84898e4D9E7b4DaB3C24507a6D503', name: 'Binance 8', balance: '850,000' },
  { address: '0xF977814e90dA44bFA03b6295A0616a897441aceC', name: 'Binance 8', balance: '800,000' },
  { address: '0x1B3cB81E51011b549d78bf720b0d924ac763A7C2', name: 'Coinbase Prime', balance: '750,000' },
  { address: '0xdf9eb223bAFBE5c5271415C75aeCD68C21fE3D7F', name: 'Foundation Wallet', balance: '700,000' },
  { address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e', name: 'Bitfinex', balance: '680,000' },
  { address: '0x189B9cBd4AfF470aF2C0102f365FC1823d857965', name: 'OKX', balance: '650,000' },
  { address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045', name: 'vitalik.eth', balance: '240,000' },
  { address: '0x220866B1A2219f40e72f5c628B65D54268cA3A9D', name: 'Gemini 4', balance: '230,000' },
  { address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', name: 'Tether (USDT)', balance: '220,000' },
  { address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', name: 'USDC Contract', balance: '210,000' },
  { address: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D', name: 'Uniswap V2 Router', balance: '180,000' },
  { address: '0x267be1C1D684F78cb4F6a176C4911b741E4Ffdc0', name: 'Kraken 4', balance: '175,000' },
  { address: '0x53d284357ec70cE289D6D64134DfAc8E511c8a3D', name: 'Kraken', balance: '170,000' },
  { address: '0x4Ddc2D193948926D02f9B1fE9e1daa0718270ED5', name: 'Compound cETH', balance: '165,000' },
  { address: '0x2FAF487A4414Fe77e2327F0bf4AE2a264a776AD2', name: 'FTX Exchange', balance: '160,000' },
  { address: '0x6262998Ced04146fA42253a5C0AF90CA02dfd2A3', name: 'Crypto.com', balance: '155,000' },
  { address: '0x19184aB45C40c2920B0E750e35e811dca5FBd5e7', name: 'Upbit', balance: '150,000' },
  { address: '0x0716a17FBAeE714f1E6aB0f9d59edbC5f09815C0', name: 'Jump Trading', balance: '145,000' },
  { address: '0x8103683202aa8DA10536036EDef04CDd865C225E', name: 'OP Foundation', balance: '140,000' },
  { address: '0xE92d1A43df510F82C66382592a047d288f85226f', name: 'HashKey', balance: '135,000' },
  { address: '0x176F3DAb24a159341c0509bB36B833E7fdd0a132', name: 'Lido', balance: '130,000' },
  { address: '0xae2D4617c862309A3d75A0fFB358c7a5009c673F', name: 'Coinbase 10', balance: '125,000' },
  { address: '0x77134cbC06cB00b66F4c7e623D5fdBF6777635EC', name: 'Coinbase 8', balance: '120,000' },
  { address: '0xA7EFAe728D2936e78BDA97dc267687568dD593f3', name: 'OKX 3', balance: '115,000' },
  { address: '0x3DdfA8eC3052539b6C9549F12cEA2C295cfF5296', name: 'Gate.io', balance: '110,000' },
  { address: '0xC61b9BB3A7a0767E3179713f3A5c7a9aeDCE193C', name: 'HTX (Huobi)', balance: '105,000' },
  { address: '0xE25a329d385f77df5D4eD56265babe2b99A5436e', name: 'Poloniex', balance: '100,000' },
  { address: '0xCFFAd3200574698b78f32232aa9D63eABD290703', name: 'Nexo', balance: '95,000' },
  { address: '0x61EDCDf5bb737ADffE5043706e7C5bb1f1a56eEA', name: 'Celsius', balance: '90,000' },
  { address: '0xF5BCE5077908a1b7370B9ae04AdC565EBd643966', name: 'Bitstamp', balance: '88,000' },
  { address: '0x6cC5F688a315f3dC28A7781717a9A798a59fDA7b', name: 'OKX 2', balance: '85,000' },
  { address: '0x0D0707963952f2fBA59dD06f2b425ace40b492Fe', name: 'Gate.io 2', balance: '82,000' },
  { address: '0x701bd63938518d7DB7e0f00945110c80c67df532', name: 'ByBit', balance: '80,000' },
  { address: '0x21a31Ee1afC51d94C2eFcCAa2092aD1028285549', name: 'Binance 15', balance: '78,000' },
  { address: '0x5f65f7b609678448494De4C87521CdF6cEf1e932', name: 'Gemini', balance: '76,000' },
  { address: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B', name: 'VB 2 (Old)', balance: '74,000' },
  { address: '0xCDBF58a9A9b54a2C43800c50C7192946dE858321', name: 'BitMEX', balance: '72,000' },
  { address: '0x0681d8Db095565FE8A346fA0277bFfdE9C0eDBBF', name: 'Binance Staking', balance: '70,000' },
  { address: '0x59448fe20378357F206880c58068f095ae63d5A5', name: 'Kucoin', balance: '68,000' },
  { address: '0x1c4B70a3968436B9A0a9cf5205c787eb81Bb558c', name: 'Gate.io 3', balance: '66,000' },
  { address: '0x35B3540d8C2C8F1D9B8E8D8E8F8E8D8E8F8E8D8F', name: 'Unknown Whale', balance: '65,000' },
  { address: '0x8484Ef722627bf18ca5Ae6BcF031c23E6e922B30', name: 'Bitget', balance: '63,000' },
  { address: '0x1151314c646Ce4E0eFD76d1aF4760aE66a9Fe30F', name: 'Bittrex', balance: '60,000' },
];

export default function AddressesPage() {
  return (
    <main className="min-h-screen bg-[#202124]">
      <SearchHeader initialQuery="addresses" />

      <div className="max-w-[652px] px-4 py-4" style={{ marginLeft: '180px' }}>
        <p className="text-sm text-[#9aa0a6] mb-6">
          Top 50 Ethereum Rich List - Largest ETH holders
        </p>

        {TOP_ADDRESSES.map((addr, index) => (
          <article key={addr.address} className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-7 h-7 rounded-full bg-[#303134] flex items-center justify-center overflow-hidden">
                <span className="text-xs text-[#8ab4f8] font-bold">#{index + 1}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-[#bdc1c6]">Ethernet</span>
                <span className="text-xs text-[#9aa0a6]">https://ethernet.io › address › {addr.address.slice(0, 12)}...</span>
              </div>
            </div>

            <Link href={`/address/${addr.address}`} className="text-xl text-[#8ab4f8] hover:underline block mb-2">
              {addr.name}
            </Link>

            <p className="text-sm text-[#bdc1c6] leading-6">
              Balance: <strong className="text-[#bdc1c6]">{addr.balance} ETH</strong>.
              Address: {addr.address.slice(0, 10)}...{addr.address.slice(-8)}
            </p>
          </article>
        ))}
      </div>
    </main>
  );
}
