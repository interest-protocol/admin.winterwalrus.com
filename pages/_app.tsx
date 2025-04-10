import { Global } from '@emotion/react';
import { darkTheme, ThemeProvider } from '@interest-protocol/ui-kit';
import type { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import { Toaster } from 'react-hot-toast';

import { GlobalStyles } from '@/styles';

const Web3Provider = dynamic(import('@/components/web3-provider'), {
  ssr: false,
});

const App = ({ Component, pageProps }: AppProps) => (
  <ThemeProvider theme={darkTheme}>
    <Web3Provider>
      <Global styles={GlobalStyles} />
      <Component {...pageProps} />
      <Toaster position="bottom-right" />
    </Web3Provider>
  </ThemeProvider>
);

export default App;
