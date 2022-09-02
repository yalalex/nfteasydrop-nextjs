import { useContext } from 'react';

import { Context } from '../context/context';

import { Alert as Error } from '@mui/material';

const Alert = () => {
  const { errorMessage } = useContext(Context);

  return (
    errorMessage && (
      <div className='alert-container'>
        <Error variant='filled' severity='info' className='error'>
          {errorMessage}
        </Error>
      </div>
    )
  );
};

export default Alert;
