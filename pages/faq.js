import Head from 'next/head';

import QA from '../components/QA';

import { Container, Typography, Fade } from '@mui/material';

import faq from '../data/faq.json';

const Faq = () => {
  return (
    <>
      <Head>
        <title>
          NFT Easy Drop - send your tokens to multiple addresses | FAQ
        </title>
      </Head>
      <Fade in={true} {...{ timeout: 1000 }}>
        <div className='page-container'>
          <Typography variant='h3' component='h1' color='#fff'>
            FAQ
          </Typography>
          <Container
            maxWidth='md'
            sx={{
              marginTop: 3,
              textAlign: 'start',
            }}
          >
            {faq.map((q) => (
              <QA key={q.id} q={q} />
            ))}
          </Container>
        </div>
      </Fade>
    </>
  );
};

export default Faq;
