import { useContext, useState, useEffect } from 'react';

import CorruptedData from './Corrupted';
import Example from './Example';

import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';

import { Button, TextField, IconButton, Tooltip, Alert } from '@mui/material';

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
    // loading,
    connectWalletHandler,
    setError,
    // setLoading,
  } = useContext(Context);

  const [token, setToken] = useState(''); // nft address

  const [addressList, setAddressList] = useState('');
  const [listError, setListError] = useState([]);

  const [errorModal, setErrorModal] = useState(false);
  const [exampleModal, setExampleModal] = useState(false);

  const [drop, setDrop] = useState({ addresses: [], ids: [], amounts: [] });

  const [simple, setSimple] = useState(false); // single id drop type for 1155
  const [simpleDrop, setSimpleDrop] = useState({ tokenId: '', amount: '' });

  const [tokenContract, setTokenContract] = useState(null);
  const [isApproved, setIsApproved] = useState(false);

  const [isChecked, setIsChecked] = useState(false);

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
    if (chain.name === 'Unsupported')
      return setError(`${chain.name} is not supported`);
    try {
      await tokenContract.setApprovalForAll(airdropContractAddress, status);
      setIsApproved(status);
    } catch (error) {
      setError('Something went wrong');
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
    if (chain.name === 'Unsupported')
      return setError(`${chain.name} is not supported`);

    const { addresses, ids, amounts } = drop;

    const subscription = await airdropContract.checkSub(defaultAccount);

    const data = !subscription
      ? {
          value: ethers.utils.parseEther(txFee),
        }
      : {};

    if (tokenType === '721') {
      try {
        await airdropContract.airdrop721(token, addresses, ids, data);
      } catch (error) {
        setError('Something went wrong');
      }
    }

    if (tokenType === '1155') {
      try {
        await airdropContract.airdrop1155(token, addresses, ids, amounts, data);
      } catch (error) {
        setError('Something went wrong');
      }
    }
  };

  const parseAddressList = async (text) => {
    const [data, corruptedData] = await csvToArray(text, tokenType, simple);

    const [addresses, ids, amounts] = data;

    if (!addresses.length)
      return setError('Please enter valid data for selected token type');

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
    setIsChecked(true);
  };

  const connect = () => {
    connectWalletHandler();
  };

  const clear = () => {
    setAddressList('');
    setIsChecked(false);
  };

  const exec = (e) => {
    e.preventDefault();
    !defaultAccount ? connect() : sendToken();
  };

  const handleFileOnSubmit = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileReader = new FileReader();
      fileReader.onload = function (e) {
        // setAddressList('');
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
            id='outlined-basic'
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
              {approvalLoading
                ? 'Checking...'
                : isValidContract
                ? isApproved
                  ? 'Remove Approval'
                  : 'Approve'
                : 'Not a valid NFT contract'}
            </Button>
          </div>
        )}
        {simple && tokenType === '1155' && (
          <>
            <div className='form-element'>
              <TextField
                id='outlined-basic'
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
                id='outlined-basic'
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
            id='outlined-multiline-static'
            label='List of recipient addresses'
            value={addressList}
            onChange={(e) => {
              setAddressList(e.target.value);
              isChecked && setIsChecked(false);
            }}
            autoComplete='do-not-autofill'
            multiline
            minRows={3}
            maxRows={20}
            fullWidth
          />
        </div>
        {((listError.invalidValues && listError.invalidValues.length > 0) ||
          (listError.wrongValuesNumber &&
            listError.wrongValuesNumber.length > 0)) && (
          <Alert
            severity='warning'
            variant='outlined'
            className='form-element'
            action={
              <IconButton
                aria-label='close'
                color='inherit'
                size='small'
                onClick={() => {
                  setListError('');
                }}
              >
                <CloseIcon fontSize='inherit' />
              </IconButton>
            }
          >
            We removed rows with invalid format. Click{' '}
            <span className='link' onClick={() => setErrorModal(true)}>
              here
            </span>{' '}
            to view them
          </Alert>
        )}
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
          }}
          className='form-element'
        >
          <div className='upload-button'>
            <Button
              variant='outlined'
              color='secondary'
              component='label'
              onChange={handleFileOnSubmit}
              fullWidth
            >
              Upload CSV
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
          <div className='validate-button'>
            <Button
              variant='contained'
              component='label'
              onClick={() => checkData()}
              disabled={isChecked || !addressList}
              fullWidth
            >
              {isChecked ? 'Input checked' : 'Check input'}
            </Button>
          </div>
        </div>
        <div className='form-element'>
          <Button
            type='submit'
            variant='contained'
            // disabled={loading}
            fullWidth
          >
            {!defaultAccount ? 'Connect wallet' : 'Send'}
          </Button>
        </div>
      </form>
    </>
  );
};

export default Form;
