import { Button } from '@interest-protocol/ui-kit';
import { ConnectButton, ConnectModal } from '@mysten/dapp-kit';
import { FC } from 'react';

const WalletButton: FC = () => {
  const currentAccount = {
    address:
      '0xfd1857b0672adaa2a0d037cf104177a5976e8a4af948c64c34fcc0ed34be0044',
  };

  if (currentAccount) return <ConnectButton />;

  return (
    <ConnectModal trigger={<Button variant="filled">Connect Wallet</Button>} />
  );
};

export default WalletButton;
