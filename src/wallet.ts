import Caver from "caver-js";
import { Address, Callback } from "@src/types";
import { TRANSFER_GAS } from "@src/klaytn";

export default class {
  #caver;

  constructor(caverHttp: Caver) {
    this.#caver = caverHttp;
  }

  async getGasPrice() {
    return Number(await this.#caver.klay.getGasPrice());
  }

  getKlayBalance(owner: Address, callback?: Callback) {
    return this.#caver.klay.getBalance(owner, 'latest', callback);
  }

  transferKlay(from: Address, to: Address, amount: BigInt, callback?: Callback) {
    return this.#caver.klay.sendTransaction({
      type: 'VALUE_TRANSFER',
      from,
      to,
      gas: TRANSFER_GAS,
      value: amount.toString(10),
    }, callback);
  }
}
