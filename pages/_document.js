import * as React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import createEmotionServer from '@emotion/server/create-instance';
import createEmotionCache from '../utils/createEmotionCache';

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang='en'>
        <Head>
          <meta
            name='description'
            content='This tool allows you to airdrop your ERC-721 and ERC-1155 tokens to multiple recipients with one transaction'
            key='desc'
          />
          <meta property='og:title' content='NFT Easy Drop' />
          <meta
            property='og:description'
            content='Send your ERC-721, ERC-1155 and ERC-20 tokens to multiple addresses with one transaction'
          />
          <meta
            property='og:image'
            content='https://pbs.twimg.com/profile_images/1574293287082815488/Vw31Q6bd_400x400.jpg'
          />
          <link
            href='https://fonts.googleapis.com/css2?family=Kanit&family=Rajdhani:wght@500;700&family=Titillium+Web&display=swap'
            rel='stylesheet'
          />
          {this.props.emotionStyleTags}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

MyDocument.getInitialProps = async (ctx) => {
  const originalRenderPage = ctx.renderPage;

  const cache = createEmotionCache();
  const { extractCriticalToChunks } = createEmotionServer(cache);

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App) =>
        function EnhanceApp(props) {
          return <App emotionCache={cache} {...props} />;
        },
    });

  const initialProps = await Document.getInitialProps(ctx);

  const emotionStyles = extractCriticalToChunks(initialProps.html);
  const emotionStyleTags = emotionStyles.styles.map((style) => (
    <style
      data-emotion={`${style.key} ${style.ids.join(' ')}`}
      key={style.key}
      dangerouslySetInnerHTML={{ __html: style.css }}
    />
  ));

  return {
    ...initialProps,
    emotionStyleTags,
  };
};
