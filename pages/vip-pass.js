import { useState, useEffect } from 'react';

import { useSelector } from 'react-redux';

import { changeChain, setAlert } from '../redux/funcs';

import PageContainer from '../components/PageContainer';

import { ethers } from 'ethers';

import { Button, Card, Grid, Typography } from '@mui/material';

import { minedListener } from '../utils/mined-listener';

import { plans } from '../config';

const title =
  'NFT Easy Drop - send your tokens to multiple addresses | VIP Pass';
const description = {
  h2: [
    'VIP Pass allows you to send NFTs and ERC-20 tokens using our dApp for free for the selected period of time*',
    'No limit to the amount of transactions!',
  ],
};
const subnote = [
  'Please note that VIP Pass is currently available only on Ethereum Mainnet',
  '*You will still have to pay network fees',
];

const Subscribe = () => {
  const { provider, airdropContract, chain, defaultAccount } = useSelector(
    (state) => state.wallet
  );

  useEffect(() => setPlan(''), [defaultAccount]);

  const [plan, setPlan] = useState('');
  const [loading, setLoading] = useState(false);

  const subscribe = async () => {
    if (!defaultAccount) return setAlert('Please connect your wallet');
    if (chain.id !== '0x1' && chain.id !== '0x5') {
      setAlert('Please switch to Ethereum Mainnet to purchase VIP pass');
      return changeChain('0x1');
    }
    setLoading(true);
    try {
      const transactionResponse = await airdropContract.subscribe({
        value: ethers.utils.parseEther(plan),
      });
      await minedListener(transactionResponse, provider);
      setAlert('VIP Pass purchase is successful', 'success');
      setLoading(false);
    } catch (error) {
      setAlert(
        error.code === 'INSUFFICIENT_FUNDS'
          ? 'Please make sure you have enough funds in your account'
          : 'Something went wrong'
      );
      setLoading(false);
    }
  };

  return (
    <PageContainer title={title} description={description} subnote={subnote}>
      <Grid
        container
        paddingTop={2}
        maxWidth={{ sm: 480, md: 960 }}
        direction='row'
        justifyContent='center'
        alignItems='center'
        margin={'auto'}
        spacing={2}
        className='grid-container'
      >
        {plans.map((selection) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={3}
            key={selection.price}
            className='grid'
          >
            <Card elevation={5} className='card'>
              <Typography variant='h5' component='h2' marginTop={2}>
                {selection.period.toUpperCase()}
              </Typography>
              <Typography variant='h4' component='h1' marginY={2}>
                {selection.price} ETH
              </Typography>
              <div>
                <Button
                  disabled={loading}
                  size='large'
                  color='success'
                  variant='text'
                  onClick={() =>
                    selection.price === plan
                      ? subscribe()
                      : setPlan(selection.price)
                  }
                >
                  {selection.price === plan ? 'Purchase' : 'Select'}
                </Button>
              </div>
            </Card>
          </Grid>
        ))}
      </Grid>
    </PageContainer>
  );
};

export default Subscribe;
