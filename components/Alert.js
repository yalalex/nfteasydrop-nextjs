import { useContext } from 'react';

import { Context } from '../context/context';

import { Alert as Error, Grow } from '@mui/material';

const Alert = () => {
  const { error } = useContext(Context);

  return (
    error && (
      <Grow in={true} {...{ timeout: 500 }}>
        <div className='alert-container'>
          <Error variant='filled' severity={error.type} className='error'>
            {error.message}
          </Error>
        </div>
      </Grow>
    )
  );
};

export default Alert;
