export const airdropContractAddress =
  '0x02f2cec66630beb9b2c64a09b67fcefc85b8c0f1';
// '0x705bbe23ed7bdf8acc4e87012fcbdd2be76900f6'; // V1 MAINNET
// '0x5FbDB2315678afecb367f032d93F642f64180aa3'; // HARDHAT

export const owner = '0xCFBFFD83BEB90Cda1CA205c49A7e4E3B127567e8';

export const txFee = { ethereum: '0.03', polygon: '60', bsc: '0.2' };

export const plans = [
  { period: 'Day', price: '0.15' },
  { period: 'Week', price: '0.3' },
  { period: 'Month', price: '0.5' },
  { period: 'Year', price: '1' },
];

export const chainList = [
  { id: '0x1', name: 'Mainnet', icon: '/chains/mainnet.svg' },
  { id: '0x89', name: 'Polygon', icon: '/chains/polygon.svg' },
  { id: '0xa4b1', name: 'Arbitrum', icon: '/chains/arbitrum.svg' },
  { id: '0xa', name: 'Optimism', icon: '/chains/op.svg' },
  { id: '0x38', name: 'Binance', icon: '/chains/bnb.svg' },
  { id: '0x5', name: 'Goerli', icon: '/chains/rinkeby.svg' },
];

export const links = {
  twitter: 'https://twitter.com/nfteasydrop',
  telegram: 'https://t.me/nfteasydrop',
  etherscan: `https://etherscan.io/address/${airdropContractAddress}`,
};

// export const langList = [
//   { id: 1, name: 'en', icon: '/langs/en.svg' },
//   { id: 2, name: 'cn', icon: '/langs/cn.svg' },
//   { id: 3, name: 'ru', icon: '/langs/ru.svg' },
// ];
