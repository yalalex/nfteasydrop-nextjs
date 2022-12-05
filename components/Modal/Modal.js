import { Close } from '@mui/icons-material';

import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';

import ModalContent from './ModalContent';

import { examples } from '../../data/examples';

const Modal = ({
  closeModal,
  modalStatus,
  title,
  example = true,
  data = examples,
}) => {
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
          <div className='title'>{title}</div>
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
            {example ? (
              data.map((content, i) => (
                <ModalContent key={i} content={content} example={example} />
              ))
            ) : (
              <ModalContent content={data} example={example} />
            )}
            {example && (
              <div className='footnote'>
                *ERC-1155 single ID mode is best for the case when you want to
                send NFTs with same ID and amount to all recipients
                <br />
                **ERC-20 same amount mode is best for the case when you want to
                send same amount of tokens to all recipients
              </div>
            )}
          </div>
        </DialogContent>
      </div>
    </Dialog>
  );
};

export default Modal;
