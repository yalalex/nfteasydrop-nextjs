import { useContext, useState, useEffect } from 'react';

import CorruptedData from './Corrupted';
import Example from './Example';

import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';

import {
  Button,
  TextField,
  IconButton,
  Tooltip,
  Alert,
  Fade,
  CircularProgress,
} from '@mui/material';

import { ethers } from 'ethers';

import { csvToArray } from '../utils/convert-csv';

import { Context } from '../context/context';

import { airdropContractAddress, txFee } from '../config';

import { styled } from '@mui/material/styles';
import { tooltipClasses } from '@mui/material/Tooltip';

const tokenAbi = [
  'function setApprovalForAll(address operator, bool approved)',
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
  const {
    signer,
    airdropContract,
    defaultAccount,
    chain,
    loading,
    connectWalletHandler,
    setError,
  } = useContext(Context);

  const [token, setToken] = useState(''); // nft address

  const [addressList, setAddressList] = useState('');
  const [rowCount, setRowCount] = useState(0);
  const [successAlert, setSuccessAlert] = useState(false);
  const [listError, setListError] = useState({
    wrongValuesNumber: [],
    invalidValues: [],
  });

  const [errorModal, setErrorModal] = useState(false);
  const [exampleModal, setExampleModal] = useState(false);

  const [drop, setDrop] = useState({ addresses: [], ids: [], amounts: [] });

  const [simple, setSimple] = useState(false); // single id drop type for 1155
  const [simpleDrop, setSimpleDrop] = useState({ tokenId: '', amount: '' });

  const [tokenContract, setTokenContract] = useState(null);
  const [isApproved, setIsApproved] = useState(false);

  const [isChecked, setIsChecked] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);

  const [isValidContract, setIsValidContract] = useState(false);
  const [approvalLoading, setApprovalLoading] = useState(false);

  useEffect(() => {
    if (signer && ethers.utils.isAddress(token)) {
      const tempTokenContract = new ethers.Contract(token, tokenAbi, signer);
      setTokenContract(tempTokenContract);
      setIsChecked(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    setSimple(false);
    setToken('');
    setIsChecked(false);
  }, [tokenType]);

  useEffect(() => {
    if (airdropContract && ethers.utils.isAddress(token)) {
      checkToken();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultAccount, token]);

  const checkToken = async () => {
    setApprovalLoading(true);
    try {
      const approval = await airdropContract.isApproved(token);
      approval ? setIsApproved(true) : setIsApproved(false);
      setIsValidContract(true);
      setApprovalLoading(false);
    } catch (error) {
      setError('Please check that token address is a valid NFT contract');
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
    //   setError('Can not get token image');
    // }
  };

  const changeApprovalStatus = async (status) => {
    if (!defaultAccount) return setError('Please connect your wallet first');
    // if (chain.name === 'Unsupported')
    //   return setError('Current network is not supported');
    setApprovalLoading(true);
    try {
      await tokenContract.setApprovalForAll(airdropContractAddress, status);
      const checkApproval = setInterval(async () => {
        const approval = await airdropContract.isApproved(token);
        console.log('approval loading');
        if (approval !== isApproved) {
          setIsApproved(approval);
          setApprovalLoading(false);
          clearInterval(checkApproval);
        }
      }, 1000);
    } catch (error) {
      setError('Something went wrong');
      setApprovalLoading(false);
    }
  };

  const checkData = () => {
    if (addressList) {
      parseAddressList(addressList);
    } else setError('Enter at least 1 address');
  };

  const sendToken = async () => {
    if (!ethers.utils.isAddress(token))
      return setError('Please enter valid NFT contract address');
    if (!isApproved) return setError('Please approve before submit');
    if (!isChecked) return setError('Please validate data first');
    // if (chain.name === 'Unsupported')
    //   return setError('Current network is not supported');

    const { addresses, ids, amounts } = drop;

    const timestamp = Math.floor(Date.now() / 1000);
    const { until } = await airdropContract.subscribers(defaultAccount);

    const data =
      Number(until) < timestamp
        ? {
            value: ethers.utils.parseEther(txFee),
          }
        : {};

    if (tokenType === '721') {
      try {
        await airdropContract.airdrop721(token, addresses, ids, data);
      } catch (error) {
        setError(
          'Something went wrong. Please check you are the owner of all NFT tokens you are trying to send'
        );
      }
    }

    if (tokenType === '1155') {
      try {
        await airdropContract.airdrop1155(token, addresses, ids, amounts, data);
      } catch (error) {
        setError(
          'Something went wrong. Please check you are the owner of all NFT tokens you are trying to send'
        );
      }
    }
  };

  const parseAddressList = async (text) => {
    setUploadLoading(true);
    setSuccessAlert(false);
    setIsChecked(false);
    setDrop({ addresses: [], ids: [], amounts: [] });
    setListError({
      wrongValuesNumber: [],
      invalidValues: [],
    });

    const [data, corruptedData] = await csvToArray(text, tokenType, simple); //ADD LOADING TO CSV BUTTON

    const [addresses, ids, amounts] = data;

    if (!addresses.length) {
      setUploadLoading(false);
      return setError('Please enter valid data for selected token type');
    }

    setAddressList('');
    setRowCount(0);

    setListError(corruptedData);

    if (simple) {
      setDrop({
        addresses,
        ids: Array(addresses.length).fill(simpleDrop.tokenId),
        amounts: Array(addresses.length).fill(simpleDrop.amount),
      });
    } else setDrop({ addresses, ids, amounts });

    let dataField = '';

    for (let i = 0; i < addresses.length; i++) {
      dataField += simple
        ? addresses[i] + '\n'
        : tokenType === '721'
        ? addresses[i] + ',' + ids[i] + '\n'
        : addresses[i] + ',' + ids[i] + ',' + amounts[i] + '\n';
    }

    setAddressList(dataField);
    setRowCount(addresses.length);
    setIsChecked(true);
    if (addresses.length) setSuccessAlert(true);
    setUploadLoading(false);
  };

  const connect = () => {
    connectWalletHandler();
  };

  const clear = () => {
    setAddressList('');
    setRowCount(0);
    setSuccessAlert(false);
    setIsChecked(false);
    setDrop({ addresses: [], ids: [], amounts: [] });
    setListError({
      wrongValuesNumber: [],
      invalidValues: [],
    });
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
    <>
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
            label='NFT contract address'
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
              disabled={approvalLoading || !isValidContract}
              onClick={() => changeApprovalStatus(!isApproved)}
              fullWidth
            >
              {approvalLoading ? (
                <CircularProgress size={24} color='secondary' />
              ) : isValidContract ? (
                isApproved ? (
                  'Remove Approval'
                ) : (
                  'Approve'
                )
              ) : (
                'Not a valid NFT contract'
              )}
            </Button>
          </div>
        )}
        {simple && tokenType === '1155' && (
          <>
            <div className='form-element'>
              <TextField
                color='success'
                label='Token ID'
                value={simpleDrop.tokenId}
                onChange={(e) => {
                  setSimpleDrop({ ...simpleDrop, tokenId: e.target.value });
                }}
                type='text'
                variant='outlined'
                autoComplete='do-not-autofill'
                fullWidth
              />
            </div>
            <div className='form-element'>
              <TextField
                color='success'
                label='Amount'
                value={simpleDrop.amount}
                onChange={(e) => {
                  setSimpleDrop({ ...simpleDrop, amount: e.target.value });
                }}
                type='text'
                variant='outlined'
                autoComplete='do-not-autofill'
                fullWidth
              />
            </div>
          </>
        )}
        {tokenType === '1155' && (
          <div className='form-element'>
            <span onClick={() => setSimple(!simple)} className='text pointer'>
              Switch to {simple ? 'standard mode' : 'single ID mode'}
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
              rowCount > 0 ? `(` + rowCount + `)` : ''
            }`}
            value={addressList}
            onChange={textfieldChange}
            autoComplete='do-not-autofill'
            multiline
            rows={5}
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
        {((listError.invalidValues && listError.invalidValues.length > 0) ||
          (listError.wrongValuesNumber &&
            listError.wrongValuesNumber.length > 0)) && (
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
                    setListError({ wrongValuesNumber: [], invalidValues: [] });
                  }}
                >
                  <CloseIcon fontSize='inherit' />
                </IconButton>
              }
            >
              We have found and removed{' '}
              {listError.invalidValues.length +
                listError.wrongValuesNumber.length}{' '}
              rows containing invalid values. Click{' '}
              <span className='link' onClick={() => setErrorModal(true)}>
                here
              </span>{' '}
              to view them
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
            disabled={!rowCount || loading === 'account'}
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
            ) : (
              'Send'
            )}
          </Button>
        </div>
      </form>
    </>
  );
};

export default Form;
