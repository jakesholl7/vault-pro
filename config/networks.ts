import Constants from 'expo-constants';

export interface Network {
  name: string;
  rpc: string;
  nativeCurrency: string;
}

export const networks: Record<string, Network> = {
  playblock: {
    name: 'PlayBlock',
    rpc: Constants.expoConfig?.extra?.rpcPlayblock || 'https://rpc.playblock.com',
    nativeCurrency: 'GCOIN',
  },
  ethereum: {
    name: 'Ethereum',
    rpc: Constants.expoConfig?.extra?.rpcEthereum || 'https://cloudflare-eth.com',
    nativeCurrency: 'ETH',
  },
  polygon: {
    name: 'Polygon',
    rpc: Constants.expoConfig?.extra?.rpcPolygon || 'https://polygon-rpc.com',
    nativeCurrency: 'MATIC',
  },
};

export const defaultNetwork = Constants.expoConfig?.extra?.defaultNetwork || 'playblock';