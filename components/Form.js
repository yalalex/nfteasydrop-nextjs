import { useContext, useState, useEffect } from 'react';

import CorruptedData from './Corrupted';
import Example from './Example';

import { Button, TextField } from '@mui/material';

import { ethers } from 'ethers';

import { csvToArray } from '../utils/convert-csv';

import { Context } from '../context/context';

import { airdropContractAddress, txFee } from '../config';

const tokenAbi = [
  'function setApprovalForAll(address operator, bool approved)',
];

const Form = ({ tokenType }) => {
  const {
    signer,
    airdropContract,
    defaultAccount,
    loading,
    connectWalletHandler,
    errorHandler,
    // setLoading,
  } = useContext(Context);

  const [token, setToken] = useState(''); // nft address

  const [addressList, setAddressList] = useState('');
  const [listError, setListError] = useState([]); // add local error handler

  const [errorModal, setErrorModal] = useState(false);
  const [exampleModal, setExampleModal] = useState(false);

  const [drop, setDrop] = useState({ addresses: [], ids: [], amounts: [] });

  const [simple, setSimple] = useState(false); // single id drop type for 1155
  const [simpleDrop, setSimpleDrop] = useState({ tokenId: '', amount: '' });

  const [tokenContract, setTokenContract] = useState(null);
  const [isApproved, setIsApproved] = useState(false);
  // const [isSubscribed, setIsSubscribed] = useState(false);

  const [isChecked, setIsChecked] = useState(false);

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
    if (chain === 'Unsupported')
      return errorHandler(`${chain} is not supported`);
    setApprovalLoading(true);
    try {
      const approval = await airdropContract.isApproved(token);
      approval ? setIsApproved(true) : setIsApproved(false);
      setApprovalLoading(false);
    } catch (error) {
      errorHandler('Please check that token address is a valid NFT contract');
      setApprovalLoading(false);
    }
    // try {
    //   const uri = await tokenContract.uri(tokenId);
    //   const info = await axios.get(uri);
    //   const imgPath = info.data.image.slice(7);
    //   const image = `https://ipfs.io/ipfs/${imgPath}`;
    //   setImg(image); //SET_IMAGE
    // } catch (error) {
    //   errorHandler('Can not get token image');
    // }
  };

  const changeApprovalStatus = async (status) => {
    if (!defaultAccount)
      return errorHandler('Please connect your wallet first'); // make local error?
    if (chain === 'Unsupported')
      return errorHandler(`${chain} is not supported`);
    try {
      await tokenContract.setApprovalForAll(airdropContractAddress, status);
      setIsApproved(status);
    } catch (error) {
      errorHandler('Something went wrong');
    }
  };

  const checkData = () => {
    if (addressList) {
      parseAddressList(addressList);
    } else errorHandler('Enter at least 1 address');
  };

  const sendToken = async () => {
    if (!ethers.utils.isAddress(token))
      return errorHandler('Please enter valid NFT contract address');
    if (!isApproved) return errorHandler('Please approve before submit');
    if (!isChecked)
      return errorHandler('Please click CHECK DATA before submit');
    if (chain === 'Unsupported')
      return errorHandler(`${chain} is not supported`);

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
        errorHandler('Something went wrong');
      }
    }

    if (tokenType === '1155') {
      try {
        await airdropContract.airdrop1155(token, addresses, ids, amounts, data);
      } catch (error) {
        errorHandler('Something went wrong');
      }
    }
  };

  const parseAddressList = async (text) => {
    const [data, corruptedData] = await csvToArray(text, tokenType, simple);

    const [addresses, ids, amounts] = data;

    if (!addresses.length)
      return errorHandler('Please enter valid data for selected token type');

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
    // if (defaultAccount) return;
    connectWalletHandler();
  };

  const exec = (e) => {
    e.preventDefault();
    !isChecked ? checkData() : !defaultAccount ? connect() : sendToken();
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
            autoComplete='off'
            fullWidth
          />
        </div>
        {ethers.utils.isAddress(token) && (
          <div className='form-element'>
            <Button
              variant='contained'
              disabled={approvalLoading}
              onClick={() => changeApprovalStatus(!isApproved)}
              fullWidth
            >
              {approvalLoading
                ? 'Checking...'
                : isApproved
                ? 'Remove Approval'
                : 'Approve'}
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
                autoComplete='off'
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
                autoComplete='off'
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
            multiline
            minRows={3}
            maxRows={20}
            fullWidth
          />
        </div>
        {((listError.invalidValues && listError.invalidValues.length > 0) ||
          (listError.wrongValuesNumber &&
            listError.wrongValuesNumber.length > 0)) && (
          <div className='form-element text error'>
            We removed rows with invalid format. Click{' '}
            <span className='link' onClick={() => setErrorModal(true)}>
              here
            </span>{' '}
            to view them
          </div>
        )}
        <div style={{ display: 'flex' }} className='form-element'>
          <div className='upload-button'>
            <Button
              variant='outlined'
              component='label'
              onChange={handleFileOnSubmit}
              fullWidth
            >
              Upload CSV / TXT File
              <input type='file' accept='.csv, .txt' hidden />
            </Button>
          </div>
          <div
            className='text pointer example'
            onClick={() => setExampleModal(true)}
          >
            Show example
          </div>
        </div>
        {/* {addressList.length > 1 && (
            <div className='form-element'>
              <Button
                variant='outlined'
                // disabled={!addressList}
                onClick={checkData}
                fullWidth
              >
                Check Data
              </Button>
            </div>
          )} */}
        <div className='form-element'>
          <Button
            type='submit'
            variant='contained'
            disabled={loading}
            fullWidth
          >
            {!isChecked
              ? 'Check Data'
              : !defaultAccount
              ? 'Connect wallet'
              : 'Send'}
          </Button>
        </div>
      </form>
    </>
  );
};

export default Form;
