import { makeStyles } from '@mui/styles';

export const exampleStyles = makeStyles({
  title: { padding: '15px 0px 5px 0px', fontWeight: 'bold' },
  paper: { padding: 10, fontSize: 14 },
  footnote: {
    paddingTop: 15,
    fontSize: 12,
    fontStyle: 'italic',
  },
  closeButton: {
    position: 'absolute',
    color: 'grey',
    right: 10,
  },
});
