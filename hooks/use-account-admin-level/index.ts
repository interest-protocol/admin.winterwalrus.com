import { BlizzardAclSDK } from '@interest-protocol/blizzard-sdk';
import { useCurrentAccount, useSuiClient } from '@mysten/dapp-kit';
import useSWR from 'swr';

import { ADMIN_LEVEL, SUPER_ADMIN_LEVEL } from '@/constants';
import { ACL_OBJECTS } from '@/constants/objects';
import { CoinMetadata } from '@/interface';

type Level = 'admin' | 'super';

interface AdminLevel {
  id: string;
  lst: CoinMetadata;
  level: Level | null;
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
          MoveModule: {
            module: 'blizzard_acl',
            package:
              '0x29ba7f7bc53e776f27a6d1289555ded2f407b4b1a799224f06b26addbcd1c33d',
          },
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

      const validityLstsLevel = await Promise.all(
        lstsLevel.map(async ({ lst, level, id }) => {
          const aclSdk = new BlizzardAclSDK({
            acl: ACL_OBJECTS[lst]({ mutable: true }).objectId,
          });

          if (level === 'super') return true;

          return aclSdk.isAdmin({ admin: id, lstType: lst });
        })
      );

      const finalLstsLevel = lstsLevel.filter(
        (_, index) => validityLstsLevel[index]
      );

      const lstsTypes = finalLstsLevel.map(({ lst }) => lst);

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

      return finalLstsLevel.map(
        ({ lst, ...rest }) =>
          ({
            ...rest,
            lst: lstsMetadata[lst],
          }) as AdminLevel
      );
    }
  );
};
