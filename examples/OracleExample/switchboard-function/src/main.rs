// Decimals are used for prices
use rust_decimal::prelude::*;
use rust_decimal::Decimal;

// Prices are stored in a hashmap
use std::collections::HashMap;
use std::time::SystemTime;

// Use the Switchboard Starknet Macros
use switchboard_starknet_macros::{switchboard_function};
use switchboard_common::SbFunctionError;
use switchboard_starknet_sdk::*;

// Use the Exchange APIs
mod exchange_api;
pub use exchange_api::*;
use reqwest::Error;

// Core Starknet Types to make it easier to write the Switchboard Function
use starknet::{
    accounts::Call,
    core::types::FieldElement,
    providers::{jsonrpc::HttpTransport, JsonRpcClient},
    macros::*,
};
use url::Url;

// Use the Starknet Abigen Parser to create bindings to the Switchboard Function Contract
use sb_starknet_abigen_parser;
use sb_starknet_abigen_macros::abigen;
abigen!(PriceOracle, "./src/price_oracle.json");


// Target Address for the Function Call
static RECEIVER: &str = env!("RECEIVER_ADDRESS");
static RPC_URL: &str = env!("RPC");

// Define the Switchboard Function - resulting in a vector of calls to be sent by the function contract
#[switchboard_function]
pub async fn oracle_function(
    _function_runner: StarknetFunctionRunner,
    _params: Vec<FieldElement>,
) -> Result<Vec<Call>, SbFunctionError> {

    // Get prices a map of ticker to price from popular echanges
    let prices: HashMap<String, Decimal> = exchange_api::get_prices().await;

    /*

        Starknet-rs Call type we must return:

        #[derive(Debug, Clone)]
        pub struct Call {
            pub to: FieldElement,
            pub selector: FieldElement,
            pub calldata: Vec<FieldElement>,
        }

    */
    let expedited_tickers = vec![
        "ETH/USD",
        "BTC/USD",
    ];

    let tickers = vec![
        "SOL/USD",
        "BNB/USDT",
        "XRP/USD",
        "ADA/USD",
        "DOGE/USD",
        "AVAX/USD",
        "TRON/USDT",
        "SUI/USD",
        "APT/USD",
        "DOT/USD",
        "LINK/USD",
        "MATIC/USD",
        "TON/USDT",
        "LTC/USD",
        "SHIB/USD",
        "BONK/USDT",
        "TIA/USD",
        "ATOM/USD",
        "PTYH/USDT",
        "XLM/USD",
        "UNI/USD",
        "XMR/USDT",
        "STETH/USDT",
        "BUSD/USDT",
    ];

    // Create a vector of calls to be sent by the function contract
    let mut calls: Vec<Call> = Vec::new();

    // Get state of the Feed Pusher Contract
    let rpc_url = Url::parse(RPC_URL).unwrap();
    let provider = JsonRpcClient::new(HttpTransport::new(rpc_url.clone()));
    let contract_address = FieldElement::from_hex_be(RECEIVER).unwrap();
    let contract = PriceOracleReader::new(contract_address, &provider);
    let feeds = contract.get_feeds().await.unwrap();


    //==================================================================================================
    // Get all existing feed prices
    //==================================================================================================

    // get a map of feeds to prices
    let mut feed_prices: HashMap<FieldElement, u128> = HashMap::new();
    for feed in feeds {
        feed_prices.insert(feed.feed_id, feed.value);
    }

    // prepare the feed ids and values to be sent to the contract
    let mut feed_ids: Vec<FieldElement> = Vec::new();
    let mut feed_values: Vec<FieldElement> = Vec::new();

    //==================================================================================================
    // Handle Expedited Tickers (ETH/USD, BTC/USD) which should update with a 0.5% difference
    //==================================================================================================

    // Create a call for each ticker
    for ticker in expedited_tickers {
        if !prices.contains_key(ticker) {
            continue;
        }

        // Get the ticker as a felt
        let ticker_felts = str_to_cairo_long_string(ticker);
        let ticker_felt = ticker_felts.first().unwrap();
        let existing_feed_price = feed_prices.get(ticker_felt);

        // Get the new price as a u128, scaled to 18 decimals (the same as the feed price)
        let mut new_price: Decimal = *prices.get(ticker).unwrap();
        new_price.rescale(18);
        let u128_value: u128 = new_price.mantissa().try_into().unwrap();

        // Get the decimal as a felt
        let price_field_element: Vec<FieldElement> = decimal_to_felt(new_price).unwrap();
        let new_value_felt = price_field_element.first().unwrap().clone();

        // If the feed price is found, check if the price is greater than 0.5% different
        if let Some(fp) = existing_feed_price {

            // If the price is greater than 0.5% different, update the price
            if is_greater_than_specified_percentage_difference(*fp, u128_value, 0.5) {
                feed_ids.push(*ticker_felt);
                feed_values.push(new_value_felt);
            }

        // If the feed price is not found, add the price
        } else {
            feed_ids.push(*ticker_felt);
            feed_values.push(new_value_felt);
        }
    }


    //==================================================================================================
    // Handle Tickers which should update with a 1.5% difference
    //==================================================================================================

    // Create a call for each ticker
    for ticker in tickers {
        if !prices.contains_key(ticker) {
            continue;
        }

        // Get the ticker as a felt
        let ticker_felts = str_to_cairo_long_string(ticker);
        let ticker_felt = ticker_felts.first().unwrap();
        let existing_feed_price = feed_prices.get(ticker_felt);

        // Get the new price as a u128, scaled to 18 decimals (the same as the feed price)
        let mut new_price: Decimal = *prices.get(ticker).unwrap();
        new_price.rescale(18);
        let u128_value: u128 = new_price.mantissa().try_into().unwrap();

        // Get the decimal as a felt
        let price_field_element: Vec<FieldElement> = decimal_to_felt(new_price).unwrap();
        let new_value_felt = price_field_element.first().unwrap().clone();

        // If the feed price is found, check if the price is greater than 1.5% different
        if let Some(fp) = existing_feed_price {

            // If the price is greater than 1.5% different, update the price
            if is_greater_than_specified_percentage_difference(*fp, u128_value, 1.5) {
                feed_ids.push(*ticker_felt);
                feed_values.push(new_value_felt);
            }

        // If the feed price is not found, add the price
        } else {
            feed_ids.push(*ticker_felt);
            feed_values.push(new_value_felt);
        }
    }

    if feed_ids.len() != 0 && feed_values.len() != 0 {
        // Create a call to the Switchboard Push Contract
        let to = FieldElement::from_hex_be(RECEIVER).unwrap();
        let current_time = SystemTime::now().duration_since(SystemTime::UNIX_EPOCH).unwrap().as_secs();

        // Create the update callback data
        let mut update_calldata: Vec<FieldElement> = Vec::new();

        // Add the feed ids array
        update_calldata.push(FieldElement::from(feed_ids.len()));
        update_calldata.extend(feed_ids);

        // Add the feed values array
        update_calldata.push(FieldElement::from(feed_values.len()));
        update_calldata.extend(feed_values);

        // Add the current time
        update_calldata.push(FieldElement::from(current_time));

        // Create a call to the Switchboard Push Contract
        let call = Call {
            // The target address of the call
            to,
            // The function to call on the target contract
            selector: selector!("update_prices"),
            // The calldata to send to the target contract
            calldata: update_calldata,
        };

        calls.push(call);
    }

    if calls.len() == 0 {
        println!("No calls to be made");

        // return an error
        return Err(SbFunctionError::CallbackError);
    }

    // Return the Vec of callbacks to be run by the Switchboard Function on-chain
    Ok(calls)
}


