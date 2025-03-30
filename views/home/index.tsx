import { Box, Typography } from '@interest-protocol/ui-kit';
import { formatAddress } from '@mysten/sui/utils';
import { Img } from '@stylin.js/elements';
import { useRouter } from 'next/router';
import { FC } from 'react';
import unikey from 'unikey';

import { Layout } from '@/components';
import { useAccountAdminLevel } from '@/hooks/use-account-admin-level';

const Home: FC = () => {
  const { push } = useRouter();
  const { data, error } = useAccountAdminLevel();

  console.log({ error });

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
      {data?.map(({ lst, level }) => (
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
              {level}
            </Typography>
          </Box>
        </Box>
      ))}
    </Layout>
  );
};

export default Home;
