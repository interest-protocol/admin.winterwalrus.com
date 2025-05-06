import useSWR from 'swr';

import { useAccountAdminLevel } from '../use-account-admin-level';
import useBlizzardAclSdk from '../use-blizzard-acl-sdk';

export const useLstAdminLevel = (lst?: string) => {
  const { data } = useAccountAdminLevel();
  const currentAccount = {
    address:
      '0xfd1857b0672adaa2a0d037cf104177a5976e8a4af948c64c34fcc0ed34be0044',
  };
  const { data: blizzardAclSdk } = useBlizzardAclSdk(lst);

  return useSWR(
    [useLstAdminLevel.name, currentAccount?.address, lst, data, blizzardAclSdk],
    async () => {
      if (!currentAccount || !lst || !data || !blizzardAclSdk) return null;

      return data.find(({ lst: { type } }) => type === lst);
    }
  );
};
