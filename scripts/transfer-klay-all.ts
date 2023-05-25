import { GAS_PRICE, getKlayBalance, initialize, sendKlay, TRANSFER_GAS } from '@src/klaytn';

const { FROM_ADDRESS, FROM_PRIVATE_KEY, TO_ADDRESS } = process.env;

const from = FROM_ADDRESS as string;
const fromKey = FROM_PRIVATE_KEY as string;
const to = TO_ADDRESS as string;

initialize([{
  address: from,
  privateKey: fromKey,
}]);

async function main() {
  const fromKlay = BigInt(await getKlayBalance(from));
  const toKlay = BigInt(await getKlayBalance(to));
  console.log(`Current klay balance. from: ${fromKlay}, to: ${toKlay}`);

  const transferGasUsed = BigInt(GAS_PRICE.toString()) * BigInt(TRANSFER_GAS);
  const transferAmount = fromKlay - transferGasUsed;
  console.log(`Transfer klay to: ${to} from: ${from} amount: ${transferAmount}`);

  const res = await sendKlay(from, to, transferAmount);
  console.log(res);

  const fromResultKlay = BigInt(await getKlayBalance(from));
  const toResultKlay = BigInt(await getKlayBalance(to));
  console.log(`Transfer result: klay balance - from: ${fromResultKlay}, to: ${toResultKlay}`);
}

main().then().catch(console.error);
