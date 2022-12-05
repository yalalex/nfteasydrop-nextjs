import { Container } from '@mui/material';

import PageContainer from '../components/Layout/PageContainer';
import QA from '../components/QA';

import faq from '../data/faq.json';

const title = 'NFT Easy Drop - send your tokens to multiple addresses | FAQ';
const description = {
  h1: 'FAQ',
};

const Faq = () => {
  return (
    <PageContainer title={title} description={description}>
      <Container
        maxWidth='md'
        sx={{
          marginTop: -1,
          textAlign: 'start',
        }}
      >
        {faq.map((q) => (
          <QA key={q.id} q={q} />
        ))}
      </Container>
    </PageContainer>
  );
};

export default Faq;
