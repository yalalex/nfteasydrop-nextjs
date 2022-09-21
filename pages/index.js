import { useState } from 'react';

import Head from 'next/head';

import Form from '../components/Form';

import {
  ToggleButtonGroup,
  ToggleButton,
  Fade,
  Typography,
} from '@mui/material';

import { styled } from '@mui/material/styles';

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  '& .MuiToggleButtonGroup-grouped': {
    width: 100,
    fontSize: 16,
    color: 'rgba(255, 255, 255, 1)',
    '&.Mui-disabled': {
      color: 'rgba(255, 255, 255, 1)',
    },
    '&.Mui-selected': {
      color: 'rgba(255, 255, 255, 1)',
    },
    '&:not(:first-of-type)': {
      color: 'rgba(255, 255, 255, 1)',
    },
    '&:first-of-type': {
      color: 'rgba(255, 255, 255, 1)',
    },
    '&:not(:last-of-type)': {
      color: 'rgba(255, 255, 255, 1)',
    },
    '&:last-of-type': {
      color: 'rgba(255, 255, 255, 1)',
    },
  },
}));

const Home = () => {
  const [tokenType, setTokenType] = useState('721');

  const handleChange = (e) => {
    setTokenType(e.target.value);
  };

  return (
    <>
      <Head>
        <title>Welcome to NFT Easy Drop</title>
      </Head>
      <Fade in={true} {...{ timeout: 1000 }}>
        <div className='page-container'>
          <Typography variant='h3' component='h1'>
            Welcome to NFT Easy Drop
          </Typography>
          <Typography variant='h5' component='h2'>
            Our dApp allows you to send NFT tokens to multiple addresses in just
            one easy step
          </Typography>
          <div className='switcher'>
            <StyledToggleButtonGroup
              color='primary'
              value={tokenType}
              exclusive
              onChange={handleChange}
            >
              <ToggleButton value='721'>ERC-721</ToggleButton>
              <ToggleButton value='1155'>ERC-1155</ToggleButton>
            </StyledToggleButtonGroup>
            <Form tokenType={tokenType} />
          </div>
        </div>
      </Fade>
    </>
  );
};

export default Home;
