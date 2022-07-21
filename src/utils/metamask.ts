import { MetaMaskInpageProvider } from '@metamask/providers';

const KAKICOIN_CONTRACT_ADDRESS = '0x23f84887e93CDbaCF6126912C34fA452C02e8302';

export const ChainIds = {
  Mainnet: '0x1',
  RopstenTestNet: '0x3',
  RinkebyTestNet: '0x4',
  KovanTestNet: '0x2a',
  Polygon: '0x89',
  GoerliTestNet: '0x1a4',
  MumbaiTestNet: '0x13881',
} as const;

type ChainId = typeof ChainIds[keyof typeof ChainIds];

export const requestAccount = async (): Promise<string | undefined> => {
  const { ethereum } = window as unknown as { ethereum: MetaMaskInpageProvider };
  if (ethereum == null) return undefined;
  const accounts = (await ethereum.request({ method: 'eth_requestAccounts' })) as string[];
  return accounts.length > 0 ? accounts[0] : undefined;
};

export const getAccount = async (): Promise<string | undefined> => {
  const { ethereum } = window as unknown as { ethereum: MetaMaskInpageProvider };
  if (ethereum == null) return undefined;
  const accounts = (await ethereum.request({ method: 'eth_accounts' })) as string[];
  return accounts.length > 0 ? accounts[0] : undefined;
};

export const switchNetwork = async (chainId: ChainId): Promise<void> => {
  const { ethereum } = window as unknown as { ethereum: MetaMaskInpageProvider };
  await ethereum.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId }],
  });
};

export const addMumbaiNetworkToWallet = async (): Promise<void> => {
  const { ethereum } = window as unknown as { ethereum: MetaMaskInpageProvider };
  await ethereum.request({
    method: 'wallet_addEthereumChain',
    params: [
      {
        chainId: '0x13881',
        blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
        nativeCurrency: {
          decimals: 18,
          symbol: 'MATIC',
        },
        chainName: 'Mumbai Test Network',
        rpcUrls: ['https://matic-testnet-archive-rpc.bwarelabs.com'],
      },
    ],
  });
};

export const registerKakiCoinWithWallet = async (chainId: string): Promise<void> => {
  if (chainId !== ChainIds.MumbaiTestNet) throw Error('Need to switch network...');
  const { ethereum } = window as unknown as { ethereum: MetaMaskInpageProvider };
  await ethereum.request({
    method: 'wallet_watchAsset',
    params: {
      type: 'ERC20',
      options: {
        address: KAKICOIN_CONTRACT_ADDRESS,
        symbol: 'OYSTER',
        decimals: 18,
      },
    },
  });
};
