import { useCurrentAccount, useSuiClient } from '@mysten/dapp-kit';
import useSWR from 'swr';

import { ADMIN_LEVEL, SUPER_ADMIN_LEVEL } from '@/constants';
import { CoinMetadata } from '@/interface';

interface AdminLevel {
  id: string;
  lst: CoinMetadata;
  level: 'admin' | 'super' | null;
}

export const useAccountAdminLevel = () => {
  const client = useSuiClient();
  const currentAccount = useCurrentAccount();

  return useSWR<ReadonlyArray<AdminLevel> | null>(
    [useAccountAdminLevel.name, currentAccount?.address],
    async () => {
      if (!currentAccount) return null;

      const objects = await client.getOwnedObjects({
        owner: currentAccount.address,
        filter: {
          Package:
            '0x29ba7f7bc53e776f27a6d1289555ded2f407b4b1a799224f06b26addbcd1c33d',
        },
        options: { showType: true },
      });

      const lstsLevel = objects.data.flatMap((data) =>
        data?.data?.type
          ? {
              id: data.data.objectId,
              lst: data.data.type.split('<')[1].slice(0, -1),
              level: data.data.type.startsWith(SUPER_ADMIN_LEVEL)
                ? 'super'
                : data.data.type.startsWith(ADMIN_LEVEL)
                  ? 'admin'
                  : null,
            }
          : []
      );

      const lstsTypes = lstsLevel.map(({ lst }) => lst);

      const lstsMetadata = await fetch(
        `https://api.interestlabs.io/v1/coins/mainnet/metadatas?coinTypes=${lstsTypes}`
      )
        .then((res) => res.json())
        .then((data: ReadonlyArray<CoinMetadata>) =>
          data.reduce(
            (acc, curr) => ({ ...acc, [curr.type]: curr }),
            {} as Record<string, CoinMetadata>
          )
        );

      return lstsLevel.map(
        ({ lst, ...rest }) =>
          ({
            ...rest,
            lst: lstsMetadata[lst],
          }) as AdminLevel
      );
    }
  );
};
