import { useContext, useState } from 'react';

import { ethers } from 'ethers';

import { Button, Card, Grid } from '@mui/material';

import { Context } from '../context/context';

import { plans } from '../config';

const Subscribe = () => {
  const { airdropContract, errorHandler } = useContext(Context);

  const [plan, setPlan] = useState('');

  const subscribe = async () => {
    try {
      await airdropContract.subscribe({
        value: ethers.utils.parseEther(plan),
      });
    } catch (error) {
      errorHandler('Something went wrong');
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
    >
      {plans.map((selection) => (
        <Grid
          item
          xs={12}
          sm={6}
          md={3}
          key={selection.price}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Card
            elevation={3}
            style={{
              width: 195,
              // width: '100%',
              textAlign: 'center',
              padding: 15,
              display: 'flex',
              flexDirection: 'column',
              marginLeft: -24,
            }}
          >
            <div style={{ paddingBottom: 10 }}>{selection.period}</div>
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
