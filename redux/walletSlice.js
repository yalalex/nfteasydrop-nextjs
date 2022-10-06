import { createSlice } from '@reduxjs/toolkit';

import { chainList, langList } from '../config';

export const walletSlice = createSlice({
  name: 'wallet',
  initialState: {
    defaultAccount: '',
    signer: null,
    chain: chainList[0],
    airdropContract: null,
    lang: langList[0],
    loading: '',
    error: null,
    // connected: false, // DO I NEED IT IN STATE?
  },
  reducers: {
    connect: (state, action) => {
      state.signer = action.payload.signer;
      state.airdropContract = action.payload.contract;
      state.loading = false;
    },
    account: (state, action) => {
      state.defaultAccount = action.payload;
      // state.connected = true;
    },
    chain: (state, action) => {
      state.chain = action.payload;
      state.loading = false;
    },
    lang: (state, action) => {
      state.lang = action.payload;
    },
    error: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    loading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export default walletSlice.reducer;

export const { connect, account, chain, error, loading } = walletSlice.actions;
