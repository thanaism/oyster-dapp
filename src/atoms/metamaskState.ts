import { atom } from 'recoil';

export const metamaskExistence = atom({
  key: 'MetaMaskExistence',
  default: false,
});

export const metamaskChainId = atom<string | undefined>({
  key: 'MetaMaskChainId',
  default: undefined,
});

export const metamaskAddress = atom<string | undefined>({
  key: 'MetaMaskAddress',
  default: undefined,
});

export const metamaskVerifiedAddress = atom<string | undefined>({
  key: 'MetaMaskVerifiedAddress',
  default: undefined,
});
