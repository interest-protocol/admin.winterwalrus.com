import { Box, Button, TextField, Typography } from '@interest-protocol/ui-kit';
import { FC, useState } from 'react';

import { useFees } from '@/hooks/use-fees';

import { LSTMetadataProps } from './lst.types';

const LSTFees: FC<LSTMetadataProps> = ({ lst, isAdmin }) => {
  const { data } = useFees(lst?.type);
  const [stakeFee, setStakeFee] = useState(data?.staking);
  const [unstakeFee, setUnstakeFee] = useState(data?.unstaking);
  const [transmuteFee, setTransmuteFee] = useState(data?.transmute);

  return (
    <>
      <Typography
        width="100%"
        size="small"
        color="onSurface"
        gridColumn="1/-1"
        variant="headline"
      >
        Fees
      </Typography>
      <Box gridColumn="span 4" color="onSurface" width="100%">
        <TextField
          Prefix="BPS"
          placeholder="0"
          label="Stake Fee"
          defaultValue={stakeFee ?? data?.staking}
          supportingText="I.e.: 1% = 100bps, 100% = 10000bps"
          onChange={(e) => setStakeFee(Number(e.target.value))}
          Suffix={
            <Button
              py="2xs"
              mr="-0.5rem"
              variant="filled"
              borderRadius="m"
              disabled={!isAdmin}
            >
              Save
            </Button>
          }
        />
      </Box>
      <Box gridColumn="span 4" color="onSurface" width="100%">
        <TextField
          Prefix="BPS"
          placeholder="0"
          label="Unstake Fee"
          defaultValue={unstakeFee}
          supportingText="I.e.: 1% = 100bps, 100% = 10000bps"
          onChange={(e) => setUnstakeFee(Number(e.target.value))}
          Suffix={
            <Button
              py="2xs"
              mr="-0.5rem"
              variant="filled"
              borderRadius="m"
              disabled={!isAdmin}
            >
              Save
            </Button>
          }
        />
      </Box>
      <Box gridColumn="span 4" color="onSurface" width="100%">
        <TextField
          Prefix="BPS"
          placeholder="0"
          label="Transmute Fee"
          defaultValue={transmuteFee}
          supportingText="I.e.: 1% = 100bps, 100% = 10000bps"
          onChange={(e) => setTransmuteFee(Number(e.target.value))}
          Suffix={
            <Button
              py="2xs"
              mr="-0.5rem"
              variant="filled"
              borderRadius="m"
              disabled={!isAdmin}
            >
              Save
            </Button>
          }
        />
      </Box>
    </>
  );
};

export default LSTFees;
