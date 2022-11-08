import { useState, useEffect } from 'react';

import { useSelector } from 'react-redux';

import { changeChain, setAlert } from '../redux/funcs';

import Head from 'next/head';

import { ethers } from 'ethers';

import { Button, Card, Grid, Fade, Typography } from '@mui/material';

import { minedListener } from '../utils/mined-listener';

import { plans } from '../config';

const Subscribe = () => {
  const { provider, airdropContract, chain, defaultAccount } = useSelector(
    (state) => state.wallet
  );

  useEffect(() => setPlan(''), [defaultAccount]);

  const [plan, setPlan] = useState('');
  const [loading, setLoading] = useState(false);

  const subscribe = async () => {
    if (!defaultAccount) return setAlert('Please connect your wallet');
    if (chain.id !== '0x1') {
      setAlert('Please switch to Ethereum Mainnet to subscribe');
      return changeChain('0x1');
    }
    setLoading(true);
    try {
      const transactionResponse = await airdropContract.subscribe({
        value: ethers.utils.parseEther(plan),
      });
      await minedListener(transactionResponse, provider);
      setAlert('Membership purchase is successful', 'success');
      setLoading(false);
    } catch (error) {
      if (error.code === -32000)
        setAlert(
          'You have insufficient funds in your wallet for completing this transaction'
        );
      else if (error.code === 4001)
        setAlert('Please switch to Ethereum Mainnet to subscribe');
      else setAlert('Please make sure you have enough funds in your account');
    }
    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>
          NFT Easy Drop - send your tokens to multiple addresses | Membership
        </title>
      </Head>
      <Fade in={true} {...{ timeout: 1000 }}>
        <div className='page-container'>
          <Typography variant='h5' component='h2'>
            Membership allows you to send NFT tokens using our dApp for free for
            the selected period of time*
            <br />
            No limit to the amount of transactions!
          </Typography>
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
          <div className='sub-note'>
            Please note that membership option is currently supported only for
            transactions made on Ethereum Mainnet <br />
            *You will still have to pay network fees
          </div>
        </div>
      </Fade>
    </>
  );
};

export default Subscribe;
