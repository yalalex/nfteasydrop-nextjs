import { useEffect } from 'react';

import { useRouter } from 'next/router';
import Head from 'next/head';

import { Fade } from '@mui/material';

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
        <h2 className='not-found'>
          This page is not found. <br />
          You will be redirected Home in a few seconds...
        </h2>
      </Fade>
    </>
  );
};

export default Error;
