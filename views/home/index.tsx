import { Box, Button, TextField, Typography } from '@interest-protocol/ui-kit';
import { formatAddress, normalizeSuiAddress } from '@mysten/sui/utils';
import { FC } from 'react';

import { Layout } from '@/components';

const Home: FC = () => (
  <Layout>
    <Typography
      width="100%"
      size="medium"
      color="onSurface"
      gridColumn="1/-1"
      variant="headline"
    >
      LST Metadata
    </Typography>
    <Box gridColumn="span 4" color="onSurface" width="100%">
      <TextField
        label="Symbol"
        placeholder="LST"
        Suffix={
          <Button variant="filled" py="2xs" borderRadius="m" mr="-0.5rem">
            Save
          </Button>
        }
      />
    </Box>
    <Box gridColumn="span 4" color="onSurface" width="100%">
      <TextField
        label="Name"
        placeholder="Liquid Staking Token"
        Suffix={
          <Button variant="filled" py="2xs" borderRadius="m" mr="-0.5rem">
            Save
          </Button>
        }
      />
    </Box>
    <Box gridColumn="span 4" color="onSurface" width="100%">
      <TextField
        placeholder="..."
        label="Description"
        Suffix={
          <Button variant="filled" py="2xs" borderRadius="m" mr="-0.5rem">
            Save
          </Button>
        }
      />
    </Box>
    <Box gridColumn="1/-1" />
    <Typography
      width="100%"
      size="medium"
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
        supportingText="I.e.: 1% = 100bps, 100% = 10000bps"
        Suffix={
          <Button variant="filled" py="2xs" borderRadius="m" mr="-0.5rem">
            Save
          </Button>
        }
      />
    </Box>
    <Box gridColumn="span 4" color="onSurface" width="100%">
      <TextField
        Prefix="BPS"
        label="Unstake Fee"
        placeholder="0"
        supportingText="I.e.: 1% = 100bps, 100% = 10000bps"
        Suffix={
          <Button variant="filled" py="2xs" borderRadius="m" mr="-0.5rem">
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
        supportingText="I.e.: 1% = 100bps, 100% = 10000bps"
        Suffix={
          <Button variant="filled" py="2xs" borderRadius="m" mr="-0.5rem">
            Save
          </Button>
        }
      />
    </Box>

    <Box gridColumn="1/-1" />
    <Typography
      width="100%"
      size="medium"
      color="onSurface"
      gridColumn="1/-1"
      variant="headline"
    >
      Admins
    </Typography>
    <Box gridColumn="span 4" color="onSurface" width="100%">
      <TextField
        label="Address"
        placeholder={formatAddress(normalizeSuiAddress('0x0'))}
        supportingText="Address of the account authorized to manage an LST"
        Suffix={
          <Button variant="filled" py="2xs" borderRadius="m" mr="-0.5rem">
            Add
          </Button>
        }
      />
    </Box>
    {Array.from({ length: 8 }, (_, index) =>
      normalizeSuiAddress(`0x${index + 1}`)
    ).map((address) => (
      <Box gridColumn="span 4" color="onSurface" width="100%" key={address}>
        <TextField
          label="Address"
          value={formatAddress(address)}
          placeholder={formatAddress(normalizeSuiAddress('0x0'))}
          supportingText="Address of the account authorized to manage an LST"
          Suffix={
            <Button
              py="2xs"
              mr="-0.5rem"
              variant="filled"
              borderRadius="m"
              bg="errorContainer"
              color="onErrorContainer"
              nHover={{ bg: 'errorContainer', opacity: 0.8 }}
            >
              Delete
            </Button>
          }
        />
      </Box>
    ))}
  </Layout>
);

export default Home;
