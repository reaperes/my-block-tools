import Web3 from 'web3';
import IERC20Meta from '@openzeppelin/contracts/build/contracts/IERC20.json';
import BatchTransferMeta from '../../build/contracts/BatchTransfer.json';

const context = {
  httpEndpoint: 'http://127.0.0.1:8545',
  contracts: {
    testToken: {
      abi: IERC20Meta.abi,
      address: '0x057c5C7fcc8aa9F0e21E98DCcA35057Bd89e9F75',
    },
    batch: {
      abi: BatchTransferMeta.abi,
      address: '0x478Ada91f1cDdF676C890cCc8D79f03B3D2a13E8',
    },
  },
  transferAmounts: 1,
  transferCount: 5,
};

const web3 = new Web3(context.httpEndpoint);

// @ts-ignore
const batch = new web3.eth.Contract(context.contracts.batch.abi, context.contracts.batch.address);
// @ts-ignore
const testToken = new web3.eth.Contract(context.contracts.testToken.abi, context.contracts.testToken.address);

async function main() {
  const accounts = await web3.eth.getAccounts();

  const multiTransferTxAddress = accounts[2];
  const singleBatchTransferAddress = accounts[3];
  const toAddress = accounts[1];

  const totalTransferAmounts = context.transferCount * context.transferAmounts;
  await testToken.methods.transfer(multiTransferTxAddress, totalTransferAmounts).send({
    from: accounts[0],
    gas: 50_0000,
  });
  await testToken.methods.transfer(singleBatchTransferAddress, totalTransferAmounts).send({
    from: accounts[0],
    gas: 50_0000,
  });

  // research 1
  // for (let i=0; i<context.transferCount; i++) {
  //   await web3.eth.sendTransaction({
  //     from: multiTransferTxAddress,
  //     to: toAddress,
  //     data: "0x",
  //     value: context.transferAmounts,
  //   });
  // }
  //
  // await batch.methods
  //   .batchTransfer(Array(context.transferCount).fill(toAddress), Array(context.transferCount).fill(context.transferAmounts))
  //   .send({
  //     from: singleBatchTransferAddress,
  //     gas: 200_0000,
  //     value: context.transferAmounts * context.transferCount,
  //   });
  //
  // console.log(await web3.eth.getBalance(multiTransferTxAddress));
  // console.log(await web3.eth.getBalance(singleBatchTransferAddress));

  // research 2
  for (let i=0; i<context.transferCount; i++) {
    console.log(await testToken.methods.transfer(toAddress, context.transferAmounts).send({
      from: multiTransferTxAddress,
      gas: 50_0000,
    }));
  }

  await testToken.methods.approve(context.contracts.batch.address, totalTransferAmounts).send({
    from: singleBatchTransferAddress,
    gas: 50_0000,
  });
  console.log(await batch.methods
    .batchTransferERC20(context.contracts.testToken.address, Array(context.transferCount).fill(toAddress), Array(context.transferCount).fill(context.transferAmounts))
    .send({
      from: singleBatchTransferAddress,
      gas: 500_0000,
    }));

  console.log(await web3.eth.getBalance(multiTransferTxAddress));
  console.log(await web3.eth.getBalance(singleBatchTransferAddress));
}

main().then().catch(console.error);
