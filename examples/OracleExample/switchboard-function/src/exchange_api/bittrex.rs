// Note: Binance API requires a non-US IP address

use crate::*;

use serde::Deserialize;
pub use switchboard_utils::reqwest;

//https://api.bittrex.com/v3/markets/tickers
#[allow(non_snake_case)]
#[derive(Debug, Deserialize, Clone)]
pub struct BittrexPair {
    pub symbol: Pair,
    pub lastTradeRate: Decimal,
    pub bidRate: Decimal,
    pub askRate: Decimal,
    pub updatedAt: String,
}

impl Into<NormalizedTicker> for BittrexPair {
    fn into(self) -> NormalizedTicker {
        let book = self;
        let mut res = NormalizedTicker::default();
        res.price = (book.bidRate + book.askRate) / Decimal::from(2);
        res
    }
}

pub async fn fetch_bittrex_spot() -> Result<Vec<BittrexPair>, Error> {
    let bittrex_spot: Vec<BittrexPair> = reqwest::get("https://api.bittrex.com/v3/markets/tickers")
        .await?
        .json()
        .await?;
    Ok(bittrex_spot)
}
