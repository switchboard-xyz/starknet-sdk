use crate::*;
use rust_decimal::prelude::FromPrimitive;
use serde::Deserialize;
use serde_json::Value;
pub use switchboard_utils::reqwest;

// https://docs.bitfinex.com/reference/rest-public-tickers
// https://api-pub.bitfinex.com/v2/tickers?symbols=ALL
#[derive(Debug, Deserialize, Default, Clone)]
pub struct BitfinexPair {
    pub symbol: Pair,
    pub bid: Decimal,
    pub bid_size: Decimal,
    pub ask: Decimal,
    pub ask_size: Decimal,
    pub daily_change: Decimal,
    pub daily_change_relative: Decimal,
    pub last_price: Decimal,
    pub volume: Decimal,
    pub high: Decimal,
    pub low: Decimal,
}

impl Into<NormalizedTicker> for BitfinexPair {
    fn into(self) -> NormalizedTicker {
        let mut res = NormalizedTicker::default();
        res.price = (self.bid + self.ask) / Decimal::from(2);
        res
    }
}

impl From<Vec<Option<Value>>> for BitfinexPair {
    fn from(data: Vec<Option<Value>>) -> Self {
        let mut symbol: String = data[0].clone().unwrap().as_str().unwrap().into();
        let _pair = Pair {
            base: symbol.clone().into(),
            quote: "".to_string(),
        };
        if !symbol.starts_with("t") {
            return Default::default();
        }
        symbol = symbol[1..].to_string();
        let pair: Pair = symbol.into();
        BitfinexPair {
            symbol: pair,
            bid: Decimal::from_f64(data[1].clone().unwrap().as_f64().unwrap()).unwrap(),
            bid_size: Decimal::from_f64(data[2].clone().unwrap().as_f64().unwrap()).unwrap(),
            ask: Decimal::from_f64(data[3].clone().unwrap().as_f64().unwrap()).unwrap(),
            ask_size: Decimal::from_f64(data[4].clone().unwrap().as_f64().unwrap()).unwrap(),
            daily_change: Decimal::from_f64(data[5].clone().unwrap().as_f64().unwrap()).unwrap(),
            daily_change_relative: Decimal::from_f64(data[6].clone().unwrap().as_f64().unwrap())
                .unwrap(),
            last_price: Decimal::from_f64(data[7].clone().unwrap().as_f64().unwrap()).unwrap(),
            volume: Decimal::from_f64(data[8].clone().unwrap().as_f64().unwrap()).unwrap(),
            high: Decimal::from_f64(data[9].clone().unwrap().as_f64().unwrap()).unwrap(),
            low: Decimal::from_f64(data[10].clone().unwrap().as_f64().unwrap()).unwrap(),
        }
    }
}

pub async fn fetch_bitfinex_spot() -> Result<Vec<BitfinexPair>, Error> {
    let bitfinex_spot: Vec<Vec<Option<Value>>> =
        reqwest::get("https://api-pub.bitfinex.com/v2/tickers?symbols=ALL")
            .await?
            .json()
            .await?;
    let bitfinex_spot: Vec<BitfinexPair> = bitfinex_spot
        .iter()
        .map(|x| x.clone().into())
        .filter(|x: &BitfinexPair| x.symbol != Default::default())
        .collect();
    Ok(bitfinex_spot)
}
