import { useEffect } from 'react';

import { useDispatch } from 'react-redux';

import Alert from './Alert';
import Navbar from './Navbar';

import { chainChangedHandler, accountChangedHandler } from '../redux/funcs';

const Layout = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      const { ethereum } = window;

      // ethereum.on('connect', chainChangedHandler);

      ethereum.on('accountsChanged', (accounts) =>
        dispatch(accountChangedHandler(accounts[0]))
      );

      ethereum.on('chainChanged', (chainId) =>
        dispatch(chainChangedHandler(chainId))
      );

      return () => ethereum.removeAllListeners();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Navbar />
      <Alert />
      {children}
    </>
  );
};

export default Layout;
