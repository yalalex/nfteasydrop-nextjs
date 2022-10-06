import { chainList } from '../config';

const formatId = (chainId) => {
  switch (chainId) {
    case 1:
      return '0x1';
    case 137:
      return '0x89';
    case 42161:
      return '0xa4b1';
    case 10:
      return '0xa';
    case 56:
      return '0x38';
    case 5:
      return '0x5';
    default:
      return chainId;
  }
};

export const chainDetector = (chainId) => {
  const id = formatId(chainId);
  const chain = chainList.find((chain) => id === chain.id) || {
    id: 0,
    name: 'Unsupported',
    icon: '/chains/unsupported.svg',
  };
  return chain;
};
