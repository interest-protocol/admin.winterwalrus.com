import { Box, Button, TextField, Typography } from '@interest-protocol/ui-kit';
import {
  useCurrentAccount,
  useSignTransaction,
  useSuiClient,
} from '@mysten/dapp-kit';
import {
  formatAddress,
  isValidSuiObjectId,
  normalizeSuiAddress,
  normalizeSuiObjectId,
} from '@mysten/sui/utils';
import { FC } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import useBlizzardAclSdk from '@/hooks/use-blizzard-acl-sdk';
import { useLstAdminLevel } from '@/hooks/use-lst-admin-level';
import useLSTAdmins from '@/hooks/use-lst-admins';
import { signAndExecute } from '@/utils';

import { LSTAdminsProps } from './lst.types';

const LSTAdmins: FC<LSTAdminsProps> = ({ lst }) => {
  const client = useSuiClient();
  const { register, getValues } = useForm();
  const { data: admins } = useLSTAdmins(lst);
  const currentAccount = useCurrentAccount();
  const signTransaction = useSignTransaction();
  const { data: adminCaps } = useLstAdminLevel(lst);
  const { data: blizzardAclSdk } = useBlizzardAclSdk();

  const superAdminCap = adminCaps?.find(({ level }) => level === 'super')?.id;

  const revokeObjectId = async (objectId: string) => {
    if (!superAdminCap || !blizzardAclSdk || !currentAccount) return;

    const toastId = toast.loading('Revoking adminCap...');

    try {
      const { tx } = await blizzardAclSdk.revokeAdmin({
        lstType: lst,
        admin: objectId,
        superAdmin: superAdminCap,
      });

      await signAndExecute({
        client,
        tx,
        currentAccount,
        signTransaction,
        callback: () => {
          toast.dismiss(toastId);
          toast.success('AdminCap revoked successfully!');
        },
        fallback: (message) => {
          toast.dismiss(toastId);
          toast.error(message || 'Failed to revoke adminCap');
        },
      });
    } catch (e) {
      toast.error((e as Error).message || 'Failed to revoke adminCap');
    } finally {
      toast.dismiss(toastId);
    }
  };

  const addNewAdmin = async () => {
    const owner = getValues('owner');

    if (
      !owner ||
      !superAdminCap ||
      !blizzardAclSdk ||
      !currentAccount ||
      !isValidSuiObjectId(owner)
    )
      return;

    const toastId = toast.loading('Adding admin...');

    try {
      const { tx } = await blizzardAclSdk.newAdminAndTransfer({
        lstType: lst,
        recipient: owner,
        superAdmin: superAdminCap,
      });

      await signAndExecute({
        client,
        tx,
        currentAccount,
        signTransaction,
        callback: () => {
          toast.dismiss(toastId);
          toast.success('Admin added successfully!');
        },
        fallback: (message) => {
          toast.dismiss(toastId);
          toast.error(message || 'Failed to add admin');
        },
      });
    } catch (e) {
      toast.error((e as Error).message || 'Failed to add admin');
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
        Admins
      </Typography>
      <Box
        width="100%"
        color="onSurface"
        gridColumn={['span 4', 'span 4', 'span 6', 'span 4']}
      >
        <TextField
          label="Address"
          {...register('owner')}
          nPlaceholder={{ opacity: 0.7 }}
          supportingText="Insert the new owner address"
          placeholder={formatAddress(normalizeSuiAddress('0x0'))}
          Suffix={
            <Button
              py="2xs"
              mr="-0.5rem"
              variant="filled"
              borderRadius="m"
              onClick={addNewAdmin}
            >
              Add
            </Button>
          }
        />
      </Box>
      {admins?.map((id) => (
        <Box
          key={id}
          width="100%"
          color="onSurface"
          gridColumn={['span 4', 'span 4', 'span 6', 'span 4']}
        >
          <TextField
            label="Object Id"
            pointerEvents="none"
            value={formatAddress(id)}
            placeholder={formatAddress(normalizeSuiObjectId('0x0'))}
            supportingText="Id of the admin cap authorized to manage this LST"
            Suffix={
              <Button
                py="2xs"
                mr="-0.5rem"
                variant="filled"
                borderRadius="m"
                bg="errorContainer"
                color="onErrorContainer"
                onClick={() => revokeObjectId(id)}
                nHover={{ bg: 'errorContainer', opacity: 0.8 }}
              >
                Delete
              </Button>
            }
          />
        </Box>
      ))}
    </>
  );
};

export default LSTAdmins;
