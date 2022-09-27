export const airdropContractAddress =
  '0x705bbe23ed7bdf8acc4e87012fcbdd2be76900f6';
// '0x5FbDB2315678afecb367f032d93F642f64180aa3';

export const txFee = { ethereum: '0.07', polygon: '100', bsc: '0.35' };

export const plans = [
  { period: 'Day', price: '0.25' },
  { period: 'Week', price: '0.5' },
  { period: 'Month', price: '1' },
  { period: 'Year', price: '3' },
];

export const chainList = [
  { id: '0x1', name: 'Mainnet', icon: '/chains/mainnet.svg' },
  { id: '0x89', name: 'Polygon', icon: '/chains/polygon.svg' },
  { id: '0xa4b1', name: 'Arbitrum', icon: '/chains/arbitrum.svg' },
  { id: '0xa', name: 'Optimism', icon: '/chains/op.svg' },
  { id: '0x38', name: 'Binance', icon: '/chains/bnb.svg' },
  { id: '0x4', name: 'Rinkeby', icon: '/chains/rinkeby.svg' },
];

export const langList = [
  { id: 1, name: 'en', icon: '/langs/en.svg' },
  { id: 2, name: 'cn', icon: '/langs/cn.svg' },
  { id: 3, name: 'ru', icon: '/langs/ru.svg' },
];
