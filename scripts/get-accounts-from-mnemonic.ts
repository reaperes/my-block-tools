import { getAccounts } from "../src/account";

const { MNEMONIC } = process.env;

const mnemonic = MNEMONIC as string;

const accounts = getAccounts(mnemonic);
console.table(accounts);
