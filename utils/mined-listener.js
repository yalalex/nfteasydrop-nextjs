export const minedListener = (transactionResponse, provider) => {
  return new Promise((resolve, reject) => {
    provider.once(transactionResponse.hash, () => resolve());
  });
};
