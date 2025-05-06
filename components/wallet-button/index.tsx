import { Button } from '@interest-protocol/ui-kit';
import {
  ConnectButton,
  ConnectModal,
  useCurrentAccount,
} from '@mysten/dapp-kit';
import { FC } from 'react';

const WalletButton: FC = () => {
  const currentAccount = useCurrentAccount();

  if (currentAccount) return <ConnectButton />;

  return (
    <ConnectModal trigger={<Button variant="filled">Connect Wallet</Button>} />
  );
};

export default WalletButton;
