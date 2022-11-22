import { createSlice } from '@reduxjs/toolkit';

import { chainList, langList } from '../config';

export const walletSlice = createSlice({
  name: 'wallet',
  initialState: {
    defaultAccount: '',
    provider: null,
    signer: null,
    chain: chainList[0],
    airdropContract: null,
    // lang: langList[0],
    loading: '',
    alert: null,
  },
  reducers: {
    connect: (state, action) => {
      state.provider = action.payload.provider;
      state.signer = action.payload.signer;
      state.airdropContract = action.payload.contract;
      state.loading = false;
    },
    account: (state, action) => {
      state.defaultAccount = action.payload;
    },
    chain: (state, action) => {
      state.chain = action.payload;
      state.loading = false;
    },
    lang: (state, action) => {
      state.lang = action.payload;
    },
    alert: (state, action) => {
      state.alert = action.payload;
      state.loading = false;
    },
    loading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export default walletSlice.reducer;

export const { connect, account, chain, alert, loading } = walletSlice.actions;
