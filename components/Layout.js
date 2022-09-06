import { useContext, useEffect } from 'react';

import Alert from './Alert';
import Navbar from './Navbar';

import { Context } from '../context/context';

const Layout = ({ children }) => {
  const { chainChangedHandler, accountChangedHandler } = useContext(Context);

  useEffect(() => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      const { ethereum } = window;

      // ethereum.on('connect', chainChangedHandler);

      ethereum.on('accountsChanged', (accounts) =>
        accountChangedHandler(accounts[0])
      );

      ethereum.on('chainChanged', chainChangedHandler);

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