// DEPRECATED - get a call to update a single price
pub fn get_price_update_call(prices: HashMap<String, Decimal>, ticker: &str) -> Call {
    let to = FieldElement::from_hex_be(RECEIVER).unwrap();
    let current_time = SystemTime::now().duration_since(SystemTime::UNIX_EPOCH).unwrap().as_secs();

    // Get the Ethereum Price callback data
    let mut update_calldata: Vec<FieldElement> = str_to_cairo_long_string(ticker);
    let price_field_element: Vec<FieldElement> = decimal_to_felt(*prices.get(ticker).unwrap()).unwrap();
    update_calldata.extend(price_field_element);
    update_calldata.push(FieldElement::from(current_time));

    // Create a call to the Switchboard Push Contract
    Call {
        // The target address of the call
        to,
        // The function to call on the target contract
        selector: selector!("update_price"),
        // The calldata to send to the target contract
        calldata: update_calldata,
    }
}

fn is_greater_than_specified_percentage_difference(a: u128, b: u128, percentage: f64) -> bool {
    let difference = if a > b { a - b } else { b - a } as f64;
    let percentage_of_a = a as f64 * (percentage / 100.0);

    difference > percentage_of_a
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test() {
        let prices: HashMap<String, Decimal> = exchange_api::get_prices().await;
        let tickers = vec![
            "ETH/USD",
            "BTC/USD",
            "SOL/USD",
            "BNB/USDT",
            "XRP/USD",
            "ADA/USD",
            "DOGE/USD",
            "AVAX/USD",
            "SUI/USD",
            "APT/USD",
            "DOT/USD",
            "LINK/USD",
            "MATIC/USD",
            "TON/USDT",
            "LTC/USD",
            "SHIB/USD",
            "BONK/USDT",
            "TIA/USD",
            "ATOM/USD",
            "UNI/USD",
            "XMR/USDT",
            "STETH/USDT",
        ];


        // Get state of the Feed Pusher Contract
        let rpc_url = Url::parse("https://starknet-goerli.infura.io/v3/<infura key>").unwrap();
        let provider = JsonRpcClient::new(HttpTransport::new(rpc_url.clone()));
        let contract_address = FieldElement::from_hex_be("0x014d660768cb98256ceb18d821fd02fd1b54b6028679ceca3dbe03389228f285").unwrap();
        let contract = PriceOracleReader::new(contract_address, &provider);
        let feeds = contract.get_feeds().await.unwrap();

        // get a map of feeds to prices
        let mut feed_prices: HashMap<FieldElement, u128> = HashMap::new();
        for feed in feeds {
            feed_prices.insert(feed.feed_id, feed.value);
        }

        // Create a call for each ticker
        for ticker in tickers {
            if !prices.contains_key(ticker) {
                continue;
            }

            // Get the ticker as a felt
            let ticker_felts = str_to_cairo_long_string(ticker);
            let ticker_felt = ticker_felts.first().unwrap();
            let existing_feed_price = feed_prices.get(ticker_felt);

            // If the feed price is found, check if the price is greater than 0.5% different
            if let Some(fp) = existing_feed_price {

                // Get the new price as a u128, scaled to 18 decimals (the same as the feed price)
                let mut new_price: Decimal = *prices.get(ticker).unwrap();
                new_price.rescale(18);
                let u128_value: u128 = new_price.mantissa().try_into().unwrap();

                // If the price is greater than 0.5% different, update the price
                if is_greater_than_specified_percentage_difference(*fp, u128_value, 1.0) {
                    println!("Updating price for {}", ticker);
                } else {
                    println!("Not updating price for {}", ticker);
                }

                println!("{}: {} vs {}", ticker, fp, u128_value);

            // If the feed price is not found, add the price
            } else {
                println!("Adding price for {}", ticker);
            }
        }
    }
}
