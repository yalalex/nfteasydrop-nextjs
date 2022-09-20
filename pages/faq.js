import Head from 'next/head';

import Q from '../components/Q';

import { Container, Typography, Fade } from '@mui/material';

export const getStaticProps = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/faq'); // test local env address
    const data = await response.json();

    if (!data) {
      return {
        notFound: true,
      };
    }

    return {
      props: { faq: data },
    };
  } catch {
    return {
      props: { faq: null },
    };
  }
};

const Faq = ({ faq }) => {
  return (
    <>
      <Head>
        <title>FAQ</title>
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
              <Q key={q.id} q={q} />
            ))}
          </Container>
        </div>
      </Fade>
    </>
  );
};

export default Faq;
