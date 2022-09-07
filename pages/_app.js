import '../styles/globals.scss';
import Layout from '../components/Layout';

import { Provider } from '../context/context';

import { ThemeProvider } from '@mui/material';
import { theme } from '../utils/theme';

const MyApp = ({ Component, pageProps }) => {
  return (
    <ThemeProvider theme={theme}>
      <Provider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Provider>
    </ThemeProvider>
  );
};

export default MyApp;
