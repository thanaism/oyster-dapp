import detectEthereumProvider from '@metamask/detect-provider';
import { MetaMaskInpageProvider } from '@metamask/providers';
import {
  metamaskAddress,
  metamaskChainId,
  metamaskExistence,
  metamaskVerifiedAddress,
} from 'atoms/metamaskState';
import { getAuth } from 'firebase/auth';
import { useEffect } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { getAccount } from 'utils/metamask';

// eslint-disable-next-line import/prefer-default-export
export const useMetaMask = () => {
  const [hasMetaMask, setHasMetaMask] = useRecoilState(metamaskExistence);
  const [account, setAccount] = useRecoilState(metamaskAddress);
  const user = useRecoilValue(metamaskVerifiedAddress);
  const setChainId = useSetRecoilState(metamaskChainId);

  useEffect(() => {
    if (hasMetaMask) return;

    const detect = async () => {
      const provider = (await detectEthereumProvider({
        mustBeMetaMask: true,
      })) as MetaMaskInpageProvider;

      if (provider == null) return;
      const auth = getAuth();
      type Listener = (...args: unknown[]) => void;

      const address = await getAccount();
      setAccount(address);

      provider.on('accountsChanged', ((accounts: string[]) => {
        console.log('accountsChanged', accounts.length);
        if (accounts.length === 0) {
          setAccount(undefined);
          if (user != null) void auth.signOut();
        } else {
          setAccount(accounts[0]);
          if (user != null) void auth.signOut();
          console.log('Eth acountsChanged', account);
        }
      }) as Listener);

      interface ProviderConnectInfo {
        readonly chainId: string;
      }
      provider.on('connect', ((info: ProviderConnectInfo): void => {
        console.log('Eth connect', info, account);
        setChainId(info.chainId);
      }) as Listener);

      interface ProviderRpcError extends Error {
        message: string;
        code: number;
        data?: unknown;
      }
      provider.on('disconnect', ((info: ProviderRpcError): void => {
        console.log('Eth disconnect', info);
      }) as Listener);

      provider.on('chainChanged', ((chainId: string) => {
        setChainId(chainId);
      }) as Listener);

      setHasMetaMask(true);
    };

    void detect();
  }, []);
};
