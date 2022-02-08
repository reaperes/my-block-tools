import { createMnemonic, getAccounts } from "@src/account";

const { MNEMONIC } = process.env;

const mnemonic = MNEMONIC as string;

// const mnemonic = createMnemonic(16);
// console.log(mnemonic);

const accounts = getAccounts(mnemonic, 10);
accounts.forEach((account, idx) => {
  console.log(idx, account.address, account.privateKey);
});
