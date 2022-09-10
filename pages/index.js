import { useState } from 'react';

import Head from 'next/head';

import Form from '../components/Form';

import { Paper, ToggleButtonGroup, ToggleButton, Fade } from '@mui/material';

const Home = () => {
  const [tokenType, setTokenType] = useState('721');

  const handleChange = (e) => {
    setTokenType(e.target.value);
  };

  return (
    <>
      <Head>
        <title>Welcome</title>
      </Head>
      <Fade in={true} {...{ timeout: 1000 }}>
        <div className='page-container'>
          <h1>Welcome to NFT Easy Drop</h1>
          <h2>
            Our app allows you to send your NFT tokens to multiple addresses in
            1 easy step
          </h2>
          <div className='switcher'>
            <ToggleButtonGroup
              color='primary'
              value={tokenType}
              exclusive
              onChange={handleChange}
            >
              <ToggleButton value='721' className='option'>
                ERC-721
              </ToggleButton>
              <ToggleButton value='1155' className='option'>
                ERC-1155
              </ToggleButton>
            </ToggleButtonGroup>
            <Paper elevation={5} className='form-container'>
              <Form tokenType={tokenType} />
            </Paper>
          </div>
        </div>
      </Fade>
    </>
  );
};

export default Home;
