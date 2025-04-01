import { BlizzardAclSDK } from '@interest-protocol/blizzard-sdk';
import { useCurrentAccount, useSuiClient } from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui/client';
import { toPairs, values } from 'ramda';
import useSWR from 'swr';

import { ADMIN_LEVEL, SUPER_ADMIN_LEVEL } from '@/constants';
import { ACL_OBJECTS } from '@/constants/objects';
import { CoinMetadata } from '@/interface';

type Level = 'admin' | 'super';

interface RawAdminLevel {
  lst: string;
  access: Record<string, Level>;
}

interface AdminLevel extends Omit<RawAdminLevel, 'lst'> {
  lst: CoinMetadata;
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

      const lstsLevelMap = objects.data.reduce(
        (acc, data) => {
          if (!data?.data?.type) return acc;

          const level: Level | null = data.data.type.startsWith(
            SUPER_ADMIN_LEVEL
          )
            ? 'super'
            : data.data.type.startsWith(ADMIN_LEVEL)
              ? 'admin'
              : null;

          if (!level) return acc;

          const lst = data.data.type.split('<')[1].slice(0, -1);
          const id = data.data.objectId;

          return {
            ...acc,
            [lst]: {
              lst,
              access: {
                ...acc?.[lst]?.access,
                [id]: level,
              },
            },
          };
        },
        {} as Record<string, RawAdminLevel>
      );

      const lstsLevel = values(lstsLevelMap);

      const validityLstsLevel: Record<string, ReadonlyArray<boolean>> = {};

      for (const lstLevel of lstsLevel) {
        validityLstsLevel[lstLevel.lst] = await Promise.all(
          toPairs(lstLevel.access).map(async ([id, level]) => {
            const aclSdk = new BlizzardAclSDK({
              fullNodeUrl:
                process.env.NEXT_PUBLIC_RPC ?? getFullnodeUrl('mainnet'),
              acl: ACL_OBJECTS[lstLevel.lst]({ mutable: true }).objectId,
            });

            if (level === 'super') return true;

            return aclSdk.isAdmin({ admin: id, lstType: lstLevel.lst });
          })
        );
      }

      const finalLstsLevel = lstsLevel.map(({ lst, access }) => ({
        lst,
        access: toPairs(access)
          .filter((_, index) => validityLstsLevel[lst][index])
          .reduce((acc, [id, level]) => ({ ...acc, [id]: level }), {}),
      }));

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
