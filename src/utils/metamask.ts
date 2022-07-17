import { Dispatch } from 'react';
import { AnyAction } from 'redux';
import { MetaMaskState, metamaskSlice } from 'store/metamaskSlice';
import { MetaMaskInpageProvider } from '@metamask/providers';
import { auth } from './firebase';

const { actions } = metamaskSlice;

export const requestAccount = async (): Promise<string | undefined> => {
  const { ethereum } = window as unknown as { ethereum: MetaMaskInpageProvider };

  if (ethereum == null) return undefined;
  console.log(ethereum.request.bind(ethereum));
  const accounts = (await ethereum.request({ method: 'eth_requestAccounts' })) as string[];
  return accounts.length > 0 ? accounts[0] : undefined;
};
export const getAccount = async (): Promise<string | undefined> => {
  const { ethereum } = window as unknown as { ethereum: MetaMaskInpageProvider };
  if (ethereum == null) return undefined;
  const accounts = (await ethereum.request({ method: 'eth_accounts' })) as string[];
  return accounts.length > 0 ? accounts[0] : undefined;
};

export const displayAccount = (metamask: MetaMaskState): string => {
  const account = metamask?.account;
  return account ? `${account.substring(0, 6)}...${account.substring(38)}` : '';
};

export const hasMetaMask = (): boolean => {
  const { ethereum } = window as unknown as { ethereum: MetaMaskInpageProvider };
  if (ethereum == null) return false;
  return ethereum.isMetaMask;
};

interface ProviderConnectInfo {
  readonly chainId: string;
}

interface ProviderRpcError extends Error {
  message: string;
  code: number;
  data?: unknown;
}

export const startMonitoringMetamask = (
  dispatch: Dispatch<AnyAction>,
  metamask: MetaMaskState,
): void => {
  void getAccount().then((value) => {
    dispatch(actions.setAccount(value));
    if (metamask?.user != null) void auth.signOut();
    console.log('Eth gotAccount', displayAccount(metamask));
  });

  if (!hasMetaMask()) return;

  const { ethereum } = window as unknown as { ethereum: MetaMaskInpageProvider };
  type VoidFunc = (...args: unknown[]) => void;

  ethereum.on('accountsChanged', ((accounts: string[]) => {
    console.log('accountsChanged', accounts.length);
    if (accounts.length === 0) {
      dispatch(actions.setAccount(undefined));
      if (metamask.user != null) void auth.signOut();
    } else {
      dispatch(actions.setAccount(accounts[0]));
      if (metamask.user != null) void auth.signOut();
      console.log('Eth acountsChanged', displayAccount(metamask));
    }
  }) as VoidFunc);

  ethereum.on('connect', ((info: ProviderConnectInfo): void => {
    console.log('Eth connect', info, displayAccount(metamask));
    dispatch(actions.setChainId(info.chainId));
  }) as VoidFunc);

  ethereum.on('disconnect', ((info: ProviderRpcError): void => {
    console.log('Eth disconnect', info);
  }) as VoidFunc);

  ethereum.on('chainChanged', ((chainId: string) => {
    dispatch(actions.setChainId(chainId));
  }) as VoidFunc);
};

export const getChainId = async (dispatch: Dispatch<AnyAction>): Promise<void> => {
  try {
    const { ethereum } = window as unknown as { ethereum: MetaMaskInpageProvider };
    const chainId = await ethereum.request({
      method: 'eth_chainId',
    });
    if (chainId != null && typeof chainId === 'string') dispatch(actions.setChainId(chainId));
  } catch (e) {
    console.log(e);
  }
};

export const initializeEthereum = (
  dispatch: Dispatch<AnyAction>,
  metamask: MetaMaskState,
): void => {
  const setEthereum = () => {
    if (!metamask?.hasMetaMask) {
      dispatch(actions.setHasMetaMask(true));
      void startMonitoringMetamask(dispatch, metamask);
      void getChainId(dispatch);
    }
  };
  const { ethereum } = window as unknown as { ethereum: MetaMaskInpageProvider };
  if (ethereum != null) {
    setEthereum();
  } else {
    window.addEventListener(
      'ethereum#initialized',
      () => {
        setEthereum();
      },
      { once: true },
    );
    setTimeout(setEthereum, 30000); // 30 seconds in which nothing happens on android
  }
};

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

export const switchNetwork = async (
  chainId: ChainId,
  dispatch: Dispatch<AnyAction>,
): Promise<void> => {
  try {
    const { ethereum } = window as unknown as { ethereum: MetaMaskInpageProvider };
    await ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId }],
    });
    dispatch(actions.setChainId(chainId));
  } catch (e) {
    console.log(e);
  }
};

export const addMumbaiNetworkToWallet = async (): Promise<void> => {
  try {
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
  } catch (e) {
    console.log(e);
  }
};

export const addKakiCoinAsset = async (metamask: MetaMaskState): Promise<void> => {
  try {
    if (metamask.chainId !== ChainIds.MumbaiTestNet) throw Error('Need to switch network...');
    const { ethereum } = window as unknown as { ethereum: MetaMaskInpageProvider };
    await ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address: '0x23f84887e93CDbaCF6126912C34fA452C02e8302',
          symbol: 'OYSTER',
          decimals: 18,
        },
      },
    });
  } catch (e) {
    console.log(e);
  }
};
