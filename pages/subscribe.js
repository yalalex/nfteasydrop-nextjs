import { useContext, useState } from 'react';

import { ethers } from 'ethers';

import { Button, Card, Grid } from '@mui/material';

import { Context } from '../context/context';

import { plans } from '../config';

const Subscribe = () => {
  const { airdropContract, setError } = useContext(Context);

  const [plan, setPlan] = useState('');

  const subscribe = async () => {
    try {
      await airdropContract.subscribe({
        value: ethers.utils.parseEther(plan),
      });
    } catch (error) {
      setError('Something went wrong');
    }
  };

  return (
    <Grid
      container
      paddingTop={12}
      maxWidth={{ sm: 480, md: 960 }}
      direction='row'
      justifyContent='center'
      alignItems='center'
      margin={'auto'}
      spacing={2}
      className='grid-container'
    >
      {plans.map((selection) => (
        <Grid item xs={12} sm={6} md={3} key={selection.price} className='grid'>
          <Card elevation={3} className='card'>
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
  );
};

export default Subscribe;
