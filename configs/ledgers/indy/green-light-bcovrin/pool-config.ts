import { IndyPoolConfig } from '@aries-framework/core/build/modules/ledger/IndyPool';

import genesisFile from './genesis-file';

const config: IndyPoolConfig = {
  id: 'GreenLightBcovrin',
  genesisTransactions: genesisFile,
  isProduction: false,
};

export default config;
