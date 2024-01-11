// Note: Binance API requires a non-US IP address
use crate::*;

use serde::Deserialize;
pub use switchboard_utils::reqwest;

#[allow(non_snake_case)]
#[derive(Deserialize, Default, Clone, Debug)]
pub struct BinanceBook {
    pub bids: Vec<(String, String)>,
    pub asks: Vec<(String, String)>,
}
impl Into<NormalizedBook> for BinanceBook {
    fn into(self) -> NormalizedBook {
        let book = self;
        let mut res = NormalizedBook::default();
        for bid in book.bids.iter() {
            res.bids.push(NormalizedOrdersRow {
                price: Decimal::try_from(bid.0.as_str()).unwrap(),
                amount: Decimal::try_from(bid.1.as_str()).unwrap(),
            });
        }
        for ask in book.asks.iter() {
            res.asks.push(NormalizedOrdersRow {
                price: Decimal::try_from(ask.0.as_str()).unwrap(),
                amount: Decimal::try_from(ask.1.as_str()).unwrap(),
            });
        }
        res.price = res.bids[0]
            .price
            .checked_add(res.asks[0].price)
            .unwrap()
            .checked_div(2.into())
            .unwrap();
        res
    }
}

// https://github.com/binance/binance-spot-api-docs/blob/master/rest-api.md#rolling-window-price-change-statistics
#[allow(non_snake_case)]
#[derive(Deserialize, Default, Clone, Debug)]
pub struct BinanceTicker {
    pub symbol: String,
    pub priceChange: Decimal,
    pub priceChangePercent: Decimal,
    pub weightedAvgPrice: Decimal,
    pub prevClosePrice: Decimal,
    pub lastPrice: Decimal,
    pub lastQty: Decimal,
    pub bidPrice: Decimal,
    pub bidQty: Decimal,
    pub askPrice: Decimal,
    pub askQty: Decimal,
    pub openPrice: Decimal,
    pub highPrice: Decimal,
    pub lowPrice: Decimal,
    pub volume: Decimal,
    pub quoteVolume: Decimal,
    pub openTime: i64,
    pub closeTime: i64,
}

// https://api.binance.us/api/v3/ticker/price
#[derive(Debug, Deserialize, Clone)]
pub struct BinanceSpot {
    pub symbol: Pair,
    pub price: Decimal,
}

impl Into<NormalizedTicker> for BinanceSpot {
    fn into(self) -> NormalizedTicker {
        let mut res = NormalizedTicker::default();
        res.price = self.price;
        res
    }
}

pub async fn fetch_binance_spot() -> Result<Vec<BinanceSpot>, Error> {
    let binance_spot: Vec<BinanceSpot> = reqwest::get("https://api.binance.us/api/v3/ticker/price")
        .await?
        .json()
        .await?;
    // println!("Binance markets {:#?}", binance_spot);
    Ok(binance_spot)
}
