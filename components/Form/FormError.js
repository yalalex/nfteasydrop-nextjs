import CloseIcon from '@mui/icons-material/Close';
import { IconButton, Alert, Fade } from '@mui/material';

const FormError = ({ fn, severity = 'info', children }) => {
  return (
    <Fade in={true} {...{ timeout: 1000 }}>
      <Alert
        severity={severity}
        variant='filled'
        className='form-element'
        action={
          <IconButton
            aria-label='close'
            color='inherit'
            size='small'
            onClick={fn}
          >
            <CloseIcon fontSize='inherit' />
          </IconButton>
        }
      >
        {children}
      </Alert>
    </Fade>
  );
};

export default FormError;
