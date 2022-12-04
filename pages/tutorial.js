import { Container } from '@mui/material';

import PageContainer from '../components/PageContainer';
import TutorialStep from '../components/TutorialStep';

import { externalLinks } from '../config';

import howtouse from '../data/howtouse.json';

import step1 from '../public/tutorial/1.png';
import step2 from '../public/tutorial/2.png';
import step3 from '../public/tutorial/3.png';
import step4 from '../public/tutorial/4.png';
import step5 from '../public/tutorial/5.png';
import step6 from '../public/tutorial/6.png';

const steps = [step1, step2, step3, step4, step5, step6];

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
          {howtouse.map((step, i) => (
            <TutorialStep
              key={step.id}
              id={step.id}
              text={step.text}
              img={steps[i]}
            ></TutorialStep>
          ))}
          <li>
            In case you have any questions regarding use of our dApp feel free
            to contact us on{' '}
            <a
              href={externalLinks.twitter}
              target='_blank'
              rel='noopener noreferrer'
            >
              Twitter
            </a>{' '}
            or{' '}
            <a
              href={externalLinks.telegram}
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
