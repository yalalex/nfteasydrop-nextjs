import PageContainer from '../components/PageContainer';

import Form from '../components/Form';

const title = 'NFT Easy Drop - send your tokens to multiple addresses | ERC-20';
const description = {
  h1: 'New feature!',
  h2: ['Our dApp now allows you to send ERC-20 tokens to multiple addresses*'],
};
const subnote = ['*Please note this feature is still in beta'];

const Home = () => {
  return (
    <PageContainer title={title} description={description} subnote={subnote}>
      <div className='switcher'>
        <Form tokenType={'erc20'} />
      </div>
    </PageContainer>
  );
};

export default Home;
