// Note: Binance API requires a non-US IP address

use crate::*;

use serde::Deserialize;
pub use switchboard_utils::reqwest;

// https://poloniex.com/public?command=returnTicker
#[allow(non_snake_case)]
#[derive(Debug, Deserialize, Clone)]
pub struct PoloniexTicker {
    pub id: i64,
    pub last: Decimal,
    pub lowestAsk: Decimal,
    pub highestBid: Decimal,
    pub percentChange: Decimal,
    pub baseVolume: Decimal,
    pub quoteVolume: Decimal,
    pub isFrozen: Decimal,
    pub postOnly: Decimal,
    pub high24hr: Decimal,
    pub low24hr: Decimal,
}

impl Into<NormalizedTicker> for PoloniexTicker {
    fn into(self) -> NormalizedTicker {
        let mut res = NormalizedTicker::default();
        res.price = (self.highestBid + self.lowestAsk) / Decimal::from(2);
        res
    }
}

#[derive(Debug, Deserialize, Clone)]
pub struct PoloniexResponse(HashMap<Pair, PoloniexTicker>);

impl PoloniexResponse {
    pub fn into_inner(self) -> HashMap<Pair, PoloniexTicker> {
        self.0
    }
}

pub async fn fetch_poloniex_spot() -> Result<PoloniexResponse, Error> {
    let poloniex_spot: PoloniexResponse =
        reqwest::get("https://poloniex.com/public?command=returnTicker")
            .await?
            .json()
            .await?;
    Ok(poloniex_spot)
}
