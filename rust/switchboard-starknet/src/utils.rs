use crate::bindings::error::SwitchboardClientError;
// use ethers::types::transaction::eip712::EIP712Domain;
// use ethers::{prelude::k256::ecdsa::SigningKey, signers::Wallet, types::Address};
use rand::SeedableRng;
use starknet::{
    accounts::{ExecutionEncoding, SingleOwnerAccount},
    core::types::{BlockId, BlockTag, EventFilter, FieldElement},
    core::utils::starknet_keccak,
    macros::{abigen, felt},
    providers::{jsonrpc::HttpTransport, JsonRpcClient, Provider},
    signers::{LocalWallet, SigningKey},
};
use std::env;
use std::result::Result;
use std::str::FromStr;

pub fn load_env_address(key: &str) -> Result<FieldElement, SwitchboardClientError> {
    let key = &env::var(key).unwrap_or(String::new());
    FieldElement::from_hex_be(key)
        .map_err(|_| SwitchboardClientError::EnvVariableMissing(key.to_string()))
}

pub fn generate_signer() -> SigningKey {
    let mut randomness = [0; 32];
    switchboard_common::Gramine::read_rand(&mut randomness).unwrap();
    let mut seeded_rng = rand::rngs::StdRng::from_seed(randomness);
    //   ethers::signers::Wallet::new(&mut seeded_rng)
    // TODO(mgild)
    SigningKey::from_random()
}
// pub fn sign_typed_data(
//     wallet: Wallet<ethers::core::k256::ecdsa::SigningKey>,
//     payload: &eip712::Transaction,
//     domain: EIP712Domain,
// ) -> Result<ethers::types::Signature, ethers::signers::WalletError> {
//     let encoded = payload
//         .encode_eip712(domain)
//         .map_err(|e| ethers::signers::WalletError::Eip712Error(e.to_string()))?;
//
//     wallet.sign_hash(ethers::core::types::H256::from(encoded))
// }
