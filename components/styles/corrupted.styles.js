import { makeStyles } from '@mui/styles';

export const corruptedStyles = makeStyles({
  content: {},
  title: { padding: '15px 0px 5px 0px', fontWeight: 'bold' },
  paper: { padding: 10, fontSize: 14 },
  closeButton: {
    position: 'absolute',
    color: 'grey',
    right: 10,
  },
  entry: {
    '&:hover': {
      cursor: 'pointer',
    },
  },
});
