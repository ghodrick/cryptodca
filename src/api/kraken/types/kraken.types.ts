export interface KrakenResponse<T> {
	error: any[];
	result: T;
}

export interface SystemStatusResponse {
	status: string;
	timestamp: string;
}
export interface TradableAssetsResponse {
	[key: string]: TradableAssetInfo;
}

export interface AccountBalanceResponse {
	[key: string]: string;
}

export interface TradableAssetInfo {
	altname: string;
	wsname: string;
	aclass_base: string;
	base: string;
	aclass_quote: string;
	quote: string;
	lot: string;
	cost_decimals: number;
	pair_decimals: number;
	lot_decimals: number;
	lot_multiplier: number;
	leverage_buy: number[];
	leverage_sell: number[];
	fees: number[][];
	fees_maker: number[][];
	fee_volume_currency: string;
	margin_call: number;
	margin_stop: number;
	ordermin: string;
	costmin: string;
	tick_size: string;
	status: string;
	long_position_limit: number;
	short_position_limit: number;
}

export type OrderType = "market" | "limit" | "stop-loss" | "take-profit" | "stop-loss-limit" | "take-profit-limit" | "trailing-stop" | "trailing-stop-limit" |"settle-position";

export type OrderDirection = "buy" | "sell";

export interface AddOrderParams {
	pair: string;
	type: OrderDirection;
	ordertype: OrderType;
	volume: string;
	price?: string;
	trigger?: string;
	leverage?: string;
	reduce_only?: boolean;
	validate?: boolean;
}

export interface PricesResponse {
	[key: string]: AssetPriceInformation;
}

export interface AssetPriceInformation {
  a: string[]; // ask array(<price>, <whole lot volume>, <lot volume>),
  b: string[]; // bid array(<price>, <whole lot volume>, <lot volume>),
  c: string[]; // last trade closed array(<price>, <lot volume>),
  v: string[]; // volume array(<today>, <last 24 hours>),
  p: string[]; // volume weighted average price array(<today>, <last 24 hours>),
  t: number[]; // number of trades array(<today>, <last 24 hours>),
  l: string[]; // low array(<today>, <last 24 hours>),
  h: string[]; // high array(<today>, <last 24 hours>),
  o: string; // today's opening price
}

export interface ExecuteOrderResponse {
  descr: OrderDescription;
  txid?: string[];
}

export interface OrderDescription {
  order: string;
}
