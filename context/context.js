import { useReducer, createContext } from 'react';

import { ethers } from 'ethers';

import { chainDetector } from '../utils/chain-detect';

import Airdrop from '../utils/AirdropABI.json';

import { airdropContractAddress } from '../config';

const INITIAL_STATE = {
  defaultAccount: '',
  signer: null,
  chainId: '',
  chain: 'Mainnet',
  airdropContract: null,
  loading: false,
  errorMessage: '',
};

const ACTION_TYPES = {
  SET_SIGNER: 'SET_SIGNER',
  SET_ACCOUNT: 'SET_ACCOUNT',
  SET_CHAIN: 'SET_CHAIN',
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
        chainId: payload.chainId,
        chain: payload.chain,
        loading: false,
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
  chainId: '',
  chain: '',
  airdropContract: null,
  loading: false,
  errorMessage: '',
  connectWalletHandler: () => {},
  accountChangedHandler: () => {},
  chainDetect: () => {},
  changeChain: () => {},
  errorHandler: () => {},
  setLoading: () => {},
});

export const Provider = ({ children }) => {
  const [state, dispatch] = useReducer(walletReducer, INITIAL_STATE);

  const {
    signer,
    defaultAccount,
    chainId,
    chain,
    airdropContract,
    loading,
    errorMessage,
  } = state;

  const chainDetect = ({ chainId }) => {
    console.log('chainDetect');
    const chainName = chainDetector(chainId);
    dispatch({
      type: ACTION_TYPES.SET_CHAIN,
      payload: { chainId, chain: chainName },
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
      errorHandler('Please install MetaMask browser extension to interact');
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
    } else errorHandler('Please connect Metamask');
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
          errorHandler(`Please add ${chainDetector(newChainId)} to MetaMask`);
        }
      }
    }
  };

  const errorHandler = (error) => {
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
    chainId,
    chain,
    airdropContract,
    loading,
    errorMessage,
    chainDetect,
    changeChain,
    connectWalletHandler,
    accountChangedHandler,
    errorHandler,
    setLoading,
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
};
