import '@mysten/dapp-kit/dist/index.css';

import { Box, Typography } from '@interest-protocol/ui-kit';
import { FC, PropsWithChildren } from 'react';

import { LogoSVG } from '../svg';
import WalletButton from '../wallet-button';

const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Box
      display="flex"
      bg="lowContainer"
      minHeight="100vh"
      flexDirection="column"
    >
      <Box py="l">
        <Box variant="container">
          <Box
            width="100%"
            display="flex"
            gridColumn="1/-1"
            justifyContent="space-between"
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
        m="l"
        flex="1"
        mt="NONE"
        borderRadius="s"
        bg="lowestContainer"
        py={['s', 'm', 'l', '7xl']}
      >
        <Box variant="container">{children}</Box>
      </Box>
    </Box>
  );
};

export default Layout;
