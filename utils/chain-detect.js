import { chainList } from '../config';

export const chainDetector = (chainId) => {
  let match = 'Unsupported';
  chainList.forEach((chain) => {
    if (chainId === chain.id) match = chain.name;
  });
  return match;
};
