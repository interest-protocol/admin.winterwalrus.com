import useSWR from 'swr';

import { STAKING_OBJECTS } from '@/constants/objects';

import useBlizzardSdk from '../use-blizzard-sdk';

export const useBlizzardStaking = (lst?: string) => {
  const blizzardSdk = useBlizzardSdk();

  return useSWR([useBlizzardStaking.name, lst], async () => {
    if (!lst) return null;

    return blizzardSdk.getBlizzardStaking(
      STAKING_OBJECTS[lst]({ mutable: false }).objectId
    );
  });
};
