// Note: Binance API requires a non-US IP address

use crate::*;

pub use switchboard_utils::reqwest;

use serde::Deserialize;

#[allow(non_snake_case)]
#[derive(Deserialize, Default, Clone, Debug)]
pub struct KrakenBookInternal {
    pub bids: Vec<(String, String, i64)>,
    pub asks: Vec<(String, String, i64)>,
}
#[allow(non_snake_case)]
#[derive(Deserialize, Default, Clone, Debug)]
pub struct KrakenBook {
    pub result: HashMap<String, KrakenBookInternal>,
}
impl Into<NormalizedBook> for KrakenBook {
    fn into(self) -> NormalizedBook {
        let book = self.result.values().next().unwrap();
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

// https://api.kraken.com/0/public/Ticker
// https://docs.kraken.com/rest/#tag/Market-Data/operation/getTickerInformation
#[derive(Debug, Deserialize, Clone)]
pub struct KrakenTickerInfo {
    #[serde(rename = "a")]
    pub ask: Vec<Decimal>,
    #[serde(rename = "b")]
    pub bid: Vec<Decimal>,
    #[serde(rename = "c")]
    pub close: Vec<Decimal>,
    #[serde(rename = "v")]
    pub volume: Vec<Decimal>,
    #[serde(rename = "p")]
    pub vwap: Vec<Decimal>,
    #[serde(rename = "t")]
    pub trade_count: Vec<i64>,
    #[serde(rename = "l")]
    pub low: Vec<Decimal>,
    #[serde(rename = "h")]
    pub high: Vec<Decimal>,
    #[serde(rename = "o")]
    pub open: Decimal,
}

impl Into<NormalizedTicker> for KrakenTickerInfo {
    fn into(self) -> NormalizedTicker {
        let mut res = NormalizedTicker::default();
        res.price = (self.bid[0] + self.ask[0]) / Decimal::from(2);
        res
    }
}

#[derive(Debug, Deserialize)]
pub struct KrakenTickerResponse {
    pub result: HashMap<Pair, KrakenTickerInfo>,
}

pub async fn fetch_kraken_spot() -> Result<KrakenTickerResponse, Error> {
    let kraken_spot: KrakenTickerResponse = reqwest::get("https://api.kraken.com/0/public/Ticker")
        .await?
        .json()
        .await?;
    Ok(kraken_spot)
}
