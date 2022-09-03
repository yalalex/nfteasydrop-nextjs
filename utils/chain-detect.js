import { chainList } from '../config';

export const chainDetector = (chainId) => {
  const chain = chainList.find((chain) => chainId === chain.id) || {
    id: 0,
    name: 'Unsupported',
    icon: '',
  };
  return chain;
};
