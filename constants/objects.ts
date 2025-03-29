import { SHARED_OBJECTS, TYPES } from '@interest-protocol/blizzard-sdk';
import { normalizeStructTag } from '@mysten/sui/utils';

export const LSTS = {
  WWAL: TYPES.WWAL,
  BREADWAL: normalizeStructTag(
    '5f70820b716a1d83580e5cf36dd0d0915b8763e1b85e3ef3db821ff40846be44::bread_wal::BREAD_WAL'
  ),
  PWAL: normalizeStructTag(
    '0f03158a2caec1b656ee929007d08e58d620eeabeacac90ea7657d8b386b00b9::pwal::PWAL'
  ),
  NWAL: normalizeStructTag(
    'd8b855d48fb4d8ffbb5c4a3ecac27b00f3712ce58626deb5a16a290e0c6edf84::nwal::NWA'
  ),
} as const;

export const STAKING_OBJECTS = {
  [LSTS.WWAL]: SHARED_OBJECTS.WWAL_STAKING,
  [LSTS.BREADWAL]: SHARED_OBJECTS.BREAD_WAL_STAKING,
  [LSTS.PWAL]: SHARED_OBJECTS.PWAL_STAKING,
  [LSTS.NWAL]: SHARED_OBJECTS.NWAL_STAKING,
};

export const ACL_OBJECTS = {
  [LSTS.WWAL]: SHARED_OBJECTS.WWAL_ACL,
  [LSTS.BREADWAL]: SHARED_OBJECTS.BREAD_WAL_ACL,
  [LSTS.PWAL]: SHARED_OBJECTS.PWAL_ACL,
  [LSTS.NWAL]: SHARED_OBJECTS.NWAL_ACL,
};
