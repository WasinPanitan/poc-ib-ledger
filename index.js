const express = require('express')
var bodyParser = require('body-parser')
const models = require('./models')
const app = express()
const port = 3000

app.use(bodyParser.json({ limit: '50mb' }));

// buy -> ironbank buy at
// sell -> ironbank sell at

// on condition BTC market 195 we margin 200/190 ETH 92.t we margin 95/90 so that it goes 190 / 2 = 95 for 1 BTC to 2 ETH swap
const cryptoPrice = {
  buy: {
    BTC: 190,
    ETH: 90
  },
  sell: {
    BTC: 200,
    ETH: 95
  }
}

app.get('/', (req, res) => {
  res.send('Hello Worlda!')
})

// manual buy crypto to input into system inventory
app.post('/manual-buy', async (req, res) => {
  const {
    assetId,
    amount,
    price, // total price for this tx
    costPrice // price per unit
  } = req.body;

  const manualOp = await models.ManualOperation.create({
    type: 'buy',
    assetId,
    amount,
    price,
    costPrice
  })

  const transaction = await models.Transaction.create({
    refType: 'manual_operation',
    refId: manualOp.id,
    fromAssetId: 'USDT',
    fromAmount: costPrice * amount,
    toAssetId: assetId,
    toAmount: amount
  })

  const inventoryEntry = await models.InventoryEntry.create({
    inventoryId: `${assetId}_${costPrice}`,
    assetId,
    amountChange: amount,
    transactionId: transaction.id
  })

  const ledgerEntry1 = await models.LedgerEntry.create({
    ledgerId: `EXTERNAL_${assetId}`,
    type: 'credit',
    assetId,
    amount,
    transactionId: transaction.id,
  })

  const ledgerEntry2 = await models.LedgerEntry.create({
    ledgerId: 'EXTERNAL_USDT',
    type: 'debit',
    assetId: 'USDT',
    amount: costPrice * amount,
    transactionId: transaction.id
  })

  const ledgerEntry3 = await models.LedgerEntry.create({
    ledgerId: `IRONBANK_${assetId}`,
    type: 'debit',
    assetId,
    amount,
    transactionId: transaction.id,
  })

  const ledgerEntry4 = await models.LedgerEntry.create({
    ledgerId: 'IRONBANK_USDT',
    type: 'credit',
    assetId: 'USDT',
    amount: costPrice * amount,
    transactionId: transaction.id
  })

  res.json(req.body)
})

// take crypto from inventory to sell for USDT
app.post('/manual-sell', async (req, res) => {
  const {
    assetId,
    amount,
    price, // total price for this tx
    costPrice, // price per unit that used to sell
  } = req.body;

  const manualOp = await models.ManualOperation.create({
    type: 'sell',
    assetId,
    amount,
    price,
    costPrice,
  })

  const transaction = await models.Transaction.create({
    refType: 'manual_operation',
    refId: manualOp.id,
    fromAssetId: assetId,
    fromAmount: amount,
    toAssetId: 'USDT',
    toAmount: price
  })

  const inventoryEntry = await models.InventoryEntry.create({
    inventoryId: `${assetId}_${costPrice}`,
    assetId,
    amountChange: amount * -1,
    transactionId: transaction.id,
  })

  const ledgerEntry1 = await models.LedgerEntry.create({
    ledgerId: `EXTERNAL_${assetId}`,
    type: 'debit',
    assetId,
    amount,
    transactionId: transaction.id,
  })

  const ledgerEntry2 = await models.LedgerEntry.create({
    ledgerId: 'EXTERNAL_USDT',
    type: 'credit',
    assetId: 'USDT',
    amount: price,
    transactionId: transaction.id
  })

  const ledgerEntry3 = await models.LedgerEntry.create({
    ledgerId: `IRONBANK_${assetId}`,
    type: 'credit',
    assetId,
    amount,
    transactionId: transaction.id,
  })

  const ledgerEntry4 = await models.LedgerEntry.create({
    ledgerId: `IRONBANK_USDT`,
    type: 'debit',
    assetId: 'USDT',
    amount: costPrice * amount,
    transactionId: transaction.id
  })

  const ledgerEntry5 = await models.LedgerEntry.create({
    ledgerId: 'IRONBANK_USDT_PROFIT',
    type: 'debit', // debit / credit depending on +-
    assetId: 'USDT',
    amount: price - (costPrice * amount),
    transactionId: transaction.id
  })

  res.json(req.body)
})

