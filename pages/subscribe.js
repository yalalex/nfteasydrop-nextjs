import { useContext, useState, useEffect } from 'react';

import { ethers } from 'ethers';

import { Button, Card, Grid, Fade } from '@mui/material';

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
    <Fade in={true} {...{ timeout: 1000 }}>
      <div>
        <Grid
          container
          paddingTop={13}
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
                <div className='price'>{selection.period}</div>
                <div>{selection.price} Eth</div>
                <div>
                  <Button
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
        <div style={{ marginTop: 20, color: '#fff', textAlign: 'center' }}>
          Please note that Subscription option currently supported only for
          transactions made on Ethereum Mainnet
        </div>
      </div>
    </Fade>
  );
};

export default Subscribe;
