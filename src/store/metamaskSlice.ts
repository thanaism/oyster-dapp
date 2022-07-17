import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type MetaMaskState = {
  hasMetaMask: boolean;
  chainId: string | undefined;
  account: string | undefined;
  user: string | undefined;
};

const initialState: MetaMaskState = {
  hasMetaMask: false,
  chainId: undefined,
  account: undefined,
  user: undefined,
};

export const metamaskSlice = createSlice({
  name: 'metamask',
  initialState,
  reducers: {
    setHasMetaMask: (state: MetaMaskState, action: PayloadAction<boolean>) => ({
      ...state,
      hasMetaMask: action.payload,
    }),
    setChainId: (state: MetaMaskState, action: PayloadAction<string | undefined>) => ({
      ...state,
      chainId: action.payload,
    }),
    setUser: (state: MetaMaskState, action: PayloadAction<string | undefined>) => ({
      ...state,
      user: action.payload,
    }),
    setAccount: (state: MetaMaskState, action: PayloadAction<string | undefined>) => ({
      ...state,
      account: action.payload,
    }),
  },
});
