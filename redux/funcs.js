import { ethers } from 'ethers';

import store from './store';

import { chainDetector } from '../utils/chain-detect';

import Airdrop from '../data/AirdropABI.json';

import { airdropContractAddress } from '../config';

import { connect, account, chain, error, loading } from './walletSlice';

const { dispatch } = store;

const getProvider = () => {
  return new ethers.providers.Web3Provider(ethereum);
};

const setSigner = () => {
  const currentProvider = getProvider();
  const signer = currentProvider.getSigner();
  const contract = new ethers.Contract(airdropContractAddress, Airdrop, signer);
  return connect({ signer, contract });
};

const setLoading = (loadingType) => {
  return loading(loadingType);
};

export const connectWalletHandler = async () => {
  dispatch(setLoading('account'));
  try {
    const [account] = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });
    dispatch(setSigner());
    dispatch(accountChangedHandler(account, false));
  } catch (err) {
    setError('Something went wrong. Please try again');
  }
};

export const accountChangedHandler = (newAccount, connected = true) => {
  if (connected === false) setChainId();
  return account(newAccount);
};

const setChainId = async () => {
  const currentProvider = getProvider();
  try {
    const { chainId } = await currentProvider.getNetwork();
    dispatch(chainChangedHandler(chainId));
  } catch (err) {
    setError('Something went wrong. Please try again');
  }
};

export const changeChain = async (newChainId) => {
  if (chain.id !== newChainId) {
    dispatch(setLoading('chain'));
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: newChainId }],
      });
    } catch (err) {
      if (err.code === 4902) {
        setError(`Please add ${chainDetector(newChainId)} to MetaMask`);
      } else setError('Something went wrong. Please try again');
    }
  }
};

export const chainChangedHandler = (chainId) => {
  dispatch(setSigner());
  const currentChain = chainDetector(chainId);
  return chain(currentChain);
};

export const setError = (message, type = 'info') => {
  dispatch(error({ message, type }));
  setTimeout(() => dispatch(error(null)), 5000);
};

export const changeLang = (newLangId) => {
  const newLang = langList.find((lang) => lang.id === newLangId);
  return newLang;
};
