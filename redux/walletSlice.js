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
      const { provider, signer, contract } = action.payload;
      state.provider = provider;
      state.signer = signer;
      state.airdropContract = contract;
      state.loading = '';
    },
    account: (state, action) => {
      state.defaultAccount = action.payload;
    },
    chain: (state, action) => {
      state.chain = action.payload;
      state.loading = '';
    },
    // lang: (state, action) => {
    //   state.lang = action.payload;
    // },
    alert: (state, action) => {
      state.alert = action.payload;
      state.loading = '';
    },
    loading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export default walletSlice.reducer;

export const { connect, account, chain, alert, loading } = walletSlice.actions;
