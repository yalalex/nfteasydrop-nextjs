import { useSelector } from 'react-redux';
import { connectWalletHandler, changeChain, setAlert } from '../../redux/funcs';

import { Box, Button, CircularProgress } from '@mui/material';

import { truncate } from '../../utils/truncate';
import { chainList } from '../../config';

import Dropdown from './Dropdown';

const Buttons = () => {
  const { defaultAccount, chain, loading } = useSelector(
    (state) => state.wallet
  );

  const switchChain = (newChainId) => {
    if (!defaultAccount) return setAlert('Please connect your wallet first');
    changeChain(newChainId);
  };

  const connect = () => {
    if (defaultAccount) return;
    if (window.ethereum && window.ethereum.isMetaMask) connectWalletHandler();
    else setAlert('Please install MetaMask browser extension to interact');
  };

  return (
    <>
      {chain && (
        <Box className='switch-button' sx={{ mt: { sm: 0.3, md: 2 } }}>
          <Dropdown
            array={chainList}
            current={chain}
            select={switchChain}
            loading={loading === 'chain'}
          />
        </Box>
      )}
      <Button
        className='connect-button'
        size='small'
        onClick={connect}
        color='secondary'
        variant='outlined'
        disabled={loading === 'account'}
        sx={{ mt: { sm: 0.3, md: 2 } }}
      >
        {!defaultAccount ? (
          loading === 'account' ? (
            <CircularProgress color='secondary' size={25} />
          ) : (
            'Connect'
          )
        ) : (
          truncate(defaultAccount)
        )}
      </Button>
    </>
  );
};

export default Buttons;
