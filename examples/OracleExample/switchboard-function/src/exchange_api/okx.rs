// Note: Binance API requires a non-US IP address

use crate::*;

use serde::Deserialize;
pub use switchboard_utils::reqwest;

// https://www.okx.com/docs-v5/en/#order-book-trading-market-data-get-candlesticks
// https://www.okx.com/api/v5/market/candles?instId=BTC-USDT&bar=1H
// https://www.okx.com/api/v5/market/tickers?instType=SPOT
#[allow(non_snake_case)]
#[derive(Debug, Deserialize, Clone)]
pub struct OkexTicker {
    pub instType: String,
    pub instId: Pair,
    pub last: Decimal,
    pub lastSz: Decimal,
    pub askPx: Decimal,
    pub askSz: Decimal,
    pub bidPx: Decimal,
    pub bidSz: Decimal,
    pub open24h: Decimal,
    pub high24h: Decimal,
    pub low24h: Decimal,
    pub volCcy24h: Decimal,
    pub vol24h: Decimal,
    pub ts: Decimal,
    pub sodUtc0: Decimal,
    pub sodUtc8: Decimal,
}

impl Into<NormalizedTicker> for OkexTicker {
    fn into(self) -> NormalizedTicker {
        let mut res = NormalizedTicker::default();
        res.price = (self.askPx + self.bidPx) / Decimal::from(2);
        res
    }
}

#[derive(Debug, Deserialize)]
pub struct OkexSpotResponse {
    pub code: String,
    pub msg: String,
    pub data: Vec<OkexTicker>,
}

pub async fn fetch_okex_spot() -> Result<OkexSpotResponse, Error> {
    let okex_spot: OkexSpotResponse =
        reqwest::get("https://www.okx.com/api/v5/market/tickers?instType=SPOT")
            .await?
            .json()
            .await?;
    Ok(okex_spot)
}
