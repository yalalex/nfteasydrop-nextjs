import { useState } from 'react';

import PageContainer from '../components/Layout/PageContainer';
import Form from '../components/Form/Form';

import { ToggleButtonGroup, ToggleButton } from '@mui/material';

import { styled } from '@mui/material/styles';

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  '& .MuiToggleButtonGroup-grouped': {
    width: 100,
    fontSize: 16,
    '&:not(:last-of-type)': {
      color: 'rgba(255, 255, 255, 1)',
    },
    '&:last-of-type': {
      color: 'rgba(255, 255, 255, 1)',
    },
  },
}));

const title = 'NFT Easy Drop - send your tokens to multiple addresses | Home';
const description = {
  h1: 'Welcome to NFT Easy Drop',
  h2: [
    'Our dApp allows you to send NFTs to multiple addresses with a single transaction',
  ],
};

const Home = () => {
  const [tokenType, setTokenType] = useState('erc721');

  const handleChange = (e) => {
    setTokenType(e.target.value);
  };

  return (
    <PageContainer title={title} description={description}>
      <div className='switcher'>
        <StyledToggleButtonGroup
          color='primary'
          value={tokenType}
          exclusive
          onChange={handleChange}
        >
          <ToggleButton value='erc721'>ERC-721</ToggleButton>
          <ToggleButton value='erc1155'>ERC-1155</ToggleButton>
        </StyledToggleButtonGroup>
        <Form tokenType={tokenType} />
      </div>
    </PageContainer>
  );
};

export default Home;
