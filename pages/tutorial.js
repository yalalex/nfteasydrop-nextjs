import PageContainer from '../components/PageContainer';

import Image from 'next/image';

import { Box, Container } from '@mui/material';

import step1 from '../public/tutorial/1.png';
import step2 from '../public/tutorial/2.png';
import step3 from '../public/tutorial/3.png';
import step4 from '../public/tutorial/4.png';
import step5 from '../public/tutorial/5.png';
import step6 from '../public/tutorial/6.png';

const title =
  'NFT Easy Drop - send your tokens to multiple addresses | Tutorial';
const description = {
  h1: 'How to use',
};

const Tutorial = () => {
  return (
    <PageContainer title={title} description={description}>
      <Container
        maxWidth='md'
        sx={{
          marginTop: -1,
          textAlign: 'start',
        }}
      >
        <ol>
          <li>
            Connect your MetaMask. Choose the network your NFT token contract is
            deployed to.
            <Box
              className='tutorial-image'
              sx={{ width: { sm: '100%', md: '60%' } }}
            >
              <Image src={step1} alt='1' placeholder='blur' />
            </Box>
          </li>
          <li>
            Select the NFT token standard you want to send. We currently support
            both of the most popular standards: ERC-721 and ERC-1155.
            <Box
              className='tutorial-image'
              sx={{ width: { sm: '100%', md: '80%' } }}
            >
              <Image src={step2} alt='2' placeholder='blur' />
            </Box>
          </li>
          <li>
            Enter your token address in NFT contract address field. Approve NFT
            Easy Drop to use your tokens.
            <Box
              className='tutorial-image'
              sx={{ width: { sm: '100%', md: '80%' } }}
            >
              <Image src={step3} alt='3' placeholder='blur' />
            </Box>
          </li>
          <li>
            Enter manually or upload an csv/txt file containing the list of
            recipients with corresponding token IDs separated by comma. ONE
            ADDRESS PER ROW. In case you are dropping ERC-1155 tokens with the
            same ID to all the recipients, you can choose single ID mode and
            provide ID in the separate field.
            <Box
              className='tutorial-image'
              sx={{ width: { sm: '100%', md: '80%' } }}
            >
              <Image src={step4} alt='4' placeholder='blur' />
            </Box>
          </li>
          <li>
            Click the Validate input button to have our app check that the data
            you entered is correct. Invalid rows will be removed from the input
            field.
            <Box
              className='tutorial-image'
              sx={{ width: { sm: '100%', md: '80%' } }}
            >
              <Image src={step5} alt='5' placeholder='blur' />
            </Box>
          </li>
          <li>
            Click Send button and confirm the transaction. It usually takes up
            to 5 minutes for transaction to be mined.
            <Box
              className='tutorial-image'
              sx={{ width: { sm: '100%', md: '80%' } }}
            >
              <Image src={step6} alt='6' placeholder='blur' />
            </Box>
          </li>

          <li>
            In case you have any questions regarding use of our dApp feel free
            to contact us on{' '}
            <a
              href='https://twitter.com/nfteasydrop'
              target='_blank'
              rel='noopener noreferrer'
            >
              Twitter
            </a>{' '}
            or{' '}
            <a
              href='https://t.me/nfteasydrop'
              target='_blank'
              rel='noopener noreferrer'
            >
              Telegram
            </a>
            .
          </li>
        </ol>
      </Container>
    </PageContainer>
  );
};

export default Tutorial;
