import { Paper } from '@mui/material';

const Example = ({ example }) => {
  return (
    <>
      <div className='title'>{example.title}</div>
      <Paper
        elevation={3}
        className='paper'
        sx={{ fontSize: { xs: 12, sm: 14 } }}
      >
        {example.data.map((ex) => (
          <div key={ex}>{ex}</div>
        ))}
      </Paper>
    </>
  );
};

export default Example;
