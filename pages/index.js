import { useState } from 'react';

import { Paper, ToggleButtonGroup, ToggleButton } from '@mui/material';

import dynamic from 'next/dynamic';

const DynamicForm = dynamic(() => import('../components/Form'), {
  ssr: false,
});

const Home = () => {
  const [tokenType, setTokenType] = useState('721');

  const handleChange = (e) => {
    setTokenType(e.target.value);
  };

  return (
    <div style={{ paddingTop: 120, textAlign: 'center' }}>
      <ToggleButtonGroup
        color='primary'
        value={tokenType}
        exclusive
        onChange={handleChange}
      >
        <ToggleButton value='721'>ERC-721</ToggleButton>
        <ToggleButton value='1155'>ERC-1155</ToggleButton>
      </ToggleButtonGroup>
      <Paper
        elevation={3}
        style={{
          maxWidth: 760,
          minHeight: 270,
          textAlign: 'center',
          margin: 'auto',
          marginTop: 2,
          padding: 50,
        }}
      >
        <DynamicForm tokenType={tokenType} />
      </Paper>
    </div>
  );
};

export default Home;
