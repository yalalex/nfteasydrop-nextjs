import Head from 'next/head';

import { Fade, Typography } from '@mui/material';

const PageContainer = ({ title, description, subnote, children }) => {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <Fade in={true} {...{ timeout: 1000 }}>
        <div className='page-container'>
          {description.h1 && (
            <Typography variant='h3' component='h1'>
              {description.h1}
            </Typography>
          )}
          <br />
          {description.h2 && (
            <Typography variant='h6' sx={{ marginTop: -2 }}>
              {description.h2.map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            </Typography>
          )}
          {children}
          {subnote && (
            <div className='sub-note'>
              {subnote.map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            </div>
          )}
        </div>
      </Fade>
    </>
  );
};

export default PageContainer;
