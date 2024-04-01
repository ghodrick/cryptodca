import { HttpClientError } from "./adapters/http-client.adapter";
import { buildLogger } from "./adapters/logger.adapter";
import Kraken from "./api/kraken/kraken.api";
import { CRYPTOS_TO_BUY, FIAT_QUANTITY_TO_BUY } from "./config/config";

const logger = buildLogger("app.js");

function validateEnvironmentVariables() {
	const privateKey = process.env.KRAKEN_PRIVATE_KEY;
	const publicKey = process.env.KRAKEN_PUBLIC_KEY;

	if (!privateKey || !publicKey) {
		logger.error("Environment variables KRAKEN_PRIVATE_KEY and KRAKEN_PUBLIC_KEY must be set.");

		process.exit(1);
	}

	return { privateKey, publicKey };
}

async function main() {
	try {
		const { privateKey, publicKey } = validateEnvironmentVariables();

		const KrakenAPI = new Kraken(privateKey, publicKey);

		const statusData = await KrakenAPI.get_system_status();

		if (statusData.status === "online") {

			const balance = await KrakenAPI.get_balance();

			//Check that the sum of percentages is 100
			let validPercentage = CRYPTOS_TO_BUY.reduce((acc, crypto) => crypto.percentage + acc, 0) === 100;

			if (!validPercentage)
			{
				throw new Error("The sum of the percentages of the cryptos to buy must be 100");
			}

			//Check if the pairs are valid
			let pairs = CRYPTOS_TO_BUY.map(crypto => crypto.name);

			const assets = await KrakenAPI.get_tradable_asset_pairs(pairs);

			let validPairs = pairs.every(pair => assets[pair] !== undefined);

			if (!validPairs)
			{
				throw new Error("The pairs are not valid");
			}
			
			const prices = await KrakenAPI.get_prices(pairs);
			
			for (const crypto of CRYPTOS_TO_BUY) {
				
				let cryptoToBuyData = assets[crypto.name];

				if (prices[crypto.name])
				{

					let fiatID = assets[crypto.name].quote;

					let tickerName = crypto.name.split("/")[0];

					let fiatName = crypto.name.split("/")[1];

					let fiatCurrentPrice = parseFloat(prices[crypto.name].a[0]);

					let fiatToSpendInThisCoin = parseFloat((FIAT_QUANTITY_TO_BUY * (crypto.percentage / 100)).toFixed(2));

					let cryptoToBuy = fiatToSpendInThisCoin / fiatCurrentPrice;

					if (!balance[fiatID] || parseFloat(balance[fiatID]) < fiatToSpendInThisCoin)
					{
						logger.error(`You don't have enough ${fiatName} to buy ${fiatToSpendInThisCoin}${fiatName} of ${tickerName} (${cryptoToBuy}). Please, deposit more ${fiatName} in your Kraken account.`);
						continue;
					}

					logger.log(`I want to buy ${fiatToSpendInThisCoin}${fiatName} of ${tickerName} (${cryptoToBuy}). The current price of ${tickerName} is ${fiatCurrentPrice}. The Kraken pair ID is ${cryptoToBuyData.altname}`);

					if (parseFloat(cryptoToBuyData.ordermin) > cryptoToBuy)
					{
						logger.error(`The minimum order for ${tickerName} is ${cryptoToBuyData.ordermin} and you want to buy ${cryptoToBuy}`);
						continue;
					}

					let result = await KrakenAPI.execute_buy_order(cryptoToBuyData.altname, cryptoToBuy.toString());

					if (result.descr.order)
					{
						logger.log(`Order ${result.descr.order} created`);
					}
				}

			}
		}
		else 
		{
			logger.error("Kraken is offline");
		}
	} catch (error) {

		if (error instanceof HttpClientError || error instanceof Error) {
			logger.error(error.message);
		}
	}
}

main();