// swap from crypto to crypto
app.post('/swap-cc', async (req, res) => {
  const {
    fromApp,
    toApp,
    fromAssetId,
    toAssetId,
    fromAmount,
    toAmount,
  } = req.body;

  // const fromAppObj = await models.App.findOne({
  //   where: {
  //     name: fromApp,
  //   }
  // })

  // const toAppObj = await models.App.findOne({
  //   where: {
  //     name: toApp,
  //   }
  // })

  const swap = await models.Swap.create({
    fromAssetId,
    fromAppId: fromApp,
    fromAmount,
    toAssetId,
    toAppId: toApp,
    toAmount,
  })

  const fromAssetCostValue = cryptoPrice.buy[fromAssetId]
  // const fromAssetCostValue = 90;  // get value from const object crypto value
  const toUsdtAmount = fromAmount * fromAssetCostValue; // 1 * 190

  const toAssetCostPrice = cryptoPrice.sell[toAssetId];  // get from price bucket
  const toDestAmount = toUsdtAmount / toAssetCostPrice; // 190 / 95

  const transaction = await models.Transaction.create({
    refType: 'swap',
    refId: swap.id,
    fromAssetId,
    fromAmount: fromAmount,
    toAssetId: toAssetId,
    toAmount: toAmount,
  })

  const inventoryEntryToUsdt = await models.InventoryEntry.create({
    inventoryId: `${fromAssetId}_${fromAssetCostValue}`,
    assetId: fromAssetId,
    amountChange: fromAmount,
    transactionId: transaction.id,
  })

  const ledgerEntryTo1 = await models.LedgerEntry.create({
    ledgerId: `${fromApp}_${fromAssetId}`,
    type: 'credit',
    assetId: fromAssetId,
    amount: fromAmount,
    transactionId: transaction.id
  })

  const ledgerEntryTo2 = await models.LedgerEntry.create({
    ledgerId: `IRONBANK_${fromAssetId}`,
    type: 'debit',
    assetId: fromAssetId,
    amount: fromAmount,
    transactionId: transaction.id,
  })

  const ledgerEntryTo3 = await models.LedgerEntry.create({
    ledgerId: `${fromApp}_USDT`,
    type: 'debit',
    assetId: 'USDT',
    amount: toUsdtAmount,
    transactionId: transaction.id
  })
  
  const ledgerEntryTo4 = await models.LedgerEntry.create({
    ledgerId: `IRONBANK_USDT`,
    type: 'credit',
    assetId: 'USDT',
    amount: toUsdtAmount,
    transactionId: transaction.id
  })

  // const transactionToDestAsset = await models.Transaction.create({
  //   refType: 'swap',
  //   refId: swap.id,
  //   fromAssetId: 'USDT',
  //   fromAmount: toUsdtAmount,
  //   toAssetId,
  //   toAmount: toDestAmount,
  // })

  const inventoryEntryToDestAsset = await models.InventoryEntry.create({
    inventoryId: `${toAssetId}_${toAssetCostPrice}`,
    assetId: toAssetId,
    amountChange: -1 * toAmount,
    transactionId: transaction.id
  })

  const ledgerEntryDest1 = await models.LedgerEntry.create({
    ledgerId: `${toApp}_${toAssetId}`,
    type: 'debit',
    assetId: toAssetId,
    amount: toAmount,
    transactionId: transaction.id,
  })

  const ledgerEntryDest2 = await models.LedgerEntry.create({
    ledgerId: `IRONBANK_${toAssetId}`,
    type: 'credit',
    assetId: toAssetId,
    amount: toAmount,
    transactionId: transaction.id
  })

  const ledgerEntryDest3 = await models.LedgerEntry.create({
    ledgerId: `${fromApp}_USDT`,
    type: 'credit',
    assetId: 'USDT',
    amount: toUsdtAmount,
    transactionId: transaction.id
  })

  const bucketPrice = toDestAmount * cryptoPrice.buy[toAssetId]; // use the costprice from chosen bucket

  const ledgerEntryDest4 = await models.LedgerEntry.create({
    ledgerId: 'IRONBANK_USDT',
    type: 'debit',
    assetId: 'USDT',
    amount: bucketPrice,
    transactionId: transaction.id,
  })

  const ledgerEntryDest5 = await models.LedgerEntry.create({
    ledgerId: 'IRONBANK_PROFIT_USDT',
    type: 'debit',
    assetId: 'USDT',
    amount: toUsdtAmount - bucketPrice,
    transactionId: transaction.id,
  })

  res.json({ swap: 'SWAP' })
})

