import { initialize, sendERC20, getERC20Balance } from '@src/klaytn';

const { ERC20_ADDRESS, FROM_ADDRESS, FROM_PRIVATE_KEY, TO_ADDRESSES, MULTISEND_AMOUNT } = process.env;

const erc20Address = ERC20_ADDRESS as string;
const from = FROM_ADDRESS as string;
const fromKey = FROM_PRIVATE_KEY as string;
const toAddresses = (TO_ADDRESSES as string).split(',');
const multisendAmount = MULTISEND_AMOUNT as string;

initialize([{
  address: from,
  privateKey: fromKey,
}]);

async function main() {
  const fromBalance = await getERC20Balance(from, erc20Address);
  console.log(fromBalance);

  for (const to of toAddresses) {
    try {
      await sendERC20(from, to, erc20Address, multisendAmount);
      console.log(`Transfer to ${to} success.`);
    } catch (e) {
      // @ts-ignore
      console.error(`Failed to transfer: ${e.message}`);
    }
  }

  const fromAfterBalance = await getERC20Balance(from, erc20Address);
  console.log(fromAfterBalance);
}

main().then().catch(console.error);
