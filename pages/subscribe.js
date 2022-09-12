import { useContext, useState, useEffect } from 'react';

import Head from 'next/head';

import { ethers } from 'ethers';

import { Button, Card, Grid, Fade, Box, Typography } from '@mui/material';

import { Context } from '../context/context';

import { plans } from '../config';

const Subscribe = () => {
  const { airdropContract, chain, defaultAccount, changeChain, setError } =
    useContext(Context);

  useEffect(() => setPlan(''), [defaultAccount]);

  const [plan, setPlan] = useState('');

  const subscribe = async () => {
    if (!defaultAccount) return setError('Please connect your wallet');
    if (chain.id !== '0x1') {
      setError('Please switch to Ethereum Mainnet to subscribe');
      return changeChain('0x1');
    }
    try {
      await airdropContract.subscribe({
        value: ethers.utils.parseEther(plan),
      });
    } catch (error) {
      if (error.code === 'INSUFFICIENT_FUNDS') {
        setError(
          'You have insufficient funds in your wallet for completing this transaction'
        );
      } else setError('Something went wrong. Please try again');
    }
  };

  return (
    <>
      <Head>
        <title>Subscribe</title>
      </Head>
      <Fade in={true} {...{ timeout: 1000 }}>
        <div className='page-container'>
          <Typography variant='h5' component='h2'>
            Subscription allows you to send your NFT tokens with our dapp for
            free* <br />
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
                      size='large'
                      color='success'
                      variant='text'
                      onClick={() =>
                        selection.price === plan
                          ? subscribe()
                          : setPlan(selection.price)
                      }
                    >
                      {selection.price === plan ? 'Subscribe' : 'Select'}
                    </Button>
                  </div>
                </Card>
              </Grid>
            ))}
          </Grid>
          <div className='sub-note'>
            Please note that subscription is currently supported only for
            transactions made on Ethereum Mainnet <br />
            *You will still have to pay network fees
          </div>
        </div>
      </Fade>
    </>
  );
};

export default Subscribe;
