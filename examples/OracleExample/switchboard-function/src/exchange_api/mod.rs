pub mod coinbase;
pub use coinbase::*;
pub mod binance;
pub use binance::*;
pub mod bitfinex;
pub use bitfinex::*;
pub mod kraken;
pub use kraken::*;
pub mod bittrex;
pub use bittrex::*;
pub mod gateio;
pub use gateio::*;
pub mod huobi;
pub use huobi::*;
pub mod kucoin;
pub use kucoin::*;
pub mod okx;
pub use okx::*;
pub mod bitstamp;
pub use bitstamp::*;
pub mod poloniex;
pub use poloniex::*;
pub mod pair;
pub use pair::*;

use rust_decimal::prelude::*;
use rust_decimal::Decimal;
use std::collections::HashMap;
use serde::Deserialize;

#[allow(non_snake_case)]
#[derive(Deserialize, Default, Clone, Debug)]
pub struct NormalizedTicker {
    pub price: Decimal,
}
#[allow(non_snake_case)]
#[derive(Deserialize, Default, Clone, Debug)]
pub struct NormalizedOrdersRow {
    price: Decimal,
    amount: Decimal,
}
#[allow(non_snake_case)]
#[derive(Deserialize, Default, Clone, Debug)]
pub struct NormalizedBook {
    pub bids: Vec<NormalizedOrdersRow>,
    pub asks: Vec<NormalizedOrdersRow>,
    pub price: Decimal,
}
#[derive(Debug, Clone)]
enum Sample {
    Binance(BinanceSpot),
    Bitfinex(BitfinexPair),
    Bitstamp(BitstampTicker),
    // Bittrex(BittrexPair),
    GateIo(GateIoPair),
    Huobi(HuobiTicker),
    Kraken(KrakenTickerInfo),
    Kucoin(KucoinTicker),
    Okex(OkexTicker),
    // Poloniex(PoloniexTicker),
    CoinbaseSpot(Decimal),
}

impl Into<NormalizedTicker> for Sample {
    fn into(self) -> NormalizedTicker {
        match self {
            Sample::Binance(t) => t.into(),
            Sample::Bitfinex(t) => t.into(),
            Sample::Bitstamp(t) => t.into(),
            // Sample::Bittrex(t) => t.into(),
            Sample::GateIo(t) => t.into(),
            Sample::Huobi(t) => t.into(),
            Sample::Kraken(t) => t.into(),
            Sample::Kucoin(t) => t.into(),
            Sample::Okex(t) => t.into(),
            // Sample::Poloniex(t) => t.into(),
            Sample::CoinbaseSpot(t) => {
                let mut res = NormalizedTicker::default();
                res.price = t;
                res
            }
        }
    }
}

