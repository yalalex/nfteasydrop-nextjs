import { makeStyles } from '@mui/styles';

export const formStyles = makeStyles({
  form: {
    maxWidth: 640,
    textAlign: 'center',
    margin: 'auto',
  },
  link: {
    textDecoration: 'underline',
    '&:hover': {
      cursor: 'pointer',
      // color: '#0288d1',
      textDecoration: 'none',
    },
  },
  pointer: {
    '&:hover': {
      cursor: 'pointer',
      // color: '#0288d1',
      textDecoration: 'underline',
    },
  },
  text: {
    color: '#1976d2',
    fontSize: 12,
  },
  example: {
    width: '20%',
    // paddingTop: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  formElement: {
    marginBottom: 10,
  },
});
