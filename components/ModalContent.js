import { Paper } from '@mui/material';

const ModalContent = ({ content, example }) => {
  return (
    <>
      <div className='title'>
        {example ? content.title : 'Rows containing invalid values:'}
      </div>
      <Paper
        elevation={3}
        className='paper'
        sx={{ fontSize: { xs: 12, sm: 14 } }}
      >
        {example
          ? content.data.map((line, i) => <div key={i}>{line}</div>)
          : content.map((line, i) => <div key={i}>{line}</div>)}
      </Paper>
    </>
  );
};

export default ModalContent;
