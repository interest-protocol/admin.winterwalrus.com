import { Box, Button, Typography } from '@interest-protocol/ui-kit';
import { useRouter } from 'next/router';
import { values } from 'ramda';
import { FC } from 'react';

import { Layout } from '@/components';
import { useLstAdminLevel } from '@/hooks/use-lst-admin-level';

import LSTAdmins from './lst-admins';
import LSTFees from './lst-fees';
import LSTMetadata from './lst-metadata';
import LSTMetrics from './lst-metrics';
import LSTValidators from './lst-validators';

const LST: FC = () => {
  const { query, push } = useRouter();
  const { data } = useLstAdminLevel(String(query.lst));

  const lst = data?.lst;
  const isAdmin = values(data?.access ?? {}).includes('admin');
  const isSuperAdmin = values(data?.access ?? {}).includes('super');

  return (
    <Layout>
      <Button
        isIcon
        variant="tonal"
        color="onSurface"
        onClick={() => push('/')}
      >
        {'<'}
      </Button>
      <Typography
        width="100%"
        size="medium"
        color="onSurface"
        gridColumn="2/-1"
        variant="headline"
      >
        {lst?.symbol} panel
      </Typography>
      <LSTMetrics lst={lst?.type} />
      {isSuperAdmin && (
        <>
          <Box gridColumn="1/-1" />
          <LSTAdmins lst={lst?.type} />
        </>
      )}
      {isAdmin && (
        <>
          <Box gridColumn="1/-1" />
          <LSTMetadata lst={lst} />
          <Box gridColumn="1/-1" />
          <LSTFees lst={lst} />
          <Box gridColumn="1/-1" />
          <LSTValidators lst={lst?.type} />
        </>
      )}
    </Layout>
  );
};

export default LST;
