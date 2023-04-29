function y = fitness(x)
 priceHistory = flip(csvread('symbolHistory.csv')');
 asset = 5000000;
 cash = asset;
 tether = 0;
 buy_count = 0;
 last_price = priceHistory(1);
 mean_buy_price = priceHistory(1);
 %first sell
 %period = x(3) * asset;
 %cash = asset-period;
 %tether = period/last_price;
 %buy_count = 1;
for j=1:length(priceHistory)
    currentPrice=priceHistory(j);
    change_last_price = (currentPrice - last_price)/last_price;
    change_mean_price = (currentPrice - mean_buy_price)/mean_buy_price;
    period = x(3) * cash;
    if change_last_price >= x(1) && tether %change_mean_price>=x(1)
        cash = cash + (tether*currentPrice);
        tether = 0;
        last_price = currentPrice;
        mean_buy_price = currentPrice;
        buy_count=0;
    elseif -1*change_last_price >= x(2)  %buy
        cash = cash-period;
        tether =tether + (period/currentPrice);
        last_price = currentPrice;
        mean_buy_price = (mean_buy_price*buy_count+currentPrice)/(buy_count+1);
        buy_count =buy_count+ 1;
    end
 
end
portfolio =cash+ (tether*priceHistory(end));
y=(asset - portfolio)/asset %minimum