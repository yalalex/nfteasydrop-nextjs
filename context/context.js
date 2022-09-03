import { useReducer, createContext } from 'react';

import { ethers } from 'ethers';

import { chainDetector } from '../utils/chain-detect';

import Airdrop from '../utils/AirdropABI.json';

import { airdropContractAddress, chainList, langList } from '../config';

const INITIAL_STATE = {
  defaultAccount: '',
  signer: null,
  chain: chainList[0],
  // chainId: '',
  // chain: 'Mainnet',
  // chainIcon: '/ethereum.svg',
  airdropContract: null,
  lang: langList[0],
  loading: false,
  errorMessage: '',
};

const ACTION_TYPES = {
  SET_SIGNER: 'SET_SIGNER',
  SET_ACCOUNT: 'SET_ACCOUNT',
  SET_CHAIN: 'SET_CHAIN',
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
        airdropContract: payload.contract,
      };
    case ACTION_TYPES.SET_ACCOUNT:
      return {
        ...state,
        defaultAccount: payload,
        loading: false,
      };
    case ACTION_TYPES.SET_CHAIN:
      return {
        ...state,
        chain: payload,
        // chainId: payload.chainId,
        // chain: payload.chain,
        // chainIcon: payload.chainIcon,
        loading: false,
      };
    case ACTION_TYPES.SET_LANG:
      return {
        ...state,
        lang: payload,
      };
    case ACTION_TYPES.SET_ERROR:
      return {
        ...state,
        errorMessage: payload,
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
  // chainId: '',
  // chain: '',
  // chainIcon: '',
  lang: null,
  airdropContract: null,
  loading: false,
  errorMessage: '',
  connectWalletHandler: () => {},
  accountChangedHandler: () => {},
  chainDetect: () => {},
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
    // chainId,
    // chainIcon,
    airdropContract,
    lang,
    loading,
    errorMessage,
  } = state;

  const chainDetect = ({ chainId }) => {
    console.log('chainDetect');
    const chain = chainDetector(chainId);
    dispatch({
      type: ACTION_TYPES.SET_CHAIN,
      payload: chain,
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
      const contract = new ethers.Contract(
        airdropContractAddress,
        Airdrop,
        signer
      );
      dispatch({
        type: ACTION_TYPES.SET_SIGNER,
        payload: { signer, contract },
      });
      accountChangedHandler(account);
    } else {
      setError('Please install MetaMask browser extension to interact');
    }
  };

  const accountChangedHandler = (newAccount) => {
    console.log('accountChangedHandler');
    // chainDetect();
    if (newAccount) {
      dispatch({
        type: ACTION_TYPES.SET_ACCOUNT,
        payload: newAccount,
      });
    } else setError('Please connect Metamask');
  };

  const changeChain = async (chainId, newChainId) => {
    if (chainId !== newChainId) {
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

  const setError = (error) => {
    // let err;
    // err = type === 'global' ? errorFormat(error) : error;
    dispatch({ type: ACTION_TYPES.SET_ERROR, payload: error });
    setTimeout(
      () => dispatch({ type: ACTION_TYPES.SET_ERROR, payload: '' }),
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
    // chainId,
    // chainIcon,
    airdropContract,
    lang,
    loading,
    errorMessage,
    chainDetect,
    changeChain,
    connectWalletHandler,
    accountChangedHandler,
    changeLang,
    setError,
    setLoading,
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
};
