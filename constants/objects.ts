import { SHARED_OBJECTS, TYPES } from '@interest-protocol/blizzard-sdk';

export const STAKING_OBJECTS = {
  [TYPES.WWAL]: SHARED_OBJECTS.WWAL_STAKING,
  [TYPES.BREAD_WAL]: SHARED_OBJECTS.BREAD_WAL_STAKING,
  [TYPES.PWAL]: SHARED_OBJECTS.PWAL_STAKING,
  [TYPES.NWAL]: SHARED_OBJECTS.NWAL_STAKING,
  [TYPES.MWAL]: SHARED_OBJECTS.MWAL_STAKING,
  [TYPES.UP_WAL]: SHARED_OBJECTS.UP_WAL_STAKING,
  [TYPES.TR_WAL]: SHARED_OBJECTS.TR_WAL_STAKING,
};

export const ACL_OBJECTS = {
  [TYPES.WWAL]: SHARED_OBJECTS.WWAL_ACL,
  [TYPES.BREAD_WAL]: SHARED_OBJECTS.BREAD_WAL_ACL,
  [TYPES.PWAL]: SHARED_OBJECTS.PWAL_ACL,
  [TYPES.NWAL]: SHARED_OBJECTS.NWAL_ACL,
  [TYPES.MWAL]: SHARED_OBJECTS.MWAL_ACL,
  [TYPES.UP_WAL]: SHARED_OBJECTS.UP_WAL_ACL,
  [TYPES.TR_WAL]: SHARED_OBJECTS.TR_WAL_ACL,
};
