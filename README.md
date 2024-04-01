# [DCA SCRIPT FOR KRAKEN](https://www.kraken.com/)

This is a Node script to buy crypto at lower fees using Kraken Pro API

## Installation
Download the code and execute:
```bash
npm i
```

## Pre-Configuration 

You will need a **Kraken API KEY** with only the options `Query Funds` and `Create & Modify Orders`.

## Usage

1. Rename the file `.env.example` to `.env`
2. Write your keys in the `.env` file
```bash 
KRAKEN_PRIVATE_KEY=#Your Private Key of Kraken
KRAKEN_PUBLIC_KEY=#Your public Key of Kraken
```
3. Go to the `config/config.ts` file and modify `FIAT_QUANTITY_TO_BUY` and `CRYPTOS_TO_BUY` variables
   1. **FIAT_QUANTITY_TO_BUY** is the amount in fiat (eur, usd, etc) that you want to spend in total
   2. **CRYPTOS_TO_BUY**. You define here what crypto pairs do you want to buy. You can buy multiple cryptos at once. It has two properties:
      1. `name`: The name of the crypto you want to buy (Format: Crypto/Fiat). Example `BTC/EUR` to buy Bitcoin using Euro.
      2. `percentage`: The % amount to spend in this crypto (The total amound is defined in `FIAT_QUANTITY_TO_BUY`)

    In this example it will buy 80% of the amound in BTC, and 20% in ETH
   ```Typescript
   export const CRYPTOS_TO_BUY: CryptoToBuyPairs[] = [
        {
            name: 'BTC/EUR',
            percentage: 80
        },
        {
            name: 'ETH/EUR',
            percentage: 20
        }
        
    ]
   ``` 
4. Execute it
```bash
npm run start
```



