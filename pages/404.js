import { useEffect } from 'react';

import { useRouter } from 'next/router';

import PageContainer from '../components/PageContainer';

const title =
  'NFT Easy Drop - send your tokens to multiple addresses | Not found';
const description = {
  h2: [
    'This page is not found.',
    'You will be redirected to the main page in a few seconds...',
  ],
};

const Error = () => {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      router.push('/');
    }, 3000);
  }, [router]);

  return (
    <PageContainer title={title} description={description}></PageContainer>
  );
};

export default Error;
