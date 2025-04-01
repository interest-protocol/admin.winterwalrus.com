import {
  createNetworkConfig,
  SuiClientProvider,
  WalletProvider,
} from '@mysten/dapp-kit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FC, PropsWithChildren } from 'react';

const queryClient = new QueryClient();

const Web3Provider: FC<PropsWithChildren> = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <SuiClientProvider
      defaultNetwork="mainnet"
      networks={
        createNetworkConfig({
          mainnet: {
            url: 'https://api.shinami.com/node/v1/sui_mainnet_f8ba2ad72d9ad60899e56d2f9d813e2b',
          },
        }).networkConfig
      }
    >
      <WalletProvider autoConnect stashedWallet={{ name: 'Winter Walrus' }}>
        {children}
      </WalletProvider>
    </SuiClientProvider>
  </QueryClientProvider>
);

export default Web3Provider;
