import { useReducer, createContext } from 'react';

import { ethers } from 'ethers';

import { chainDetector } from '../utils/chain-detect';

import Airdrop from '../data/AirdropABI.json';

import { airdropContractAddress, chainList, langList } from '../config';

const INITIAL_STATE = {
  defaultAccount: '',
  signer: null,
  provider: null,
  chain: chainList[0],
  airdropContract: null,
  lang: langList[0],
  loading: '',
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
        signer: payload.signer,
        provider: payload.provider,
        loading: '',
      };
    case ACTION_TYPES.SET_ACCOUNT:
      return {
        ...state,
        defaultAccount: payload,
        connected: true,
      };
    case ACTION_TYPES.SET_CHAIN:
      return {
        ...state,
        chain: payload,
        loading: '',
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
        loading: '',
      };
    case ACTION_TYPES.SET_LOADING:
      return {
        ...state,
        loading: payload,
      };
    default:
      return state;
  }
};

export const Context = createContext({
  defaultAccount: '',
  signer: null,
  provider: null,
  chain: null,
  lang: null,
  airdropContract: null,
  loading: '',
  error: null,
  connectWalletHandler: () => {},
  accountChangedHandler: () => {},
  chainChangedHandler: () => {},
  changeChain: () => {},
  changeLang: () => {},
  setError: () => {},
  // setLoading: () => {},
});

export const Provider = ({ children }) => {
  const [state, dispatch] = useReducer(walletReducer, INITIAL_STATE);

  const {
    signer,
    provider,
    defaultAccount,
    chain,
    airdropContract,
    lang,
    loading,
    error,
    connected,
  } = state;

  const chainChangedHandler = (chainId) => {
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
    setLoading('account');
    if (window.ethereum && window.ethereum.isMetaMask) {
      const { ethereum } = window;
      try {
        const [account] = await ethereum.request({
          method: 'eth_requestAccounts',
        });
        const currentProvider = provider
          ? provider
          : new ethers.providers.Web3Provider(ethereum);
        const signer = currentProvider.getSigner();
        dispatch({
          type: ACTION_TYPES.SET_SIGNER,
          payload: { signer, provider },
        });
        setContract(signer);
        accountChangedHandler(account);
        const { chainId } = await currentProvider.getNetwork();
        if (connected === true) chainChangedHandler(chainId);
      } catch (err) {
        setError('Something went wrong. Please try again');
      }
    } else {
      setError('Please install MetaMask browser extension to interact');
    }
  };

  const setChainId = async () => {
    const currentProvider = provider
      ? provider
      : new ethers.providers.Web3Provider(ethereum);
    try {
      const { chainId } = await currentProvider.getNetwork();
      chainChangedHandler(chainId);
    } catch (err) {
      setError('Something went wrong. Please try again');
    }
  };

  const accountChangedHandler = (newAccount) => {
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
      setLoading('chain');
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

  const setLoading = (loadingType) => {
    dispatch({ type: ACTION_TYPES.SET_LOADING, payload: loadingType });
  };

  const value = {
    defaultAccount,
    signer,
    provider,
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
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
};
