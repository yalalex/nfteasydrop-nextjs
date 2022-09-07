import { useReducer, createContext } from 'react';

import { ethers } from 'ethers';

import { chainDetector } from '../utils/chain-detect';

import Airdrop from '../utils/AirdropABI.json';

import { airdropContractAddress, chainList, langList } from '../config';

const INITIAL_STATE = {
  defaultAccount: '',
  signer: null,
  chain: chainList[0],
  airdropContract: null,
  lang: langList[0],
  loading: false,
  error: null,
  connected: false,
};

const ACTION_TYPES = {
  SET_SIGNER: 'SET_SIGNER',
  SET_ACCOUNT: 'SET_ACCOUNT',
  SET_CHAIN: 'SET_CHAIN',
  SET_CONTRACT: 'SET_CONTRACT',
  SET_LANG: 'SET_LANG',
  SET_ERROR: 'SET_ERROR',
  SET_LOADING: 'SET_LOADING',
};

const walletReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case ACTION_TYPES.SET_SIGNER:
      return {
        ...state,
        signer: payload,
      };
    case ACTION_TYPES.SET_ACCOUNT:
      return {
        ...state,
        defaultAccount: payload,
        connected: true,
        loading: false,
      };
    case ACTION_TYPES.SET_CHAIN:
      return {
        ...state,
        chain: payload,
        loading: false,
      };
    case ACTION_TYPES.SET_CONTRACT:
      return {
        ...state,
        airdropContract: payload,
      };
    case ACTION_TYPES.SET_LANG:
      return {
        ...state,
        lang: payload,
      };
    case ACTION_TYPES.SET_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };
    case ACTION_TYPES.SET_LOADING:
      return {
        ...state,
        loading: true,
      };
    default:
      return state;
  }
};

export const Context = createContext({
  defaultAccount: '',
  signer: null,
  chain: null,
  lang: null,
  airdropContract: null,
  loading: false,
  error: null,
  connectWalletHandler: () => {},
  accountChangedHandler: () => {},
  chainChangedHandler: () => {},
  changeChain: () => {},
  changeLang: () => {},
  setError: () => {},
  setLoading: () => {},
});

export const Provider = ({ children }) => {
  const [state, dispatch] = useReducer(walletReducer, INITIAL_STATE);

  const {
    signer,
    defaultAccount,
    chain,
    airdropContract,
    lang,
    loading,
    error,
    connected,
  } = state;

  const chainChangedHandler = (chainId) => {
    console.log('chainChangedHandler');
    const chain = chainDetector(chainId);
    dispatch({
      type: ACTION_TYPES.SET_CHAIN,
      payload: chain,
    });
  };

  const setContract = (signer) => {
    const contract = new ethers.Contract(
      airdropContractAddress,
      Airdrop,
      signer
    );
    dispatch({
      type: ACTION_TYPES.SET_CONTRACT,
      payload: contract,
    });
  };

  const connectWalletHandler = async () => {
    console.log('connectWalletHandler');
    setLoading();
    if (window.ethereum && window.ethereum.isMetaMask) {
      const { ethereum } = window;
      const [account] = await ethereum.request({
        method: 'eth_requestAccounts',
      });
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      dispatch({
        type: ACTION_TYPES.SET_SIGNER,
        payload: signer,
      });
      setContract(signer);
      accountChangedHandler(account);
      const { chainId } = await provider.getNetwork();
      if (connected === true) chainChangedHandler(chainId);
    } else {
      setError('Please install MetaMask browser extension to interact');
    }
  };

  const setChainId = async () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const { chainId } = await provider.getNetwork();
    chainChangedHandler(chainId);
  };

  const accountChangedHandler = (newAccount) => {
    console.log('accountChangedHandler');
    if (connected === false) setChainId();
    if (newAccount) {
      dispatch({
        type: ACTION_TYPES.SET_ACCOUNT,
        payload: newAccount,
      });
    } else setError('Please connect Metamask');
  };

  const changeChain = async (newChainId) => {
    if (chain.id !== newChainId) {
      setLoading();
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: newChainId }],
        });
      } catch (err) {
        if (err.code === 4902) {
          setError(`Please add ${chainDetector(newChainId)} to MetaMask`);
        }
      }
    }
  };

  const changeLang = (newLangId) => {
    const newLang = langList.find((lang) => lang.id === newLangId);
    dispatch({ type: ACTION_TYPES.SET_LANG, payload: newLang });
  };

  const setError = (message, type = 'info') => {
    dispatch({ type: ACTION_TYPES.SET_ERROR, payload: { message, type } });
    setTimeout(
      () => dispatch({ type: ACTION_TYPES.SET_ERROR, payload: null }),
      5000
    );
  };

  const setLoading = () => {
    dispatch({ type: ACTION_TYPES.SET_LOADING });
  };

  const value = {
    defaultAccount,
    signer,
    chain,
    airdropContract,
    lang,
    loading,
    error,
    chainChangedHandler,
    changeChain,
    connectWalletHandler,
    accountChangedHandler,
    changeLang,
    setError,
    setLoading,
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
};
