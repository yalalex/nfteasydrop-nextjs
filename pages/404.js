import { useEffect } from 'react';

import { useRouter } from 'next/router';
import Head from 'next/head';

import { Fade, Typography } from '@mui/material';

const Error = () => {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      router.push('/');
    }, 3000);
  }, [router]);

  return (
    <>
      <Head>
        <title>Not found</title>
      </Head>
      <Fade in={true} {...{ timeout: 1000 }}>
        <Typography variant='h5' component='h2' className='not-found'>
          This page is not found. <br />
          You will be redirected to the main page in a few seconds...
        </Typography>
      </Fade>
    </>
  );
};

export default Error;
