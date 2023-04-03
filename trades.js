const trades = [
	{
		asset: 'usdt', // Asset you want to buy
		currency: 'rls', // Currency you want to buy the asset with
		quoteOrderQty: '6', // Buy 0.1 BTC worth of ETH
    schedule: "0 */5 16 * * *"
	}
];

export { trades };