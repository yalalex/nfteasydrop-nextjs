import { useContext } from 'react';

import { alertStyles } from './styles/alert.styles';

import { Context } from '../context/context';

import { Alert as Error } from '@mui/material';

const Alert = () => {
  const classes = alertStyles();

  const { errorMessage } = useContext(Context);

  return (
    errorMessage && (
      <div className={classes.container}>
        <Error variant='filled' severity='info' className={classes.error}>
          {errorMessage}
        </Error>
      </div>
    )
  );
};

export default Alert;
