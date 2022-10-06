import { useSelector } from 'react-redux';

import { Alert as Error, Grow } from '@mui/material';

const Alert = () => {
  const error = useSelector((state) => state.wallet.error);

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
