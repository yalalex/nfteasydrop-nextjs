import { Close } from '@mui/icons-material';

import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
} from '@mui/material';

const Example = ({ closeModal, modalStatus }) => {
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
          <div className='title'>Data structure example</div>
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
            <div className='title'>ERC-721: address,id</div>
            <Paper elevation={3} className='paper'>
              <div>0x1CBd3b2770909D4e10f157cABC84C7264073C9Ec,0</div>
              <div>0xdF3e18d64BC6A983f673Ab319CCaE4f1a57C7097,1</div>
              <div>0xcd3B766CCDd6AE721141F452C550Ca635964ce71,2</div>
            </Paper>
            <div className='title'>ERC-1155: address,id,amount</div>
            <Paper elevation={3} className='paper'>
              <div>0x2546BcD3c84621e976D8185a91A922aE77ECEc30,0,2</div>
              <div>0xbDA5747bFD65F08deb54cb465eB87D40e51B197E,1,1</div>
              <div>0xdD2FD4581271e230360230F9337D5c0430Bf44C0,3,1</div>
            </Paper>
            <div className='title'>ERC-1155 single ID*: address</div>
            <Paper elevation={3} className='paper'>
              <div>0xBcd4042DE499D14e55001CcbB24a551F3b954096</div>
              <div>0x71bE63f3384f5fb98995898A86B02Fb2426c5788</div>
              <div>0xFABB0ac9d68B0B445fB7357272Ff202C5651694a</div>
            </Paper>
            <div className='footnote'>
              *ERC-1155 single ID mode is best for the case when you want to
              send NFT tokens with same ID and amount to all recipients
            </div>
          </div>
        </DialogContent>
      </div>
    </Dialog>
  );
};

export default Example;
