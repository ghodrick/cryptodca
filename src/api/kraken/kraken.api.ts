
import crypto from "crypto";
import qs from "qs";
import { httpClient } from "../../adapters/http-client.adapter";
import { AccountBalanceResponse, AddOrderParams, ExecuteOrderResponse, KrakenResponse, PricesResponse, SystemStatusResponse, TradableAssetsResponse } from "./types/kraken.types";

const BASE_URL = "https://api.kraken.com";

class Kraken {
	private privateKey: string;
	private publicKey: string;

	constructor(privateKey: string, publicKey: string) {
		this.privateKey = privateKey;
		this.publicKey = publicKey;
	}

	request = async <T = any>(method: "get" | "post", uri: string, data: any = {}, config: any = {}) => {
		let response: KrakenResponse<T>;

		if (method === "get") {
			response = await httpClient.get<KrakenResponse<T>>(`${BASE_URL}${uri}`, config);
		} else {

			data.nonce = Date.now().toString();

			const signature = this.get_api_sign(data, uri);

			let dataToSend = qs.stringify(data);

			response = await httpClient.post<KrakenResponse<T>>(`${BASE_URL}${uri}`, dataToSend, {
				headers: {
					"API-Key": this.publicKey,
					"API-Sign": signature,
				},
				...config
			});
		}

		if (response?.error?.length > 0) {
			throw new Error(response.error.join(","));
		}

		return response.result;
	};

	get_system_status = async () => {
		const data = await this.request<SystemStatusResponse>("get", `/0/public/SystemStatus`);

		return data;
	};

	get_api_sign = (apiData: { nonce: string }, uri: string) => {
		const message = qs.stringify(apiData);

		const secret_buffer = Buffer.from(this.privateKey, "base64");

		const sha256 = crypto.createHash("sha256");
		const sha512 = crypto.createHmac("sha512", secret_buffer);

		const sha256Digest = sha256.update(apiData.nonce + message).digest("binary");
		const signature = sha512.update(uri + sha256Digest, "binary").digest("base64");

		return signature;
	};

	get_balance = async () => {

		let balance = await this.request<AccountBalanceResponse>("post", "/0/private/Balance");

		return balance;
	};

	get_tradable_asset_pairs = async (pairs: string[] | string = "") => {
		let pairsString = pairs instanceof Array ? pairs.join(",") : pairs;

		let dataToSend = "";

		if (pairsString !== "") {
			dataToSend = "?" + qs.stringify({ pair: pairsString });
		}

		const data = await this.request<TradableAssetsResponse>("get", `/0/public/AssetPairs${dataToSend}`);

		return data;
	};

	get_prices = async (pairs: string[] | string = "") => {

		let pairsString = pairs instanceof Array ? pairs.join(",") : pairs;

		let dataToSend = "";

		if (pairsString !== "") {
			dataToSend = "?" + qs.stringify({ pair: pairsString });
		}

		const data = await this.request<PricesResponse>("get", `/0/public/Ticker${dataToSend}`);

		return data;
	};

	execute_buy_order = async (pair: string, volume: string) => {

		let data: AddOrderParams = {
			pair: pair,
			type: "buy",
			ordertype: "market",
			volume: volume,
			validate: true
		};

		let response = await this.add_order(data);

		return response;
	};

	add_order = async (data: AddOrderParams) => {

		const response = await this.request<ExecuteOrderResponse>("post", `/0/private/AddOrder`, data);

		return response;

	};
}

export default Kraken;
