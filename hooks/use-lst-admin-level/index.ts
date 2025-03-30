import { useCurrentAccount } from '@mysten/dapp-kit';
import useSWR from 'swr';

import { useAccountAdminLevel } from '../use-account-admin-level';
import useBlizzardAclSdk from '../use-blizzard-acl-sdk';

export const useLstAdminLevel = (lst?: string) => {
  const { data } = useAccountAdminLevel();
  const currentAccount = useCurrentAccount();
  const { data: blizzardAclSdk } = useBlizzardAclSdk(lst);

  return useSWR(
    [useLstAdminLevel.name, currentAccount?.address, lst, data, blizzardAclSdk],
    async () => {
      if (!currentAccount || !lst || !data || !blizzardAclSdk) return null;

      return data.filter(({ lst: { type } }) => type === lst);
    }
  );
};
