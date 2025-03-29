import { Box, Button, TextField, Typography } from '@interest-protocol/ui-kit';
import { FC, useState } from 'react';

import { LSTMetadataProps } from './lst.types';

const LSTMetadata: FC<LSTMetadataProps> = ({ lst, isAdmin }) => {
  const [name, setName] = useState(lst?.name);
  const [symbol, setSymbol] = useState(lst?.symbol);
  const [description, setDescription] = useState(lst?.description);

  return (
    <>
      <Typography
        width="100%"
        size="small"
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
          defaultValue={symbol ?? lst?.symbol}
          onChange={(e) => setSymbol(e.target.value)}
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
          label="Name"
          defaultValue={name ?? lst?.name}
          placeholder="Liquid Staking Token"
          onChange={(e) => setName(e.target.value)}
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
          placeholder="..."
          label="Description"
          defaultValue={description ?? lst?.description}
          onChange={(e) => setDescription(e.target.value)}
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

export default LSTMetadata;
