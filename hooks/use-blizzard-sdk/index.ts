import { BlizzardSDK } from '@interest-protocol/blizzard-sdk';
import { getFullnodeUrl } from '@mysten/sui/client';

const blizzardSdk = new BlizzardSDK({
  fullNodeUrl: process.env.NEXT_PUBLIC_RPC ?? getFullnodeUrl('mainnet'),
});

const useBlizzardSdk = (): BlizzardSDK => blizzardSdk;

export default useBlizzardSdk;
