import { Box, Typography } from '@interest-protocol/ui-kit';
import { formatAddress } from '@mysten/sui/utils';
import { Img } from '@stylin.js/elements';
import { useRouter } from 'next/router';
import { values } from 'ramda';
import { FC } from 'react';
import unikey from 'unikey';

import { Layout } from '@/components';
import { useAccountAdminLevel } from '@/hooks/use-account-admin-level';

const Home: FC = () => {
  const { push } = useRouter();
  const { data } = useAccountAdminLevel();

  return (
    <Layout>
      <Typography
        width="100%"
        size="medium"
        color="onSurface"
        gridColumn="1/-1"
        variant="headline"
      >
        Select LST
      </Typography>
      {data?.map(({ lst, access }) => (
        <Box
          p="xl"
          gap="xl"
          width="100%"
          bg="container"
          display="flex"
          key={unikey()}
          cursor="pointer"
          color="onSurface"
          borderRadius="xs"
          border="1px solid"
          gridColumn="span 4"
          alignItems="center"
          borderColor="outlineVariant"
          nHover={{ borderColor: 'primary' }}
          onClick={() => push(`/${lst.type}`)}
        >
          <Img width="4rem" height="4rem" alt={lst.symbol} src={lst.iconUrl} />
          <Box display="flex" gap="2xs" flexDirection="column">
            <Typography variant="title" size="medium">
              {lst.name} ({lst.symbol})
            </Typography>
            <Typography variant="body" size="medium">
              {formatAddress(lst.type!)}
            </Typography>
            <Typography variant="label" size="medium">
              {Array.from(new Set(values(access))).join(' & ')}
            </Typography>
          </Box>
        </Box>
      ))}
    </Layout>
  );
};

export default Home;
// just chane execute on ur UI to dry run

// bread super admin -> 0x0de83d626d1ed8ab2e337a8cb306c1136858cfed0b0ca41b4cbbdc91224f89da

// bread acc -> 0xd94414fabb3930998c99696331b49a4fe60372abb0618a22714a0123bfc876b2
