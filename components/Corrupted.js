import { corruptedStyles } from './styles/corrupted.styles';

import { Close } from '@mui/icons-material';

import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
} from '@mui/material';

const CorruptedData = ({ data, closeModal, modalStatus }) => {
  const classes = corruptedStyles();

  return (
    <Dialog
      open={modalStatus}
      onClose={closeModal}
      scroll='body'
      fullWidth={true}
      maxWidth={'md'}
    >
      <DialogTitle style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div
          style={{ justifyContent: 'flex-start', fontSize: 18, paddingTop: 7 }}
        >
          List of corrupted addresses
        </div>
        <div style={{ justifyContent: 'flex-end' }}></div>
        <IconButton
          aria-label='close'
          className={classes.closeButton}
          onClick={closeModal}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers={true}>
        <div className={classes.content}>
          {data.invalidValues && data.invalidValues.length > 0 && (
            <>
              <div className={classes.title}>
                Rows containing invalid values:{' '}
              </div>

              <Paper className={classes.paper}>
                {data.invalidValues.map((row, i) => (
                  <div key={i}>{row}</div>
                ))}
              </Paper>
            </>
          )}
          {data.wrongValuesNumber && data.wrongValuesNumber.length > 0 && (
            <>
              <div className={classes.title}>
                Rows with wrong number of values:{' '}
              </div>

              <Paper className={classes.paper}>
                {data.wrongValuesNumber.map((row, i) => (
                  <div key={i}>{row}</div>
                ))}
              </Paper>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CorruptedData;
