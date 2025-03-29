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

import { STAKING_OBJECTS } from '@/constants/objects';
import useBlizzardAclSdk from '@/hooks/use-blizzard-acl-sdk';
import useBlizzardSdk from '@/hooks/use-blizzard-sdk';
import { useLstAdminLevel } from '@/hooks/use-lst-admin-level';
import useLSTValidators from '@/hooks/use-lst-validators';
import { signAndExecute } from '@/utils';

import { LSTAdminsProps } from './lst.types';

const LSTValidators: FC<LSTAdminsProps> = ({ lst }) => {
  const client = useSuiClient();
  const blizzardSdk = useBlizzardSdk();
  const { register, getValues } = useForm();
  const currentAccount = useCurrentAccount();
  const signTransaction = useSignTransaction();
  const { data: adminCaps } = useLstAdminLevel(lst);
  const { data: validators } = useLSTValidators(lst);
  const { data: blizzardAclSdk } = useBlizzardAclSdk(lst);

  const adminCap = adminCaps?.find(({ level }) => level === 'admin')?.id;

  const removeValidator = async (node: string) => {
    if (!adminCap || !currentAccount || !lst || !blizzardAclSdk) return;

    const { tx, returnValues } = await blizzardAclSdk.signIn({
      admin: adminCap,
    });

    const toastId = toast.loading('Removing validator...');

    try {
      await blizzardSdk.removeNode({
        nodeId: node,
        adminWitness: returnValues,
        blizzardStaking: STAKING_OBJECTS[lst]({ mutable: true }).objectId,
      });

      await signAndExecute({
        tx,
        client,
        currentAccount,
        signTransaction,
        callback: () => {
          toast.dismiss(toastId);
          toast.success('Validator removed successfully!');
        },
        fallback: (message) => {
          toast.dismiss(toastId);
          toast.error(message || 'Failed to remove validator');
        },
      });
    } catch (e) {
      toast.error((e as Error).message || 'Failed to remove validator');
    } finally {
      toast.dismiss(toastId);
    }
  };

  const addValidator = async () => {
    const nodeId = getValues('nodeId');

    if (
      !lst ||
      !nodeId ||
      !adminCap ||
      !blizzardAclSdk ||
      !currentAccount ||
      !isValidSuiObjectId(nodeId)
    )
      return;

    const toastId = toast.loading('Adding validator...');

    try {
      const { tx, returnValues } = await blizzardAclSdk.signIn({
        admin: adminCap,
      });

      await blizzardSdk.removeNode({
        nodeId,
        adminWitness: returnValues,
        blizzardStaking: STAKING_OBJECTS[lst]({ mutable: true }).objectId,
      });

      await signAndExecute({
        tx,
        client,
        currentAccount,
        signTransaction,
        callback: () => {
          toast.dismiss(toastId);
          toast.success('Validator added successfully!');
        },
        fallback: (message) => {
          toast.dismiss(toastId);
          toast.error(message || 'Failed to add validator');
        },
      });
    } catch (e) {
      toast.error((e as Error).message || 'Failed to add validator');
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
        Validators
      </Typography>
      <Box
        width="100%"
        color="onSurface"
        gridColumn={['span 4', 'span 4', 'span 6', 'span 4']}
      >
        <TextField
          label="Node Id"
          {...register('nodeId')}
          nPlaceholder={{ opacity: 0.7 }}
          supportingText="Insert the new node id"
          placeholder={formatAddress(normalizeSuiAddress('0x0'))}
          Suffix={
            <Button
              py="2xs"
              mr="-0.5rem"
              variant="filled"
              borderRadius="m"
              onClick={addValidator}
            >
              Add
            </Button>
          }
        />
      </Box>
      {validators?.map((id) => (
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
                onClick={() => removeValidator(id)}
                nHover={{ bg: 'errorContainer', opacity: 0.8 }}
                nFocus={{ bg: 'errorContainer', opacity: 0.9 }}
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

export default LSTValidators;
