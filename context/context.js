import { useReducer, createContext } from 'react';

import { ethers } from 'ethers';

import { chainDetector } from '../utils/chain-detect';

import Airdrop from '../data/AirdropABI.json';

import { airdropContractAddress, chainList, langList } from '../config';

const INITIAL_STATE = {
  defaultAccount: '',
  signer: null,
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
  // SET_CONTRACT: 'SET_CONTRACT',
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
        contract: payload.contract,
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
    // case ACTION_TYPES.SET_CONTRACT:
    //   return {
    //     ...state,
    //     airdropContract: payload,
    //   };
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

  const getProvider = () => {
    return new ethers.providers.Web3Provider(ethereum);
  };

  const connectWalletHandler = async () => {
    setLoading('account');
    if (window.ethereum && window.ethereum.isMetaMask) {
      const { ethereum } = window;
      try {
        const [account] = await ethereum.request({
          method: 'eth_requestAccounts',
        });
        setSigner();
        accountChangedHandler(account);
      } catch (err) {
        setError('Something went wrong. Please try again');
      }
    } else {
      setError('Please install MetaMask browser extension to interact');
    }
  };

  const setSigner = () => {
    const currentProvider = getProvider();
    const signer = currentProvider.getSigner();
    const contract = new ethers.Contract(
      airdropContractAddress,
      Airdrop,
      signer
    );
    dispatch({
      type: ACTION_TYPES.SET_SIGNER,
      payload: { signer, contract },
    });
    // dispatch({
    //   type: ACTION_TYPES.SET_CONTRACT,
    //   payload: contract,
    // });
  };

  // const setContract = (signer) => {
  //   const contract = new ethers.Contract(
  //     airdropContractAddress,
  //     Airdrop,
  //     signer
  //   );
  //   dispatch({
  //     type: ACTION_TYPES.SET_CONTRACT,
  //     payload: contract,
  //   });
  // };

  const accountChangedHandler = (newAccount) => {
    if (connected === false) setChainId();
    dispatch({
      type: ACTION_TYPES.SET_ACCOUNT,
      payload: newAccount,
    });
  };

  const chainChangedHandler = (chainId) => {
    setSigner();
    const chain = chainDetector(chainId);
    dispatch({
      type: ACTION_TYPES.SET_CHAIN,
      payload: chain,
    });
  };

  const setChainId = async () => {
    const currentProvider = getProvider();
    try {
      const { chainId } = await currentProvider.getNetwork();
      chainChangedHandler(chainId);
    } catch (err) {
      setError('Something went wrong. Please try again');
    }
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
