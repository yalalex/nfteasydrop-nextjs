import { useSelector } from 'react-redux';

import { Alert as AlertPopup, Grow } from '@mui/material';

const Alert = () => {
  const alert = useSelector((state) => state.wallet.alert);

  return (
    alert && (
      <Grow in={true} {...{ timeout: 500 }}>
        <div className='alert-container'>
          <AlertPopup variant='filled' severity={alert.type} className='alert'>
            {alert.message}
          </AlertPopup>
        </div>
      </Grow>
    )
  );
};

export default Alert;
