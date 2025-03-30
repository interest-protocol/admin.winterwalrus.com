import { Box, Button, TextField, Typography } from '@interest-protocol/ui-kit';
import {
  useCurrentAccount,
  useSignTransaction,
  useSuiClient,
} from '@mysten/dapp-kit';
import { FC } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { STAKING_OBJECTS } from '@/constants/objects';
import useBlizzardAclSdk from '@/hooks/use-blizzard-acl-sdk';
import useBlizzardSdk from '@/hooks/use-blizzard-sdk';
import { useLstAdminLevel } from '@/hooks/use-lst-admin-level';
import { signAndExecute } from '@/utils';

import { LSTMetadataProps } from './lst.types';

const LSTMetadata: FC<LSTMetadataProps> = ({ lst }) => {
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
      const functionName = (
        {
          name: 'updateName',
          symbol: 'updateSymbol',
          icon_url: 'updateIconUrl',
          description: 'updateDescription',
        } as const
      )[kind];

      if (!lst) return toast.error('LST not loaded');
      if (!adminCap) return toast.error('No adminCap found');
      if (!blizzardAclSdk) return toast.error('Error on load');
      if (!currentAccount) return toast.error('Wallet not connected');
      if (!value) return toast.error('Insert a valid input');

      const toastId = toast.loading('Updating metadata...');

      try {
        const { tx, returnValues } = await blizzardAclSdk.signIn({
          admin: adminCap,
        });

        await blizzardSdk[functionName]({
          value,
          adminWitness: returnValues,
          blizzardStaking: STAKING_OBJECTS[lst.type]({ mutable: true })
            .objectId,
        });

        await signAndExecute({
          client,
          tx,
          currentAccount,
          signTransaction,
          callback: () => {
            toast.dismiss(toastId);
            toast.success('Metadata updated successfully!');
          },
          fallback: (message) => {
            toast.dismiss(toastId);
            toast.error(message || 'Failed to update metadata');
          },
        });
      } catch (e) {
        toast.error((e as Error).message || 'Failed to update metadata');
      } finally {
        toast.dismiss(toastId);
      }
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
      <Box
        width="100%"
        color="onSurface"
        gridColumn={['span 4', 'span 2', 'span 6', 'span 3']}
      >
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
              onClick={setMetadata('symbol')}
            >
              Save
            </Button>
          }
        />
      </Box>
      <Box
        width="100%"
        color="onSurface"
        gridColumn={['span 4', 'span 2', 'span 6', 'span 3']}
      >
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
              onClick={setMetadata('symbol')}
            >
              Save
            </Button>
          }
        />
      </Box>
      <Box
        width="100%"
        color="onSurface"
        gridColumn={['span 4', 'span 2', 'span 6', 'span 3']}
      >
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
              onClick={setMetadata('description')}
            >
              Save
            </Button>
          }
        />
      </Box>
      <Box
        width="100%"
        color="onSurface"
        gridColumn={['span 4', 'span 2', 'span 6', 'span 3']}
      >
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
