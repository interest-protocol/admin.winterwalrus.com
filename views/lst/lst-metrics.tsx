import { Box, Typography } from '@interest-protocol/ui-kit';
import { FC } from 'react';

import { useBlizzardStaking } from '@/hooks/use-blizzard-staking';
import { formatMoney } from '@/utils';

import { LSTAdminsProps } from './lst.types';

const LSTMetrics: FC<LSTAdminsProps> = ({ lst }) => {
  const { data } = useBlizzardStaking(lst);

  return (
    <>
      <Box
        p="xl"
        gap="xl"
        width="100%"
        bg="container"
        display="flex"
        cursor="pointer"
        color="onSurface"
        borderRadius="xs"
        border="1px solid"
        alignItems="center"
        borderColor="outlineVariant"
        gridColumn={['span 2', 'span 3']}
      >
        <Box display="flex" gap="2xs" flexDirection="column">
          <Typography variant="title" size="medium">
            Supply
          </Typography>
          <Typography variant="headline" size="large">
            {formatMoney(
              data ? Number(BigInt(data.lstSupply) / BigInt(10 ** 9)) : 0
            )}
          </Typography>
        </Box>
      </Box>
      <Box
        p="xl"
        gap="xl"
        width="100%"
        bg="container"
        display="flex"
        cursor="pointer"
        color="onSurface"
        borderRadius="xs"
        border="1px solid"
        alignItems="center"
        borderColor="outlineVariant"
        gridColumn={['span 2', 'span 3']}
      >
        <Box display="flex" gap="2xs" flexDirection="column">
          <Typography variant="title" size="medium">
            Total Wal Deposited
          </Typography>
          <Typography variant="headline" size="large">
            {formatMoney(
              data
                ? Number(BigInt(data.totalWalDeposited) / BigInt(10 ** 9))
                : 0
            )}
          </Typography>
        </Box>
      </Box>
      <Box
        p="xl"
        gap="xl"
        width="100%"
        bg="container"
        display="flex"
        cursor="pointer"
        color="onSurface"
        borderRadius="xs"
        border="1px solid"
        alignItems="center"
        borderColor="outlineVariant"
        gridColumn={['span 2', 'span 3']}
      >
        <Box display="flex" gap="2xs" flexDirection="column">
          <Typography variant="title" size="medium">
            LST Fee balance
          </Typography>
          <Typography variant="headline" size="large">
            {formatMoney(
              data ? Number(BigInt(data.lstFeeBalance) / BigInt(10 ** 9)) : 0
            )}
          </Typography>
        </Box>
      </Box>
      <Box
        p="xl"
        gap="xl"
        width="100%"
        bg="container"
        display="flex"
        cursor="pointer"
        color="onSurface"
        borderRadius="xs"
        border="1px solid"
        alignItems="center"
        borderColor="outlineVariant"
        gridColumn={['span 2', 'span 3']}
      >
        <Box display="flex" gap="2xs" flexDirection="column">
          <Typography variant="title" size="medium">
            WAL Fee Balance
          </Typography>
          <Typography variant="headline" size="large">
            {formatMoney(
              data ? Number(BigInt(data.walFeeBalance) / BigInt(10 ** 9)) : 0
            )}
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default LSTMetrics;
