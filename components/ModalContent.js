import { Paper } from '@mui/material';

const ModalContent = ({ content, example = true }) => {
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
        {content.data.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </Paper>
    </>
  );
};

export default ModalContent;
