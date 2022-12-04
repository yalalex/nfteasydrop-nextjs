import { Box } from '@mui/material';
import Image from 'next/image';

const TutorialStep = ({ text, img, id }) => {
  return (
    <li>
      {text}
      <Box
        className='tutorial-image'
        sx={{
          width: {
            sm: '100%',
            md: id === 1 ? '60%' : '80%',
          },
        }}
      >
        <Image src={img} alt={id} placeholder='blur' />
      </Box>
    </li>
  );
};

export default TutorialStep;
