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
    '&:not(:last-of-type)': {
      color: 'rgba(255, 255, 255, 1)',
    },
    '&:last-of-type': {
      color: 'rgba(255, 255, 255, 1)',
    },
  },
}));

const Home = () => {
  const [tokenType, setTokenType] = useState('erc721');

  const handleChange = (e) => {
    setTokenType(e.target.value);
  };

  return (
    <>
      <Head>
        <title>
          NFT Easy Drop - send your tokens to multiple addresses | Home
        </title>
      </Head>
      <Fade in={true} {...{ timeout: 1000 }}>
        <div className='page-container'>
          <Typography variant='h3' component='h1'>
            Welcome to NFT Easy Drop
          </Typography>
          <br />
          <Typography variant='h6' component='h2' sx={{ marginTop: -2 }}>
            Our dApp allows you to send NFT tokens to multiple addresses in just
            one transaction
          </Typography>
          <div className='switcher'>
            <StyledToggleButtonGroup
              color='primary'
              value={tokenType}
              exclusive
              onChange={handleChange}
            >
              <ToggleButton value='erc721'>ERC-721</ToggleButton>
              <ToggleButton value='erc1155'>ERC-1155</ToggleButton>
            </StyledToggleButtonGroup>
            <Form tokenType={tokenType} />
          </div>
        </div>
      </Fade>
    </>
  );
};

export default Home;
