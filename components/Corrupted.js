import { Close } from '@mui/icons-material';

import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
} from '@mui/material';

const CorruptedData = ({ data, closeModal, modalStatus }) => {
  return (
    <Dialog
      open={modalStatus}
      onClose={closeModal}
      scroll='body'
      fullWidth={true}
      maxWidth={'sm'}
      className='dialog'
    >
      <div className='dialog-container'>
        <DialogTitle className='title-container'>
          <div className='title'>Removed Rows</div>
          <div className='button-container'>
            <IconButton
              aria-label='close'
              className='close-button'
              onClick={closeModal}
            >
              <Close />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent dividers={true} className='content'>
          <div>
            {data.length > 0 && (
              <>
                <div className='title'>Rows containing invalid values: </div>

                <Paper className='paper'>
                  {data.map((row, i) => (
                    <div key={i}>{row}</div>
                  ))}
                </Paper>
              </>
            )}
            {/* {data.wrongValuesNumber && data.wrongValuesNumber.length > 0 && (
              <>
                <div className='title'>Rows with wrong number of values: </div>

                <Paper className='paper'>
                  {data.wrongValuesNumber.map((row, i) => (
                    <div key={i}>{row}</div>
                  ))}
                </Paper>
              </>
            )} */}
          </div>
        </DialogContent>
      </div>
    </Dialog>
  );
};

export default CorruptedData;
