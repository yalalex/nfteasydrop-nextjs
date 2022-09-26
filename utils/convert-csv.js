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
      const rowsRaw = str
        .slice(0)
        .split('\n')
        .filter((value) => value !== '');
      const rows = Array.from(new Set(rowsRaw));
      rows.forEach((row) => {
        const values = row
          .split(',')
          // .filter((value) => value !== '')
          .map((value) => value.trim());

        if (type === '721') {
          if (
            values.length === 2 &&
            ethers.utils.isAddress(values[0]) &&
            isPositiveInteger(values[1])
          ) {
            addresses.push(values[0]);
            ids.push(values[1]);
          } else return corruptedRows.push(row);
        }

        if (type === '1155') {
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
      });

      const data = [addresses, ids, amounts];

      res([data, corruptedRows]);
    } catch (error) {
      rej(error);
    }
  });
};
