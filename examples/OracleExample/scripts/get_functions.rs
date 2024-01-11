#!/usr/bin/env cargo

//! ```cargo
//! [dependencies]
//! switchboard-starknet-sdk = "0.0.5"
//! starknet = "0.8.0"
//! url = "2.2.0"
//! tokio = { version = "1", features = ["full", "macros"] }
//! futures = "0.3"
//! serde = "1.0"
//! serde_json = "1.0"
//! dirs = "4.0"
//! ```

extern crate switchboard_starknet_sdk;
extern crate starknet;
extern crate url;
extern crate tokio;
extern crate futures;
extern crate serde;
extern crate serde_json;
extern crate dirs;

// This rust script can only be used with rust nightly
// rustup toolchain install nightly
// rustup override set nightly
// cargo --verbose -Zscript ./get_functions.rs

#[tokio::main(worker_threads = 4)]
async fn main() {
    use switchboard_starknet_sdk::*;
    use std::sync::Arc;
    use starknet::{
        core::types::FieldElement,
        providers::{jsonrpc::HttpTransport, JsonRpcClient},
    };
    use url::Url;
    use serde_json::Value;
    use std::path::PathBuf;
    use std::fs;

    let account = std::env::var("PROFILE").unwrap_or("main".to_string());

    // get the user's account address from ~/.starkli-wallets/main/account.json
    let home_dir = dirs::home_dir().ok_or("Could not find home directory").unwrap();
    let json_path: PathBuf = [home_dir.to_str().unwrap(), ".starkli-wallets", &account, "account.json"].iter().collect();
    let json_content = fs::read_to_string(json_path).unwrap();
    let json: Value = serde_json::from_str(&json_content).unwrap();
    let authority_address = json["deployment"]["address"]
        .as_str()
        .ok_or("Address not found in JSON").unwrap();

    
    // get environment variables
    let contract_address =
        std::env::var("CONTRACT_ADDRESS").expect("CONTRACT_ADDRESS must be set");

    // setup the switchboard reader
    let rpc_url = Url::parse("https://starknet-mainnet.infura.io/v3/<infura key>").unwrap();
    let provider = Arc::new(JsonRpcClient::new(HttpTransport::new(rpc_url.clone())));
    let contract_address = FieldElement::from_hex_be(&contract_address).unwrap();
    let authority_address = FieldElement::from_hex_be(&authority_address).unwrap();
    let reader = SwitchboardReader::new(contract_address, &provider);

    // get the user feeds
    println!("{:#?}", reader.get_functions_by_authority(&ContractAddress(authority_address)).await.unwrap());
}
