import Caver from 'caver-js';
import dotenv from 'dotenv';
import path from 'path';
import { TransactionReceipt } from "caver-js/types/packages/caver-core/src";

dotenv.config({ path: path.resolve(__dirname, '.env') });

const { KLAYTN_ENDPOINT_RPC } = process.env;

export const GAS_PRICE = Caver.utils.convertToPeb(25,'Gpeb');
export const TRANSFER_GAS = 21000;

let initialized = false;

let caverHttp: Caver;

type AddressKeyPair = {
  address: string,
  privateKey: string,
}

export function initialize(addressKeyPairs?: AddressKeyPair[]) {
  if (!initialized) {
    createCaverHttp();
  }

  addressKeyPairs?.forEach(pair => {
    caverHttp.klay.accounts.wallet.add(pair.privateKey);
  });
}

export function createCaverHttp() {
  if (!caverHttp) {
    caverHttp = new Caver(KLAYTN_ENDPOINT_RPC);
  }
  return caverHttp;
}

export function getKlayBalance(address: string, callback?: (error: Error, result: string) => void): Promise<string> {
  return caverHttp.klay.getBalance(address, callback);
}

export function sendKlay(from: string, to: string, value: bigint | string, callback?: (error: Error, result: TransactionReceipt) => void): Promise<TransactionReceipt> {
  const strValue = value.toString();
  return caverHttp.klay.sendTransaction({
    type: 'VALUE_TRANSFER',
    from,
    to,
    gas: TRANSFER_GAS,
    value: strValue,
  }, callback);
}
