import '../styles/globals.scss';
import Layout from '../components/Layout/Layout';

import { Provider } from 'react-redux';
import store from '../redux/store';

import { ThemeProvider } from '@mui/material';
import { theme } from '../utils/theme';

import createEmotionCache from '../utils/createEmotionCache';
import { CacheProvider } from '@emotion/react';

const clientSideEmotionCache = createEmotionCache();

const MyApp = ({
  Component,
  emotionCache = clientSideEmotionCache,
  pageProps,
}) => {
  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </Provider>
      </ThemeProvider>
    </CacheProvider>
  );
};

export default MyApp;