// Swap crypto to stable coin
app.post('/swap-cs', async (req, res) => {
  const {
    fromApp,
    toApp,
    fromAssetId,
    toAssetId,
    fromAmount,
    toAmount,
  } = req.body;

  const swap = await models.Swap.create({
    fromAssetId,
    fromAppId: fromApp,
    fromAmount,
    toAssetId,
    toAppId: toApp,
    toAmount,
  })

  const fromAssetCostValue = cryptoPrice.buy[fromAssetId]
  // const fromAssetCostValue = 90;  // get value from const object crypto value
  const toUsdtAmount = fromAmount * fromAssetCostValue; // 1 * 190

  const transactionToUsdt = await models.Transaction.create({
    refType: 'swap',
    refId: swap.id,
    fromAssetId,
    fromAmount: fromAmount,
    toAssetId: 'USDT',
    toAmount: toUsdtAmount,
  })

  const inventoryEntryToUsdt = await models.InventoryEntry.create({
    inventoryId: `${fromAssetId}_${fromAssetCostValue}`,
    assetId: fromAssetId,
    amountChange: fromAmount,
    transactionId: transactionToUsdt.id,
  })

  const ledgerEntryTo1 = await models.LedgerEntry.create({
    ledgerId: `${fromApp}_${fromAssetId}`,
    type: 'credit',
    assetId: fromAssetId,
    amount: fromAmount,
    transactionId: transactionToUsdt.id
  })

  const ledgerEntryTo2 = await models.LedgerEntry.create({
    ledgerId: `IRONBANK_${fromAssetId}`,
    type: 'debit',
    assetId: fromAssetId,
    amount: fromAmount,
    transactionId: transactionToUsdt.id,
  })

  const ledgerEntryTo3 = await models.LedgerEntry.create({
    ledgerId: `${toApp}_USDT`,
    type: 'debit',
    assetId: 'USDT',
    amount: toUsdtAmount,
    transactionId: transactionToUsdt.id
  })
  
  const ledgerEntryTo4 = await models.LedgerEntry.create({
    ledgerId: `IRONBANK_USDT`,
    type: 'credit',
    assetId: 'USDT',
    amount: toUsdtAmount,
    transactionId: transactionToUsdt.id
  })

  res.json({ type: 'SWAP_CRYPTO_TO_USDT', status: 'SUCCESS' })
})

// Swap stable coin to crypto
app.post('/swap-sc', async (req, res) => {
  const {
    fromApp,
    toApp,
    fromAssetId,
    toAssetId,
    fromAmount,
    toAmount,
  } = req.body;

  const swap = await models.Swap.create({
    fromAssetId,
    fromAppId: fromApp,
    fromAmount,
    toAssetId,
    toAppId: toApp,
    toAmount,
  })

  const toAssetCostPrice = cryptoPrice.sell[toAssetId];  // get from price bucket

  const transactionToDestAsset = await models.Transaction.create({
    refType: 'swap',
    refId: swap.id,
    fromAssetId: 'USDT',
    fromAmount,
    toAssetId,
    toAmount,
  })

  const inventoryEntryToDestAsset = await models.InventoryEntry.create({
    inventoryId: `${toAssetId}_${toAssetCostPrice}`,
    assetId: toAssetId,
    amountChange: -1 * toAmount,
    transactionId: transactionToDestAsset.id
  })

  const ledgerEntryDest1 = await models.LedgerEntry.create({
    ledgerId: `${toApp}_${toAssetId}`,
    type: 'debit',
    assetId: toAssetId,
    amount: toAmount,
    transactionId: transactionToDestAsset.id,
  })

  const ledgerEntryDest2 = await models.LedgerEntry.create({
    ledgerId: `IRONBANK_${toAssetId}`,
    type: 'credit',
    assetId: toAssetId,
    amount: toAmount,
    transactionId: transactionToDestAsset.id
  })

  const ledgerEntryDest3 = await models.LedgerEntry.create({
    ledgerId: `${fromApp}_USDT`,
    type: 'credit',
    assetId: 'USDT',
    amount: fromAmount,
    transactionId: transactionToDestAsset.id
  })

  const bucketPrice = toAmount * cryptoPrice.buy[toAssetId]; // use the costprice from chosen bucket

  const ledgerEntryDest4 = await models.LedgerEntry.create({
    ledgerId: 'IRONBANK_USDT',
    type: 'debit',
    assetId: 'USDT',
    amount: bucketPrice,
    transactionId: transactionToDestAsset.id,
  })

  const ledgerEntryDest5 = await models.LedgerEntry.create({
    ledgerId: 'IRONBANK_PROFIT_USDT',
    type: 'debit',
    assetId: 'USDT',
    amount: fromAmount - bucketPrice,
    transactionId: transactionToDestAsset.id,
  })

  res.json({ type: 'SWAP_STABLE_COIN_TO_CRYPTO', status: 'SUCCESS' })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
