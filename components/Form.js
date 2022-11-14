import { useState, useEffect } from 'react';

import { useSelector } from 'react-redux';
import { connectWalletHandler, setAlert } from '../redux/funcs';

import CorruptedData from './Corrupted';
import Example from './Example';

import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';

import {
  Button,
  TextField,
  IconButton,
  Paper,
  Tooltip,
  Alert,
  Fade,
  CircularProgress,
} from '@mui/material';

import { ethers } from 'ethers';

import { csvToArray } from '../utils/convert-csv';
import { minedListener } from '../utils/mined-listener';

import { airdropContractAddress, txFee } from '../config';

import { styled } from '@mui/material/styles';
import { tooltipClasses } from '@mui/material/Tooltip';

const tokenAbi = [
  'function setApprovalForAll(address operator, bool approved)',
  'function approve(address operator, uint256 amount)',
];

const LightTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[1],
    fontSize: 11,
  },
}));

const Form = ({ tokenType }) => {
  const { provider, signer, airdropContract, defaultAccount, chain, loading } =
    useSelector((state) => state.wallet);

  const [token, setToken] = useState(''); // token contract address

  const [addressList, setAddressList] = useState('');
  const [rowCount, setRowCount] = useState(0);
  const [successAlert, setSuccessAlert] = useState(false);
  const [listError, setListError] = useState([]);
  const [lengthError, setLengthError] = useState(false);

  const [errorModal, setErrorModal] = useState(false);
  const [exampleModal, setExampleModal] = useState(false);

  const [drop, setDrop] = useState({ addresses: [], ids: [], amounts: [] });

  const [simple, setSimple] = useState(false);
  const [simpleDrop, setSimpleDrop] = useState({ tokenId: '', amount: '' });

  const [tokenContract, setTokenContract] = useState(null);
  const [isApproved, setIsApproved] = useState(false);

  const [erc20Sum, setErc20Sum] = useState(0);

  const [isChecked, setIsChecked] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);

  const [isValidContract, setIsValidContract] = useState(false);
  const [approvalLoading, setApprovalLoading] = useState(false);
  const [sendLoading, setSendLoading] = useState(false);

  useEffect(() => {
    if (signer && ethers.utils.isAddress(token)) {
      const tempTokenContract = new ethers.Contract(token, tokenAbi, signer);
      setTokenContract(tempTokenContract);
      setIsChecked(false);
    }
  }, [token, signer]);

  useEffect(() => {
    setSimple(false);
    setToken('');
    setIsChecked(false);
  }, [tokenType]);

  useEffect(() => {
    setToken('');
    setIsApproved(false);
  }, [chain]);

  useEffect(() => {
    if (airdropContract && ethers.utils.isAddress(token)) {
      tokenType !== 'erc20' ? checkNFTApproval() : checkERC20Allowance();
    }
  }, [defaultAccount, token]);

  useEffect(() => {
    if (airdropContract && ethers.utils.isAddress(token)) {
      checkERC20Allowance();
    }
  }, [erc20Sum]);

  const checkNFTApproval = async () => {
    setApprovalLoading(true);
    try {
      const approval = await airdropContract.isApproved(token);
      approval ? setIsApproved(true) : setIsApproved(false);
      setIsValidContract(true);
      setApprovalLoading(false);
    } catch (error) {
      setAlert('Please check that token address is a valid NFT contract');
      setIsValidContract(false);
      setApprovalLoading(false);
    }
    // try {
    //   const uri = await tokenContract.uri(tokenId);
    //   const info = await axios.get(uri);
    //   const imgPath = info.data.image.slice(7);
    //   const image = `https://ipfs.io/ipfs/${imgPath}`;
    //   setImg(image); //SET_IMAGE
    // } catch (error) {
    //   setAlert('Can not get token image');
    // }
  };

  const checkERC20Allowance = async () => {
    setApprovalLoading(true);
    try {
      const allowance = await airdropContract.checkAllowance(token);
      allowance.toString() >= erc20Sum && allowance.toString() > 0
        ? setIsApproved(true)
        : setIsApproved(false);
      setIsValidContract(true);
      setApprovalLoading(false);
    } catch (error) {
      setAlert('Please check that token address is a valid ERC20 contract');
      setIsValidContract(false);
      setApprovalLoading(false);
    }
  };

  const changeApprovalStatus = async (status) => {
    if (!defaultAccount) return setAlert('Please connect your wallet first');
    if (chain.name === 'Unsupported')
      return setAlert('Current network is not supported');
    if (tokenType === 'erc20' && erc20Sum === 0 && !isApproved)
      return setAlert(
        'Please enter the recipient addresses with the amounts to send'
      );
    setApprovalLoading(true);
    const amount = status === true ? erc20Sum : 0;
    try {
      const transactionResponse =
        tokenType !== 'erc20'
          ? await tokenContract.setApprovalForAll(
              airdropContractAddress,
              status
            )
          : await tokenContract.approve(
              airdropContractAddress,
              ethers.utils.parseEther(amount.toString())
            );
      await minedListener(transactionResponse, provider);
      let approval;
      if (tokenType === 'erc20') {
        const allowance = await airdropContract.checkAllowance(token);
        if (allowance.toString() > 0) approval = true;
        setErc20Sum(amount);
      } else approval = await airdropContract.isApproved(token);
      setIsApproved(approval);
      setAlert(
        approval
          ? tokenType !== 'erc20'
            ? 'Approval is successful'
            : `${erc20Sum} tokens approved for sending`
          : 'Approval is removed',
        'success'
      );
      setApprovalLoading(false);
    } catch (error) {
      setAlert('Something went wrong');
      setApprovalLoading(false);
    }
  };

  const checkData = () => {
    if (addressList) {
      if (simple) {
        if (
          !simpleDrop.amount ||
          (tokenType === 'erc1155' && !simpleDrop.tokenId)
        ) {
          setUploadLoading(false);
          return setAlert('Please fill in all fields');
        }
      }
      parseAddressList(addressList);
    } else setAlert('Enter at least 1 address');
  };

  const sendToken = async () => {
    if (!ethers.utils.isAddress(token))
      return setAlert('Please enter valid token contract address');
    if (!isApproved) return setAlert('Please approve before sending');
    if (!isChecked) return setAlert('Please validate input first');
    if (chain.name === 'Unsupported')
      return setAlert('Current network is not supported');

    setSendLoading(true);

    const { addresses, ids, amounts } = drop;
    const timestamp = Math.floor(Date.now() / 1000);
    const until = await airdropContract.subscribers(defaultAccount);

    let fee = txFee.ethereum;

    if (chain.id === '0x89') fee = txFee.polygon;
    if (chain.id === '0x38') fee = txFee.bsc;

    const data =
      Number(until) < timestamp
        ? {
            value: ethers.utils.parseEther(fee),
          }
        : {};

    if (tokenType === 'erc721') {
      try {
        const transactionResponse = await airdropContract.airdropERC721(
          token,
          addresses,
          ids,
          data
        );
        await minedListener(transactionResponse, provider);
        setAlert('Airdrop successfully finished', 'success');
        setSendLoading(false);
      } catch (error) {
        setAlert(
          'Something went wrong. Please check you are the owner of all NFT tokens you are trying to send and have enough funds in your account'
        );
        setSendLoading(false);
      }
    }

    if (tokenType === 'erc1155') {
      try {
        const transactionResponse = await airdropContract.airdropERC1155(
          token,
          addresses,
          ids,
          amounts,
          data
        );
        await minedListener(transactionResponse, provider);
        setAlert('Airdrop successfully finished', 'success');
        setSendLoading(false);
      } catch (error) {
        setAlert(
          'Something went wrong. Please check you are the owner of all NFT tokens you are trying to send and have enough funds in your account'
        );
        setSendLoading(false);
      }
    }

    if (tokenType === 'erc20') {
      const parsedAmounts = amounts.map((amount) =>
        ethers.utils.parseEther(amount.toString())
      );
      const parsedSumAMount = ethers.utils.parseEther(erc20Sum.toString());
      try {
        const transactionResponse = await airdropContract.airdropERC20(
          token,
          addresses,
          parsedAmounts,
          parsedSumAMount,
          data
        );
        await minedListener(transactionResponse, provider);
        setAlert('Airdrop successfully finished', 'success');
        setSendLoading(false);
      } catch (error) {
        setAlert('Something went wrong.');
        setSendLoading(false);
      }
    }
  };

  const parseAddressList = async (text) => {
    setUploadLoading(true);
    setSuccessAlert(false);
    setIsChecked(false);
    setDrop({ addresses: [], ids: [], amounts: [] });
    setListError([]);

    const [data, corruptedData] = await csvToArray(text, tokenType, simple);

    const [addresses, ids, amounts] = data;

    if (!addresses.length) {
      setUploadLoading(false);
      return setAlert('Please enter valid data for selected token type');
    }

    setAddressList('');
    setRowCount(0);

    setListError(corruptedData);

    if (
      (tokenType === 'erc721' && addresses.length > 600) ||
      (tokenType === 'erc1155' && addresses.length > 1500) ||
      (tokenType === 'erc20' && addresses.length > 400)
    )
      setLengthError(true);

    if (simple) {
      setDrop({
        addresses,
        ids:
          tokenType === 'erc1155'
            ? Array(addresses.length).fill(simpleDrop.tokenId)
            : [],
        amounts: Array(addresses.length).fill(simpleDrop.amount),
      });
    } else setDrop({ addresses, ids, amounts });

    let dataField = '';

    for (let i = 0; i < addresses.length; i++) {
      dataField += simple
        ? addresses[i] + '\n'
        : tokenType === 'erc721'
        ? addresses[i] + ',' + ids[i] + '\n'
        : tokenType === 'erc20'
        ? addresses[i] + ',' + amounts[i] + '\n'
        : addresses[i] + ',' + ids[i] + ',' + amounts[i] + '\n';
    }

    if (tokenType === 'erc20') {
      let sumAmount;
      if (simple) {
        sumAmount = addresses.length * simpleDrop.amount;
      } else {
        const amount = amounts.map((am) => Number(am));
        sumAmount = amount.reduce((x, y) => x + y);
      }
      setErc20Sum(sumAmount);
    }

    setAddressList(dataField);
    setRowCount(addresses.length);
    setIsChecked(true);
    if (addresses.length) setSuccessAlert(true);
    setUploadLoading(false);
  };

  const connect = () => {
    if (window.ethereum && window.ethereum.isMetaMask) connectWalletHandler();
    else setAlert('Please install MetaMask browser extension to interact');
  };

  const clear = () => {
    setAddressList('');
    setRowCount(0);
    setSuccessAlert(false);
    setIsChecked(false);
    setDrop({ addresses: [], ids: [], amounts: [] });
    setListError([]);
  };

  const textfieldChange = (e) => {
    setAddressList(e.target.value);
    let count = 0;
    e.target.value.split(/\n/).forEach((row) => {
      if (row.length > 0) count++;
    });
    setRowCount(count);
    isChecked && setIsChecked(false);
  };

  const exec = (e) => {
    e.preventDefault();
    !isChecked ? checkData() : defaultAccount ? sendToken() : connect();
  };

  const handleFileOnSubmit = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileReader = new FileReader();
      fileReader.onload = function (e) {
        const text = e.target.result;
        parseAddressList(text);
      };

      fileReader.readAsText(file);
    }
    e.target.value = null;
  };

  return (
    <Paper
      elevation={5}
      className='form-container'
      sx={{ p: { xs: 2, sm: 6 } }}
    >
      <CorruptedData
        data={listError}
        closeModal={() => setErrorModal(false)}
        modalStatus={errorModal}
      />
      <Example
        closeModal={() => setExampleModal(false)}
        modalStatus={exampleModal}
      />
      <form onSubmit={exec} className='form'>
        <div className='form-element'>
          <TextField
            color='success'
            label='Token contract address'
            value={token}
            onChange={(e) => {
              setToken(e.target.value);
            }}
            type='text'
            variant='outlined'
            autoComplete='do-not-autofill'
            fullWidth
          />
        </div>
        {ethers.utils.isAddress(token) && (
          <div className='form-element'>
            <Button
              variant='contained'
              disabled={!defaultAccount || approvalLoading || !isValidContract}
              onClick={() => changeApprovalStatus(!isApproved)}
              fullWidth
            >
              {defaultAccount ? (
                approvalLoading ? (
                  <CircularProgress size={24} color='secondary' />
                ) : isValidContract ? (
                  isApproved ? (
                    'Remove Approval'
                  ) : (
                    'Approve'
                  )
                ) : (
                  'Not a valid token contract'
                )
              ) : (
                'Please connect wallet'
              )}
            </Button>
          </div>
        )}
        {simple && tokenType === 'erc1155' && (
          <div className='form-element'>
            <TextField
              color='success'
              label='Token ID'
              value={simpleDrop.tokenId}
              onChange={(e) => {
                setSimpleDrop({ ...simpleDrop, tokenId: e.target.value });
                isChecked && setIsChecked(false);
              }}
              type='text'
              variant='outlined'
              autoComplete='do-not-autofill'
              fullWidth
            />
          </div>
        )}
        {simple && (
          <div className='form-element'>
            <TextField
              color='success'
              label='Amount'
              value={simpleDrop.amount}
              onChange={(e) => {
                setSimpleDrop({ ...simpleDrop, amount: e.target.value });
                isChecked && setIsChecked(false);
              }}
              type='text'
              variant='outlined'
              autoComplete='do-not-autofill'
              fullWidth
            />
          </div>
        )}
        {tokenType !== 'erc721' && (
          <div className='form-element'>
            <span onClick={() => setSimple(!simple)} className='text pointer'>
              Switch to{' '}
              {simple
                ? 'standard mode'
                : `${
                    tokenType === 'erc1155' ? 'single ID' : 'same amount'
                  } mode`}
            </span>
          </div>
        )}
        {/* <div>
          <img src={img} alt='' />
        </div> */}
        <div className='form-element'>
          <TextField
            color='success'
            label={`List of recipient addresses ${
              rowCount > 0 ? '(' + rowCount + ')' : ''
            }`}
            // label={`List of recipient addresses ${
            //   rowCount === 0 ? 'separated by comma' : ''
            // } ${rowCount > 0 ? '(' + rowCount + ')' : ''}`}
            value={addressList}
            onChange={textfieldChange}
            autoComplete='do-not-autofill'
            multiline
            minRows={drop.addresses.length <= 5 ? 5 : drop.addresses.length}
            maxRows={15}
            fullWidth
          />
        </div>
        {successAlert && (
          <Fade in={true} {...{ timeout: 1000 }}>
            <Alert
              severity='success'
              variant='filled'
              className='form-element'
              action={
                <IconButton
                  aria-label='close'
                  color='inherit'
                  size='small'
                  onClick={() => {
                    setSuccessAlert(false);
                  }}
                >
                  <CloseIcon fontSize='inherit' />
                </IconButton>
              }
            >
              {`${drop.addresses.length} addresses were successfully added`}
            </Alert>
          </Fade>
        )}
        {listError.length > 0 && (
          <Fade in={true} {...{ timeout: 1000 }}>
            <Alert
              severity='info'
              variant='filled'
              className='form-element'
              action={
                <IconButton
                  aria-label='close'
                  color='inherit'
                  size='small'
                  onClick={() => {
                    setListError([]);
                  }}
                >
                  <CloseIcon fontSize='inherit' />
                </IconButton>
              }
            >
              We have found and removed {listError.length} rows containing
              invalid values. Click{' '}
              <span className='link' onClick={() => setErrorModal(true)}>
                here
              </span>{' '}
              to view them
            </Alert>
          </Fade>
        )}
        {lengthError && (
          <Fade in={true} {...{ timeout: 1000 }}>
            <Alert
              severity='info'
              variant='filled'
              className='form-element'
              action={
                <IconButton
                  aria-label='close'
                  color='inherit'
                  size='small'
                  onClick={() => {
                    setLengthError(false);
                  }}
                >
                  <CloseIcon fontSize='inherit' />
                </IconButton>
              }
            >
              You have entered too many addresses for one transaction. We can't
              guarantee it will be successfully mined by the blockchain. Please
              try not to exceed 400 addresses for ERC-20, 600 addresses for
              ERC-721 and 1500 addresses for ERC-1155.
            </Alert>
          </Fade>
        )}
        <div className='form-element button-group'>
          <div className='upload-button'>
            <Button
              variant='outlined'
              color='secondary'
              component='label'
              onChange={handleFileOnSubmit}
              fullWidth
            >
              {!uploadLoading ? (
                'Upload CSV'
              ) : (
                <CircularProgress size={24} color='secondary' />
              )}
              <input type='file' accept='.csv, .txt' hidden />
            </Button>
          </div>
          <div className='example' onClick={() => setExampleModal(true)}>
            <LightTooltip
              title='Show Example'
              className='example'
              onClick={() => setExampleModal(true)}
            >
              <IconButton size='medium' color='secondary'>
                <InfoIcon />
              </IconButton>
            </LightTooltip>
          </div>
          <div className='clear-button'>
            <Button
              variant='contained'
              component='label'
              onClick={clear}
              disabled={!addressList}
              fullWidth
            >
              Clear input
            </Button>
          </div>
        </div>
        <div>
          <Button
            type='submit'
            variant='contained'
            disabled={!rowCount || loading === 'account' || sendLoading}
            fullWidth
          >
            {!isChecked ? (
              'Validate input'
            ) : !defaultAccount ? (
              loading === 'account' ? (
                <CircularProgress color='secondary' size={24} />
              ) : (
                'Connect wallet'
              )
            ) : sendLoading ? (
              <CircularProgress color='secondary' size={24} />
            ) : (
              'Send'
            )}
          </Button>
        </div>
      </form>
    </Paper>
  );
};

export default Form;
