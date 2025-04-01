import { BlizzardAclSDK } from '@interest-protocol/blizzard-sdk';
import useSWR from 'swr';

import { ACL_OBJECTS } from '@/constants/objects';

const useBlizzardAclSdk = (lst?: string) =>
  useSWR<BlizzardAclSDK | null>([useBlizzardAclSdk.name, lst], () => {
    if (!lst) return null;

    return new BlizzardAclSDK({
      acl: ACL_OBJECTS[lst]({ mutable: true }).objectId,
      fullNodeUrl: process.env.NEXT_PUBLIC_RPC!,
    });
  });

export default useBlizzardAclSdk;
