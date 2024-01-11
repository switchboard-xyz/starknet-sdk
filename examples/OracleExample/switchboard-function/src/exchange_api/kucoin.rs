// Note: Binance API requires a non-US IP address

use crate::*;

use rust_decimal::prelude::*;
use serde::Deserialize;
use serde_json::Value;
pub use switchboard_utils::reqwest;

// https://docs.kucoin.com/#get-all-tickers
// https://api.kucoin.com/api/v1/market/allTickers
#[allow(non_snake_case)]
#[derive(Debug, Deserialize, Clone)]
pub struct KucoinTicker {
    pub symbol: Pair,
    pub symbolName: String,
    pub buy: Decimal,
    pub sell: Decimal,
    pub changeRate: Decimal,
    pub changePrice: Option<Decimal>,
    pub high: Decimal,
    pub low: Decimal,
    pub vol: Decimal,
    pub volValue: Decimal,
    pub last: Decimal,
    pub averagePrice: Option<Value>,
    pub takerFeeRate: Decimal,
    pub makerFeeRate: Decimal,
    pub takerCoefficient: Decimal,
    pub makerCoefficient: Decimal,
}

impl Into<NormalizedTicker> for KucoinTicker {
    fn into(self) -> NormalizedTicker {
        let mut res = NormalizedTicker::default();
        // if let Some(avg) = book.averagePrice {
        // res.price = Decimal::from_str(&avg.to_string()).unwrap_or(self.last);
        // }
        res.price = (self.buy + self.sell) / Decimal::from(2);
        res
    }
}

#[derive(Debug, Deserialize)]
pub struct KucoinTickerResponseInner {
    pub time: i64,
    pub ticker: Vec<KucoinTicker>,
}

#[derive(Debug, Deserialize)]
pub struct KucoinTickerResponse {
    pub code: String,
    pub data: KucoinTickerResponseInner,
}

pub async fn fetch_kucoin_spot() -> Result<KucoinTickerResponse, Error> {
    let kucoin_spot: KucoinTickerResponse =
        reqwest::get("https://api.kucoin.com/api/v1/market/allTickers")
            .await?
            .json()
            .await?;
    Ok(kucoin_spot)
}
