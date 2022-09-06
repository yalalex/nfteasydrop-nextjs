import { useState } from 'react';

import Form from '../components/Form';

import { Paper, ToggleButtonGroup, ToggleButton, Fade } from '@mui/material';

const Home = () => {
  const [tokenType, setTokenType] = useState('721');

  const handleChange = (e) => {
    setTokenType(e.target.value);
  };

  return (
    <Fade in={true} {...{ timeout: 1000 }}>
      <div className='switcher'>
        <ToggleButtonGroup
          color='primary'
          value={tokenType}
          exclusive
          onChange={handleChange}
        >
          <ToggleButton value='721'>ERC-721</ToggleButton>
          <ToggleButton value='1155'>ERC-1155</ToggleButton>
        </ToggleButtonGroup>
        <Paper elevation={3} className='form-container'>
          <Form tokenType={tokenType} />
        </Paper>
      </div>
    </Fade>
  );
};

export default Home;
