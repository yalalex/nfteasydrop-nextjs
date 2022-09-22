import Head from 'next/head';

import Q from '../components/Q';

import { Container, Typography, Fade } from '@mui/material';

import faq from '../pages/api/data/faq.json';

// export const getStaticProps = async () => {
//   try {
//     const response = await fetch(`${process.env.API_HOST}/faq`);
//     const data = await response.json();

//     if (!data) {
//       return {
//         notFound: true,
//       };
//     }

//     return {
//       props: { faq: data },
//     };
//   } catch {
//     return {
//       props: { faq: null },
//     };
//   }
// };

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
              <Q key={q.id} q={q} />
            ))}
          </Container>
        </div>
      </Fade>
    </>
  );
};

export default Faq;
