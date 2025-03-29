import useSWR from 'swr';

import { STAKING_OBJECTS } from '@/constants/objects';

import useBlizzardSdk from '../use-blizzard-sdk';

export const useFees = (lst?: string) => {
  const blizzardSdk = useBlizzardSdk();

  return useSWR([useFees.name, lst], async () => {
    if (!lst) return null;

    const fees = await blizzardSdk.getFees(
      STAKING_OBJECTS[lst]({ mutable: false }).objectId
    );

    return {
      staking: +fees.mint,
      unstaking: +fees.burn,
      transmute: +fees.transmute,
    };
  });
};
