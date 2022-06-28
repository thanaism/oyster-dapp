/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from 'firebase/auth';

export type MetaMaskState = {
  hasEthereum: boolean;
  chainId: string | undefined;
  account: string | undefined;
  user: User | undefined;
};

const initialState: MetaMaskState = {
  hasEthereum: false,
  chainId: undefined,
  account: undefined,
  user: undefined,
};

export const metamaskSlice = createSlice({
  name: 'metamask',
  initialState,
  reducers: {
    setHasEthereum: (state: MetaMaskState, action: PayloadAction<boolean>) => ({
      ...state,
      hasEthereum: action.payload,
      // if (state.ethereum) startMonitoringMetamask();
    }),
    setChainId: (state: MetaMaskState, action: PayloadAction<string | undefined>) => ({
      ...state,
      chainId: action.payload,
    }),
    setUser: (state: MetaMaskState, action: PayloadAction<User | undefined>) => ({
      ...state,
      user: action.payload,
    }),
    setAccount: (state: MetaMaskState, action: PayloadAction<string | undefined>) => ({
      ...state,
      account: action.payload,
      // if (state.user) auth.signOut();
    }),
  },
});
