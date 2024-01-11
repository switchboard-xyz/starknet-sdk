// Note: Binance API requires a non-US IP address

use crate::*;

use serde::Deserialize;
pub use switchboard_utils::reqwest;

// https://www.bitstamp.net/api/v2/ticker/
// https://www.bitstamp.net/api/#tag/Tickers/operation/GetCurrencies
#[derive(Debug, Deserialize, Clone)]
pub struct BitstampTicker {
    pub timestamp: Decimal,
    pub open: Decimal,
    pub high: Decimal,
    pub low: Decimal,
    pub last: Decimal,
    pub volume: Decimal,
    pub vwap: Decimal,
    pub bid: Decimal,
    pub ask: Decimal,
    pub side: Decimal,
    pub open_24: Decimal,
    pub percent_change_24: Option<String>,
    pub pair: Pair,
}

impl Into<NormalizedTicker> for BitstampTicker {
    fn into(self) -> NormalizedTicker {
        let mut res = NormalizedTicker::default();
        res.price = (self.bid + self.ask) / Decimal::from(2);
        res
    }
}

pub async fn fetch_bitstamp_spot() -> Result<Vec<BitstampTicker>, Error> {
    let bitstamp_spot: Vec<BitstampTicker> =
        reqwest::get("https://www.bitstamp.net/api/v2/ticker/")
            .await?
            .json()
            .await?;
    Ok(bitstamp_spot)
}
