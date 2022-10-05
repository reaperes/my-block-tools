import Caver from 'caver-js';
import dotenv from 'dotenv';
import path from 'path';
import { TransactionReceipt } from 'caver-js/types/packages/caver-core/src';

import IERC20Meta from '@contract-lib/openzeppelin-solidity_0_5/IERC20.json';
import { Callback } from "@src/types";

dotenv.config({ path: path.resolve(__dirname, '.env') });

const { KLAYTN_ENDPOINT_RPC } = process.env;

export const GAS_PRICE = Caver.utils.convertToPeb(25,'Gpeb');
export const TRANSFER_GAS = 21000;
export const TRANSFER_ERC20_ESTIMATED_GAS = 120000;

let initialized = false;

let caverHttp: Caver;

interface AddressKeyPair {
  address: string,
  privateKey: string,
}

export function initialize(addressKeyPairs?: AddressKeyPair[]) {
  if (!initialized) {
    createCaverHttp();

    addressKeyPairs?.forEach(pair => {
      // @ts-ignore
      caverHttp.wallet.newKeyring(pair.address, pair.privateKey);
      caverHttp.klay.accounts.wallet.add(pair.privateKey);
    });
  }
}

export function createCaverHttp() {
  if (!caverHttp) {
    caverHttp = new Caver(KLAYTN_ENDPOINT_RPC);
  }
  return caverHttp;
}

export function getKlayBalance(userAddress: string, callback?: Callback): Promise<string> {
  return caverHttp.klay.getBalance(userAddress, 'latest', callback);
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

export function sendERC20(from: string, to: string, erc20Address: string, value: bigint | string, callback?: Callback) {
  const strValue = value.toString();
  // @ts-ignore
  const ERC20Contract = caverHttp.contract.create(IERC20Meta.abi, erc20Address);

  // Fix bug: caver-js@1.6.7 use undefined callback argument uses as sendOptions object
  const sendArgs = [{
    from: from,
    gas: TRANSFER_ERC20_ESTIMATED_GAS,
  }, callback];

  if (sendArgs[sendArgs.length - 1] === undefined) {
    sendArgs.pop();
  }

  const method = ERC20Contract.methods.transfer(to, strValue);
  return method.send.apply(method, sendArgs);
}

export function getERC20Balance(userAddress: string, erc20Address: string, callback?: Callback) {
  // @ts-ignore
  const ERC20Contract = caverHttp.contract.create(IERC20Meta.abi, erc20Address);
  return ERC20Contract.methods.balanceOf(userAddress).call(callback);
}
