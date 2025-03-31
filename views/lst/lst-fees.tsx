import { Box, Button, TextField, Typography } from '@interest-protocol/ui-kit';
import {
  useCurrentAccount,
  useSignTransaction,
  useSuiClient,
} from '@mysten/dapp-kit';
import { normalizeStructTag } from '@mysten/sui/utils';
import { toPairs } from 'ramda';
import { FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { STAKING_OBJECTS } from '@/constants/objects';
import useBlizzardAclSdk from '@/hooks/use-blizzard-acl-sdk';
import useBlizzardSdk from '@/hooks/use-blizzard-sdk';
import { useBlizzardStaking } from '@/hooks/use-blizzard-staking';
import { useLstAdminLevel } from '@/hooks/use-lst-admin-level';
import { signAndExecute } from '@/utils/tx';

import { LSTMetadataProps } from './lst.types';

const LSTFees: FC<LSTMetadataProps> = ({ lst }) => {
  const client = useSuiClient();
  const blizzardSdk = useBlizzardSdk();
  const currentAccount = useCurrentAccount();
  const signTransaction = useSignTransaction();
  const { data: adminCaps } = useLstAdminLevel(lst?.type);
  const { data: blizzardAclSdk } = useBlizzardAclSdk(lst?.type);
  const { data, mutate, isLoading } = useBlizzardStaking(lst?.type);
  const { register, getValues, setValue } = useForm({
    defaultValues: {
      mint: Number(data?.feeConfig.mint ?? 0),
      burn: Number(data?.feeConfig.burn ?? 0),
      transmute: Number(data?.feeConfig.transmute ?? 0),
    },
  });

  useEffect(() => {
    if (isLoading || !data) return;

    setValue('mint', Number(data.feeConfig.mint));
    setValue('burn', Number(data.feeConfig.burn));
    setValue('transmute', Number(data.feeConfig.transmute));
  }, [isLoading]);

  const adminCap = toPairs(adminCaps?.access ?? {}).find(
    ([, value]) => value === 'admin'
  )?.[0];

  const setFee = (kind: 'mint' | 'burn' | 'transmute') => async () => {
    const value = getValues(kind);

    if (!lst) return toast.error('LST not loaded');
    if (!adminCap) return toast.error('No adminCap found');
    if (!blizzardAclSdk) return toast.error('Error on load');
    if (!currentAccount) return toast.error('Wallet not connected');
    if (!value || isNaN(value)) return toast.error('Insert a valid input');

    const toastId = toast.loading('Setting fee...');
    try {
      const { tx, returnValues } = await blizzardAclSdk.signIn({
        admin: adminCap,
      });

      tx.moveCall({
        package: blizzardSdk.packages.BLIZZARD.latest,
        module: blizzardSdk.modules.Protocol,
        function: `set_${kind}_fee`,
        arguments: [
          blizzardSdk.sharedObject(
            tx,
            STAKING_OBJECTS[lst.type]({ mutable: true }).objectId
          ),
          returnValues,
          tx.pure.u64(value),
          blizzardSdk.getAllowedVersions(tx),
        ],
        typeArguments: [normalizeStructTag(lst.type)],
      });

      await signAndExecute({
        tx,
        client,
        currentAccount,
        signTransaction,
        callback: () => {
          toast.dismiss(toastId);
          toast.success('Fee set successfully!');
        },
        fallback: (message) => {
          toast.dismiss(toastId);
          toast.error(message || 'Failed to set the fee');
        },
      });
    } catch (e) {
      toast.dismiss(toastId);
      toast.error((e as Error).message || 'Failed to set the fee');
    } finally {
      mutate();
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
        Fees
      </Typography>
      <Box
        width="100%"
        color="onSurface"
        gridColumn={['span 4', 'span 4', 'span 6', 'span 4']}
      >
        <TextField
          Prefix="BPS"
          type="number"
          placeholder="0"
          label="Stake Fee"
          {...register('mint')}
          supportingText="I.e.: 1% = 100bps, 100% = 10000bps"
          Suffix={
            <Button
              py="2xs"
              mr="-0.5rem"
              variant="filled"
              borderRadius="m"
              onClick={setFee('mint')}
            >
              Save
            </Button>
          }
        />
      </Box>
      <Box
        width="100%"
        color="onSurface"
        gridColumn={['span 4', 'span 4', 'span 6', 'span 4']}
      >
        <TextField
          Prefix="BPS"
          type="number"
          placeholder="0"
          label="Unstake Fee"
          {...register('burn')}
          supportingText="I.e.: 1% = 100bps, 100% = 10000bps"
          Suffix={
            <Button
              py="2xs"
              mr="-0.5rem"
              variant="filled"
              borderRadius="m"
              onClick={setFee('burn')}
            >
              Save
            </Button>
          }
        />
      </Box>
      <Box
        width="100%"
        color="onSurface"
        gridColumn={['span 4', 'span 4', 'span 6', 'span 4']}
      >
        <TextField
          Prefix="BPS"
          type="number"
          placeholder="0"
          label="Transmute Fee"
          {...register('transmute')}
          supportingText="I.e.: 1% = 100bps, 100% = 10000bps"
          Suffix={
            <Button
              py="2xs"
              mr="-0.5rem"
              variant="filled"
              borderRadius="m"
              onClick={setFee('transmute')}
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
