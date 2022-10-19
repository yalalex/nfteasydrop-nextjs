import { chainList } from '../config';

export const chainDetector = (chainId) => {
  const chain = chainList.find((chain) => chainId === chain.id) || {
    id: '0x0',
    name: 'Unsupported',
    icon: '/chains/unsupported.svg',
  };
  return chain;
};
