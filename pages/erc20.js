import Head from 'next/head';

import Form from '../components/Form';

import { Fade, Typography } from '@mui/material';

const Home = () => {
  return (
    <>
      <Head>
        <title>
          NFT Easy Drop - send your tokens to multiple addresses | ERC-20
        </title>
      </Head>
      <Fade in={true} {...{ timeout: 1000 }}>
        <div className='page-container'>
          <Typography variant='h3' component='h1'>
            New feature!
          </Typography>
          <br />
          <Typography variant='h6' component='h2' sx={{ marginTop: -2 }}>
            Our dApp now allows you to airdrop ERC-20 tokens to multiple
            addresses
          </Typography>
          <div className='switcher'>
            <Form tokenType={'erc20'} />
          </div>
        </div>
      </Fade>
    </>
  );
};

export default Home;
