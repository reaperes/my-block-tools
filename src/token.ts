import { Address } from "@src/types";

export default class {
  symbol: string;
  address: Address;

  constructor(_symbol: string, _address: Address) {
    this.symbol = _symbol;
    this.address = _address;
  }

  isNativeToken(): boolean {
    return this.address === '0x0000000000000000000000000000000000000000';
  }
}
