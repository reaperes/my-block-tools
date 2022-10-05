export type Callback = (error: Error, result: any) => void;

export type Address = string;

export type Account = {
  address: Address,
  privateKey: string,
  who?: string,
};
