import '@mysten/dapp-kit/dist/index.css';

import { Box, Typography } from '@interest-protocol/ui-kit';
import { FC, PropsWithChildren } from 'react';

import { LogoSVG } from '../svg';
import WalletButton from '../wallet-button';

const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Box
      display="flex"
      minHeight="100vh"
      bg="lowContainer"
      flexDirection="column"
    >
      <Box py="l">
        <Box variant="container">
          <Box
            display="flex"
            justifyContent="space-between"
            gridColumn="1/-1"
            width="100%"
          >
            <Box display="flex" gap="1rem" alignItems="center">
              <LogoSVG maxWidth="2rem" maxHeight="2rem" width="100%" />
              <Typography variant="headline" size="small" color="onSurface">
                admin
              </Typography>
            </Box>
            <WalletButton />
          </Box>
        </Box>
      </Box>
      <Box
        bg="lowestContainer"
        p="7xl"
        m="l"
        mt="NONE"
        borderRadius="s"
        flex="1"
      >
        <Box variant="container">{children}</Box>
      </Box>
    </Box>
  );
};

export default Layout;
