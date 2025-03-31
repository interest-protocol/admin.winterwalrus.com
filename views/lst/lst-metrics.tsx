import { Box, Button, Typography } from '@interest-protocol/ui-kit';
import {
  useCurrentAccount,
  useSignTransaction,
  useSuiClient,
} from '@mysten/dapp-kit';
import { toPairs } from 'ramda';
import { FC } from 'react';
import toast from 'react-hot-toast';

import { ClaimSVG } from '@/components/svg';
import { STAKING_OBJECTS } from '@/constants/objects';
import useBlizzardAclSdk from '@/hooks/use-blizzard-acl-sdk';
import useBlizzardSdk from '@/hooks/use-blizzard-sdk';
import { useBlizzardStaking } from '@/hooks/use-blizzard-staking';
import { useLstAdminLevel } from '@/hooks/use-lst-admin-level';
import { formatMoney, signAndExecute } from '@/utils';

import { LSTAdminsProps } from './lst.types';

const LSTMetrics: FC<LSTAdminsProps> = ({ lst }) => {
  const client = useSuiClient();
  const blizzardSdk = useBlizzardSdk();
  const currentAccount = useCurrentAccount();
  const signTransaction = useSignTransaction();
  const { data, mutate } = useBlizzardStaking(lst);
  const { data: adminCaps } = useLstAdminLevel(lst);
  const { data: blizzardAclSdk } = useBlizzardAclSdk(lst);

  const adminCap = toPairs(adminCaps?.access ?? {}).find(
    ([, value]) => value === 'admin'
  )?.[0];

  const claimFee = async () => {
    if (!lst) return toast.error('LST not loaded');
    if (!adminCap) return toast.error('No adminCap found');
    if (!blizzardAclSdk) return toast.error('Error on load');
    if (!currentAccount) return toast.error('Wallet not connected');

    const toastId = toast.loading('Claiming fees...');

    try {
      const { tx, returnValues } = await blizzardAclSdk.signIn({
        admin: adminCap,
      });
      blizzardSdk.claimFees({
        tx,
        adminWitness: returnValues,
        blizzardStaking: STAKING_OBJECTS[lst]({ mutable: true }).objectId,
      });
      await signAndExecute({
        tx,
        client,
        currentAccount,
        signTransaction,
        callback: () => {
          mutate();
          toast.dismiss(toastId);
          toast.success('Fees claimed successfully!');
        },
        fallback: (message) => {
          toast.dismiss(toastId);
          toast.error(message || 'Failed to claim fees');
        },
      });
    } catch (e) {
      toast.error((e as Error).message || 'Failed to claim fees');
    } finally {
      toast.dismiss(toastId);
    }
  };

  return (
    <>
      <Box
        p="xl"
        gap="2xs"
        width="100%"
        bg="container"
        display="flex"
        cursor="pointer"
        color="onSurface"
        borderRadius="xs"
        border="1px solid"
        flexDirection="column"
        justifyContent="center"
        borderColor="outlineVariant"
        gridColumn={['span 2', 'span 3']}
      >
        <Typography variant="title" size="medium" py="xs">
          Supply
        </Typography>
        <Typography variant="headline" size="large">
          {formatMoney(
            data ? Number(BigInt(data.lstSupply) / BigInt(10 ** 9)) : 0
          )}
        </Typography>
      </Box>
      <Box
        p="xl"
        gap="2xs"
        width="100%"
        bg="container"
        display="flex"
        cursor="pointer"
        color="onSurface"
        borderRadius="xs"
        border="1px solid"
        flexDirection="column"
        justifyContent="center"
        borderColor="outlineVariant"
        gridColumn={['span 2', 'span 3']}
      >
        <Typography variant="title" size="medium" py="xs">
          Total Wal Deposited
        </Typography>
        <Typography variant="headline" size="large">
          {formatMoney(
            data ? Number(BigInt(data.totalWalDeposited) / BigInt(10 ** 9)) : 0
          )}
        </Typography>
      </Box>

      <Box
        p="xl"
        gap="2xs"
        width="100%"
        bg="container"
        display="flex"
        cursor="pointer"
        color="onSurface"
        borderRadius="xs"
        border="1px solid"
        flexDirection="column"
        borderColor="outlineVariant"
        gridColumn={['span 2', 'span 3']}
      >
        <Box
          width="100%"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="title" size="medium">
            LST Fee balance
          </Typography>
          <Button
            isIcon
            variant="tonal"
            onClick={claimFee}
            disabled={!data || BigInt(data.lstFeeBalance) === BigInt(0)}
          >
            <ClaimSVG maxWidth="1.5rem" maxHeight="1.5rem" width="100%" />
          </Button>
        </Box>
        <Typography variant="headline" size="large">
          {formatMoney(
            data ? Number(BigInt(data.lstFeeBalance) / BigInt(10 ** 9)) : 0
          )}
        </Typography>
      </Box>
      <Box
        p="xl"
        gap="2xs"
        width="100%"
        bg="container"
        display="flex"
        cursor="pointer"
        color="onSurface"
        borderRadius="xs"
        border="1px solid"
        flexDirection="column"
        borderColor="outlineVariant"
        gridColumn={['span 2', 'span 3']}
      >
        <Box
          width="100%"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="title" size="medium">
            WAL Fee Balance
          </Typography>
          <Button
            isIcon
            variant="tonal"
            onClick={claimFee}
            disabled={!data || BigInt(data.walFeeBalance) === BigInt(0)}
          >
            <ClaimSVG maxWidth="1.5rem" maxHeight="1.5rem" width="100%" />
          </Button>
        </Box>
        <Typography variant="headline" size="large">
          {formatMoney(
            data ? Number(BigInt(data.walFeeBalance) / BigInt(10 ** 9)) : 0
          )}
        </Typography>
      </Box>
    </>
  );
};

export default LSTMetrics;
