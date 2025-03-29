import { CoinMetadata } from '@/interface';

export interface LSTProps {
  isAdmin: boolean;
}

export interface LSTAdminsProps {
  lst?: string;
}

export interface LSTMetadataProps extends LSTProps {
  lst?: CoinMetadata;
}
