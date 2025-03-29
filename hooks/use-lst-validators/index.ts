import useSWR from 'swr';

import { STAKING_OBJECTS } from '@/constants/objects';

import useBlizzardSdk from '../use-blizzard-sdk';

const useLSTValidators = (lst?: string) => {
  const blizzardSDK = useBlizzardSdk();

  return useSWR<ReadonlyArray<string>>(
    [useLSTValidators.name, lst],
    async () => {
      if (!lst) return null;

      return blizzardSDK.allowedNodes(
        STAKING_OBJECTS[lst]({ mutable: false }).objectId
      );
    }
  );
};

export default useLSTValidators;
