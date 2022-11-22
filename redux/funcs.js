import { ethers } from 'ethers';

import store from './store';

import { chainDetector } from '../utils/chain-detect';

import Airdrop from '../data/AirdropABI.json';

import { airdropContractAddress } from '../config';

import { connect, account, chain, alert, loading } from './walletSlice';

const { dispatch } = store;

const getProvider = () => {
  return new ethers.providers.Web3Provider(ethereum);
};

const setSigner = () => {
  const provider = getProvider();
  const signer = provider.getSigner();
  const contract = new ethers.Contract(airdropContractAddress, Airdrop, signer);
  return connect({ provider, signer, contract });
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
    setAlert('Something went wrong. Please try again');
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
    const id = '0x' + chainId.toString(16);
    dispatch(chainChangedHandler(id));
  } catch (err) {
    setAlert('Something went wrong. Please try again');
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
        setAlert(`Please add ${chainDetector(newChainId).name} to MetaMask`);
      } else setAlert('Something went wrong. Please try again');
    }
  }
};

export const chainChangedHandler = (chainId) => {
  dispatch(setSigner());
  const currentChain = chainDetector(chainId);
  return chain(currentChain);
};

export const setAlert = (message, type = 'info') => {
  dispatch(alert({ message, type }));
  setTimeout(() => dispatch(alert(null)), 5000);
};

// export const changeLang = (newLangId) => {
//   const newLang = langList.find((lang) => lang.id === newLangId);
//   return newLang;
// };
