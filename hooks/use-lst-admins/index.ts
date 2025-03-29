import { useSuiClient } from '@mysten/dapp-kit';
import { pathOr } from 'ramda';
import useSWR from 'swr';

import { ACL_OBJECTS } from '@/constants/objects';

const useLSTAdmins = (lst?: string) => {
  const client = useSuiClient();

  return useSWR([useLSTAdmins.name, lst], async () => {
    if (!lst) return null;

    const acl = await client.getObject({
      id: ACL_OBJECTS[lst]({ mutable: true }).objectId,
      options: {
        showContent: true,
      },
    });

    return pathOr(
      [],
      ['data', 'content', 'fields', 'admins', 'fields', 'contents'],
      acl
    );
  });
};

export default useLSTAdmins;
