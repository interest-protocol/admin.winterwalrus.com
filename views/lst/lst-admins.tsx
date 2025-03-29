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

    const { tx } = await blizzardAclSdk.revokeAdmin({
      lstType: lst,
      admin: objectId,
      superAdmin: superAdminCap,
    });

    signAndExecute({ client, tx, currentAccount, signTransaction });
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

    const { tx } = await blizzardAclSdk.newAdminAndTransfer({
      lstType: lst,
      recipient: owner,
      superAdmin: superAdminCap,
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
        Admins
      </Typography>
      <Box gridColumn="span 4" color="onSurface" width="100%">
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
        <Box gridColumn="span 4" color="onSurface" width="100%" key={id}>
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
