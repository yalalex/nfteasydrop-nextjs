import { useContext, useEffect } from 'react';

import Alert from './Alert';

import { Context } from '../context/context';

import dynamic from 'next/dynamic';

const DynamicNavbar = dynamic(() => import('./Navbar'), {
  ssr: false,
});

const Layout = ({ children }) => {
  const { chainDetect, accountChangedHandler } = useContext(Context);

  useEffect(() => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      const { ethereum } = window;

      ethereum.on('connect', chainDetect);

      ethereum.on('accountsChanged', (accounts) =>
        accountChangedHandler(accounts[0])
      );

      ethereum.on('chainChanged', (chainId) => chainDetect({ chainId }));

      return () => ethereum.removeAllListeners();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <DynamicNavbar />
      {children}
      <Alert />
    </>
  );
};

export default Layout;
