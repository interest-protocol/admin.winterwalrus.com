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
import { FC, useState } from 'react';

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
  const currentAccount = useCurrentAccount();
  const [nodeId, setNodeId] = useState<string>();
  const signTransaction = useSignTransaction();
  const { data: adminCaps } = useLstAdminLevel(lst);
  const { data: blizzardAclSdk } = useBlizzardAclSdk();
  const { data: validators } = useLSTValidators(lst);

  const adminCap = adminCaps?.find(({ level }) => level === 'admin')?.id;

  const removeValidator = async (node: string) => {
    if (!adminCap || !currentAccount || !lst || !blizzardAclSdk) return;

    const { tx, returnValues } = await blizzardAclSdk.signIn({
      admin: adminCap,
    });

    await blizzardSdk.removeNode({
      nodeId: node,
      adminWitness: returnValues,
      blizzardStaking: STAKING_OBJECTS[lst]({ mutable: true }).objectId,
    });

    signAndExecute({ client, tx, currentAccount, signTransaction });
  };

  const addValidator = async () => {
    if (
      !lst ||
      !nodeId ||
      !adminCap ||
      !blizzardAclSdk ||
      !currentAccount ||
      !isValidSuiObjectId(nodeId)
    )
      return;

    const { tx, returnValues } = await blizzardAclSdk.signIn({
      admin: adminCap,
    });

    await blizzardSdk.removeNode({
      nodeId,
      adminWitness: returnValues,
      blizzardStaking: STAKING_OBJECTS[lst]({ mutable: true }).objectId,
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
        Validators
      </Typography>
      <Box gridColumn="span 4" color="onSurface" width="100%">
        <TextField
          label="Node Id"
          defaultValue={nodeId}
          nPlaceholder={{ opacity: 0.7 }}
          onChange={(e) => setNodeId(e.target.value)}
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
                onClick={() => removeValidator(id)}
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

export default LSTValidators;
