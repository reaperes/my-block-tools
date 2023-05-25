import axios from 'axios'
import { ethers } from 'ethers'

const jsonRpcEndpoint = 'https://bsc-dataseed.binance.org'
const watchAccount: string[] = [
  // TODO
]
const transferEvent = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
const usdtAddress = '0x55d398326f99059fF775485246999027B3197955'
const apiKey = ''
const maxCrawlingBlock = 10
const crawlingDelay = 30 * 1000

const provider = new ethers.JsonRpcProvider(jsonRpcEndpoint)

async function main() {
  let lastCheckedBlock = await provider.getBlockNumber()
  let latestBlock = await provider.getBlockNumber()

  while (true) {
    const toBlock = Math.min(lastCheckedBlock + maxCrawlingBlock, latestBlock)
    console.log(`Check ${lastCheckedBlock} ~ ${toBlock} block events`)
    const res = await axios.get(`https://api.bscscan.com/api?module=logs&action=getLogs&fromBlock=${lastCheckedBlock}&toBlock=${toBlock}&address=${usdtAddress}&topic0=${transferEvent}&apikey=${apiKey}`)
    const events = res.data.result

    console.log(`Events len: ${events.length}`)

    events.filter((event: any) => watchAccount.includes('0x' + event.topics[2].substring(26)))
      .forEach((event: any) => {
        const to = '0x' + event.topics[2].substring(26)
        const amount = BigInt(event.data)

        console.log(`${amount} USDT has been deposited on address: ${to}`)
      })

    lastCheckedBlock = toBlock
    if (toBlock === latestBlock) {
      await delay(crawlingDelay)
      latestBlock = await provider.getBlockNumber()
    } else {
      await delay(1 * 1000)
    }
  }
}

function delay(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}

main().catch(console.error)
