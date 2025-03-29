import { useCurrentAccount } from '@mysten/dapp-kit';
import useSWR from 'swr';

import { useAccountAdminLevel } from '../use-account-admin-level';

export const useLstAdminLevel = (lst?: string) => {
  const currentAccount = useCurrentAccount();

  const { data } = useAccountAdminLevel();

  return useSWR(
    [useLstAdminLevel.name, currentAccount?.address, lst],
    async () => {
      if (!currentAccount || !lst || !data) return null;

      return data.filter(({ lst: { type } }) => type === lst);
    }
  );
};
