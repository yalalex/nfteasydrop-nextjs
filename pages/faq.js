import { useEffect } from 'react';

import { useRouter } from 'next/router';
import Head from 'next/head';

import { Fade } from '@mui/material';

const Faq = () => {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      router.push('/');
    }, 3000);
  }, [router]);

  return (
    <>
      <Head>
        <title>FAQ</title>
      </Head>
      <Fade in={true} {...{ timeout: 1000 }}>
        <h3 className='not-found'>
          This page is under construction. <br />
          You will be redirected to the main page in a few seconds...
        </h3>
      </Fade>
    </>
  );
};

export default Faq;
