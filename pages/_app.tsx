import { Global } from '@emotion/react';
import { darkTheme, ThemeProvider } from '@interest-protocol/ui-kit';
import type { AppProps } from 'next/app';
import dynamic from 'next/dynamic';

import { GlobalStyles } from '@/styles';

const Web3Provider = dynamic(import('@/components/web3-provider'), {
  ssr: false,
});

const App = ({ Component, pageProps }: AppProps) => (
  <ThemeProvider theme={darkTheme}>
    <Web3Provider>
      <Global styles={GlobalStyles} />
      <Component {...pageProps} />
    </Web3Provider>
  </ThemeProvider>
);

export default App;
