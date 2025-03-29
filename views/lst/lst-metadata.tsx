import { Box, Button, TextField, Typography } from '@interest-protocol/ui-kit';
import {
  useCurrentAccount,
  useSignTransaction,
  useSuiClient,
} from '@mysten/dapp-kit';
import { normalizeStructTag } from '@mysten/sui/utils';
import { FC } from 'react';
import { useForm } from 'react-hook-form';

import { STAKING_OBJECTS } from '@/constants/objects';
import useBlizzardAclSdk from '@/hooks/use-blizzard-acl-sdk';
import useBlizzardSdk from '@/hooks/use-blizzard-sdk';
import { useLstAdminLevel } from '@/hooks/use-lst-admin-level';
import { signAndExecute } from '@/utils';

import { LSTMetadataProps } from './lst.types';

const LSTMetadata: FC<LSTMetadataProps> = ({ lst, isAdmin }) => {
  const client = useSuiClient();
  const blizzardSdk = useBlizzardSdk();
  const currentAccount = useCurrentAccount();
  const signTransaction = useSignTransaction();
  const { data: adminCaps } = useLstAdminLevel(lst?.type);
  const { data: blizzardAclSdk } = useBlizzardAclSdk(lst?.type);
  const { register, getValues } = useForm({
    defaultValues: {
      name: lst?.name,
      symbol: lst?.symbol,
      icon_url: lst?.iconUrl,
      description: lst?.description,
    },
  });

  const adminCap = adminCaps?.find(({ level }) => level === 'admin')?.id;

  const setMetadata =
    (kind: 'description' | 'symbol' | 'name' | 'icon_url') => async () => {
      const value = getValues(kind);

      if (!adminCap || !currentAccount || !lst || !blizzardAclSdk || !value)
        return;

      const { tx, returnValues } = await blizzardAclSdk.signIn({
        admin: adminCap,
      });

      tx.moveCall({
        package: blizzardSdk.packages.BLIZZARD.latest,
        module: blizzardSdk.modules.Protocol,
        function: `update_${kind}`,
        arguments: [
          blizzardSdk.sharedObject(
            tx,
            STAKING_OBJECTS[lst.type]({ mutable: true }).objectId
          ),
          returnValues,
          tx.pure.string(value),
          blizzardSdk.getAllowedVersions(tx),
        ],
        typeArguments: [normalizeStructTag(lst.type)],
      });

      signAndExecute({ client, tx, currentAccount, signTransaction });
    };

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
      <Box gridColumn="span 3" color="onSurface" width="100%">
        <TextField
          label="Symbol"
          placeholder="LST"
          {...register('symbol')}
          Suffix={
            <Button
              py="2xs"
              mr="-0.5rem"
              variant="filled"
              borderRadius="m"
              disabled={!isAdmin}
              onClick={setMetadata('symbol')}
            >
              Save
            </Button>
          }
        />
      </Box>
      <Box gridColumn="span 3" color="onSurface" width="100%">
        <TextField
          label="Name"
          {...register('name')}
          placeholder="Liquid Staking Token"
          Suffix={
            <Button
              py="2xs"
              mr="-0.5rem"
              variant="filled"
              borderRadius="m"
              disabled={!isAdmin}
              onClick={setMetadata('symbol')}
            >
              Save
            </Button>
          }
        />
      </Box>
      <Box gridColumn="span 3" color="onSurface" width="100%">
        <TextField
          placeholder="..."
          label="Description"
          {...register('description')}
          Suffix={
            <Button
              py="2xs"
              mr="-0.5rem"
              variant="filled"
              borderRadius="m"
              disabled={!isAdmin}
              onClick={setMetadata('description')}
            >
              Save
            </Button>
          }
        />
      </Box>
      <Box gridColumn="span 3" color="onSurface" width="100%">
        <TextField
          label="Icon Url"
          {...register('icon_url')}
          placeholder="https://www.brand.com/logo.png"
          Suffix={
            <Button
              py="2xs"
              mr="-0.5rem"
              variant="filled"
              borderRadius="m"
              disabled={!isAdmin}
              onClick={setMetadata('icon_url')}
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
