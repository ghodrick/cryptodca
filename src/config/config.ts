export const FIAT_QUANTITY_TO_BUY = 50;

export interface CryptoToBuyPairs {
    name: string;
    percentage: number;
}

export const CRYPTOS_TO_BUY: CryptoToBuyPairs[] = [
    {
        name: 'BTC/EUR',
        percentage: 100
    }
    
]