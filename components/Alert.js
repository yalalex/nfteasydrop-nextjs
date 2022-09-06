import { useContext } from 'react';

import { Context } from '../context/context';

import { Alert as Error } from '@mui/material';

const Alert = () => {
  const { error } = useContext(Context);

  return (
    error && (
      <div className='alert-container'>
        <Error variant='filled' severity={error.type} className='error'>
          {error.message}
        </Error>
      </div>
    )
  );
};

export default Alert;
