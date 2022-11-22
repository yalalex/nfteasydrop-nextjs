import { ethers } from 'ethers';

function isPositiveInteger(n) {
  return n >>> 0 === parseFloat(n);
}

export const csvToArray = (str, type, simple) => {
  let addresses = [];
  let ids = [];
  let amounts = [];
  let corruptedRows = [];

  return new Promise((res, rej) => {
    try {
      const rowsRaw = str.split('\n').filter((value) => value !== '');
      const rows = [...new Set(rowsRaw)];
      rows.forEach((row) => {
        const values = row
          .split(',')
          .filter((value) => {
            if (value !== '\r' && value !== '') return value;
          })
          .map((value) => value.trim());

        if (type === 'erc721') {
          if (
            values.length === 2 &&
            ethers.utils.isAddress(values[0]) &&
            isPositiveInteger(values[1])
          ) {
            addresses.push(values[0]);
            ids.push(values[1]);
          } else return corruptedRows.push(row);
        }

        if (type === 'erc1155') {
          if (simple) {
            if (values.length === 1 && ethers.utils.isAddress(values[0]))
              addresses.push(values[0]);
            else return corruptedRows.push(row);
          } else if (
            values.length === 3 &&
            ethers.utils.isAddress(values[0]) &&
            isPositiveInteger(values[1]) &&
            isPositiveInteger(values[2])
          ) {
            addresses.push(values[0]);
            ids.push(values[1]);
            amounts.push(values[2]);
          } else return corruptedRows.push(row);
        }

        if (type === 'erc20') {
          if (simple) {
            if (values.length === 1 && ethers.utils.isAddress(values[0]))
              addresses.push(values[0]);
            else return corruptedRows.push(row);
          } else if (
            values.length === 2 &&
            ethers.utils.isAddress(values[0]) &&
            isPositiveInteger(values[1])
          ) {
            addresses.push(values[0]);
            amounts.push(values[1]);
          } else return corruptedRows.push(row);
        }
      });

      const data = [addresses, ids, amounts];

      res([data, corruptedRows]);
    } catch (error) {
      rej(error);
    }
  });
};