// Get all feed data from various exchanges and return a hashmap of feed names and medianized values
pub async fn get_prices() -> HashMap<String, Decimal> {
    use Sample::*;
    let empty_vec: Vec<Sample> = Vec::new();
    let mut aggregates = HashMap::<Pair, Vec<Sample>>::new();
    let binance_spot = fetch_binance_spot();
    let bitfinex_spot = fetch_bitfinex_spot();
    let bitstamp_spot = fetch_bitstamp_spot();
    // let bittrex_spot = fetch_bittrex_spot();
    let coinbase_spot = fetch_coinbase_spot();
    let gateio_spot = fetch_gateio_spot();
    let huobi_spot = fetch_huobi_spot();
    let kraken_spot = fetch_kraken_spot();
    let kucoin_spot = fetch_kucoin_spot();
    let okex_spot = fetch_okex_spot();
    // let poloniex_spot = fetch_poloniex_spot();
    // println!("Binance markets {:#?}", binance_spot);
    if let Ok(binance_spot) = binance_spot.await {
        for p in binance_spot {
            let mut samples: Vec<_> = aggregates.get(&p.symbol).unwrap_or(&empty_vec).to_vec();
            samples.push(Binance(p.clone()));
            aggregates.insert(p.symbol, samples.clone());
        }
    } else {
        println!("Error: Binance fetch failure");
    }

    // println!("Bitfinex martkets {:#?}", bitfinex_spot);
    if let Ok(bitfinex_spot) = bitfinex_spot.await {
        for p in bitfinex_spot {
            let mut samples = aggregates.get(&p.symbol).unwrap_or(&empty_vec).to_vec();
            samples.push(Bitfinex(p.clone()));
            aggregates.insert(p.symbol, samples.to_vec());
        }
    } else {
        println!("Error: Bitfinex fetch failure");
    }

    // println!("Bitstamp markets {:#?}", bitstamp_spot);
    if let Ok(bitstamp_spot) = bitstamp_spot.await {
        for p in bitstamp_spot {
            let mut samples = aggregates.get(&p.pair).unwrap_or(&empty_vec).to_vec();
            samples.push(Bitstamp(p.clone()));
            aggregates.insert(p.pair, samples.to_vec());
        }
    } else {
        println!("Error: Bitstamp fetch failure");
    }

    // println!("Bittrex markets {:#?}", bittrex_spot);
    // if let Ok(bittrex_spot) = bittrex_spot.await {
    //     for p in bittrex_spot {
    //         let mut samples = aggregates.get(&p.symbol).unwrap_or(&empty_vec).to_vec();
    //         samples.push(Bittrex(p.clone()));
    //         aggregates.insert(p.symbol, samples.to_vec());
    //     }
    // } else {
    //     println!("Error: Bittrex fetch failure");
    // }

    if let Ok(coinbase_spot) = coinbase_spot.await {
        for (symbol, v) in coinbase_spot {
            let mut samples = aggregates.get(&symbol).unwrap_or(&empty_vec).to_vec();
            samples.push(CoinbaseSpot(v.clone()));
            aggregates.insert(symbol, samples.to_vec());
        }
    } else {
        println!("Error: Coinbase fetch failure");
    }

    // println!("Gateio markets {:#?}", gateio_spot);
    if let Ok(gateio_spot) = gateio_spot.await {
        for p in gateio_spot {
            let mut samples = aggregates
                .get(&p.currency_pair)
                .unwrap_or(&empty_vec)
                .to_vec();
            samples.push(GateIo(p.clone()));
            aggregates.insert(p.currency_pair, samples.to_vec());
        }
    } else {
        println!("Error: Gateio fetch failure");
    }

    //println!("Huobi markets {:#?}", huobi_spot.data);
    if let Ok(huobi_spot) = huobi_spot.await {
        for p in huobi_spot.data {
            let mut samples = aggregates.get(&p.symbol).unwrap_or(&empty_vec).to_vec();
            samples.push(Huobi(p.clone()));
            aggregates.insert(p.symbol, samples.to_vec());
        }
    } else {
        println!("Error: Huobi fetch failure");
    }

    // println!("Kraken markets {:#?}", kraken_spot.result);
    if let Ok(kraken_spot) = kraken_spot.await {
        for (k, v) in kraken_spot.result {
            let mut samples = aggregates.get(&k).unwrap_or(&empty_vec).to_vec();
            samples.push(Kraken(v.clone()));
            aggregates.insert(k, samples.to_vec());
        }
    } else {
        println!("Error: Kraken fetch failure");
    }

    // println!("Kucoin markets {:#?}", kucoin_spot.data.ticker);
    if let Ok(kucoin_spot) = kucoin_spot.await {
        for p in kucoin_spot.data.ticker {
            let mut samples = aggregates.get(&p.symbol).unwrap_or(&empty_vec).to_vec();
            samples.push(Kucoin(p.clone()));
            aggregates.insert(p.symbol, samples.to_vec());
        }
    } else {
        println!("Error: Kucoin fetch failure");
    }

    // println!("okex markets {:#?}", okex_spot.data);
    if let Ok(okex_spot) = okex_spot.await {
        for p in okex_spot.data {
            let mut samples = aggregates.get(&p.instId).unwrap_or(&empty_vec).to_vec();
            samples.push(Okex(p.clone()));
            aggregates.insert(p.instId, samples.to_vec());
        }
    } else {
        println!("Error: Okex fetch failure");
    }

    // println!("Bitstamp markets {:#?}", bitstamp_spot);
    // if let Ok(poloniex_spot) = poloniex_spot.await {
    //     for (symbol, v) in poloniex_spot.into_inner() {
    //         let mut samples = aggregates.get(&symbol).unwrap_or(&empty_vec).to_vec();
    //         samples.push(Poloniex(v.clone()));
    //         aggregates.insert(symbol, samples.to_vec());
    //     }
    // } else {
    //     println!("Error: Poloniex fetch failure");
    // }
    // Only retain more than 2 samples
    aggregates.retain(|k, v| v.len() > 2 && k.quote.contains("USD"));
    // println!("{:#?}", aggregates);
    // println!("{:#?}", aggregates.len());

    let mut feed_map = HashMap::<String, Decimal>::new();

    // go through each pair and calculate the average
    for (k, v) in aggregates {
        let _sum = 0.0;

        // get the median price
        let mut prices: Vec<Decimal> = v
            .iter()
            .map(|x| {
                let normalized: NormalizedTicker = (*x).clone().into();
                normalized.price
            })
            .collect();
        prices.sort_by(|a, b| a.partial_cmp(b).unwrap());

        let mut median: Decimal;

        // handle even and odd cases
        if prices.len() % 2 == 0 {
            let mid = prices.len() / 2;
            median = (prices[mid] + prices[mid - 1]) / Decimal::from(2);
        } else {
            median = prices[prices.len() / 2];
        }

        // get pair name as string
        let name = format!("{}/{}", k.base, k.quote);
        // println!("{} -> {}", name, median);

        // get mean
        let sum: Decimal = prices.iter().sum();
        let count = Decimal::from(prices.len() as i32);
        let mean = sum / count;

        // get variance
        let squared_deviations: Decimal = prices.iter().map(|&x| (x - mean).powi(2)).sum();
        let variance = squared_deviations / count;

        // get standard deviation
        let std_dev = variance.sqrt().unwrap();

        // filter out prices that are not within 1 std dev of the mean
        let prices = if prices.len() > 3 {
            prices
                .iter()
                .filter(|&x| {
                    let lower_bound = median - std_dev;
                    let upper_bound = median + std_dev;
                    let x_is_in_range = *x >= lower_bound && *x <= upper_bound;
                    // for debugging:
                    // if !x_is_in_range {
                    //     // get index in prices
                    //     println!("Feed Name {},  {} is not in range {} - {}", name, x, lower_bound, upper_bound);
                    // }
                    x_is_in_range
                })
                .map(|x| *x)
                .collect()
        } else {
            prices
        };
        if prices.len() == 0 {
            continue;
        }

        // recalculate median
        if prices.len() % 2 == 0 {
            let mid = prices.len() / 2;
            median = (prices[mid] + prices[mid - 1]) / Decimal::from(2);
        } else {
            median = prices[prices.len() / 2];
        }
        
        // get median with fixed decimals at 18 as Decimal
        median.rescale(18);

        // add to map
        feed_map.insert(name, median);
    }

    // return the medians and names
    feed_map
}