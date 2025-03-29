import { NextPage } from 'next';

import { SEO } from '@/components';
import LST from '@/views/lst';

const HomePage: NextPage = () => (
  <>
    <SEO />
    <LST />
  </>
);

export default HomePage;
