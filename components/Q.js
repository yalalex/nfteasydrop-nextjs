import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Divider,
} from '@mui/material';

const Q = ({ q }) => {
  return (
    <Accordion sx={{ my: 2, borderRadius: 1 }}>
      <AccordionSummary
        sx={{ bgcolor: 'rgb(0,0,0,0.05)' }}
        expandIcon={<ExpandMoreIcon color='secondary' />}
      >
        <Typography variant='h6' component='h3'>
          {q.question}
        </Typography>
      </AccordionSummary>
      <Divider />
      <AccordionDetails>
        <Typography
          marginTop={1}
          sx={{
            whiteSpace: 'pre-wrap',
          }}
        >
          {q.answer}
        </Typography>
      </AccordionDetails>
    </Accordion>
  );
};

export default Q;
