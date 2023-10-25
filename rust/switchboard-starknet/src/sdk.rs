use std::env;
use std::sync::Arc;

use crate::bindings::error::SwitchboardClientError;
use crate::bindings::switchboard;
use crate::utils::{generate_signer, load_env_address};
// use ethers::abi::AbiDecode;
// // use ethers::prelude::k256::ecdsa::SigningKey;
// use ethers::prelude::{ContractCall, SignerMiddleware};
// use ethers::providers::{JsonRpcClient, Provider};
// use ethers::signers::{Signer, Wallet};
// use ethers::types::{Address, Bytes, U256};
use serde_json;
use starknet::core::crypto::Signature;
use switchboard_common::{
    ChainResultInfo, EvmTransaction, FunctionResult, FunctionResultV0, Gramine, StarknetCall,
    StarknetFunctionResult,
};

use starknet::{
    accounts::{Call as NativeCall, ExecutionEncoding, SingleOwnerAccount},
    core::types::{BlockId, BlockTag, EventFilter, FieldElement},
    core::utils::starknet_keccak,
    macros::{abigen, felt},
    providers::{jsonrpc::HttpTransport, JsonRpcClient, Provider},
    signers::{LocalWallet, Signer, SigningKey},
};
// pub type EVMMiddleware<T> = SignerMiddleware<Provider<T>, Wallet<SigningKey>>;
use starknet_crypto::poseidon_hash_many;
// #[derive(Debug, Clone, Hash, Default, Serialize)]
// pub struct CallData {
//     pub to: FieldElement,
//     pub selector: FieldElement,
//     pub calldata: Vec<Vec<u8>>,
// }
//
// #[derive(Debug, Clone, Hash, Default, Serialize)]
// pub struct Call {
//     pub data: CallData,
//     pub signature: Signature,
// }

#[derive(Clone)]
pub struct StarknetFunctionRunner {
    pub function_id: FieldElement,
    pub enclave_key: SigningKey,
    pub enclave_wallet: LocalWallet,
    pub signer: FieldElement,
    pub verifying_contract: FieldElement,
    pub chain_id: u64,
    // pub params: Vec<Vec<u8>>,
    // pub call_ids: Vec<>,
}

impl std::fmt::Display for StarknetFunctionRunner {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(
            f,
            "SwitchboardFunctionRunner: signer: {}, verifying_contract: {}, function_id: {}",
            self.signer,
            self.verifying_contract.to_string(),
            self.function_id.to_string(),
        )
    }
}

impl StarknetFunctionRunner {
    pub fn new() -> Result<StarknetFunctionRunner, SwitchboardClientError> {
        let enclave_key = generate_signer();
        let enclave_wallet = LocalWallet::from_signing_key(enclave_key.clone());
        let signer = enclave_key.verifying_key().scalar();
        let chain_id = env::var("CHAIN_ID").unwrap();
        let verifying_contract = load_env_address("VERIFYING_CONTRACT")?;
        let function_id = load_env_address("FUNCTION_KEY")?;

        // let params = env::var("FUNCTION_PARAMS").unwrap_or(String::new());
        // let params: Vec<Vec<u8>> = serde_json::from_str(&params).unwrap_or_default();

        // get call ids as vec of Addresses
        // let call_ids = env::var("FUNCTION_CALL_IDS").unwrap_or(String::new());
        // let call_ids: Vec<Vec<u8>> = serde_json::from_str(&call_ids).unwrap_or_default();
        // let call_ids: Vec<Address> = call_ids
        //     .iter()
        //     .map(|c| Address::from_slice(c.as_slice()))
        //     .collect();

        Ok(Self {
            function_id,
            enclave_key,
            enclave_wallet,
            signer,
            verifying_contract,
            // params,
            // call_ids,
            chain_id: chain_id.parse().unwrap_or(1),
        })
    }
    pub fn get_result(
        &self,
        to: FieldElement,
        calls: Vec<NativeCall>, // expiration_time_seconds: U256,
                                // gas_limit: U256,
                                // calls: Vec<ContractCall<EVMMiddleware<T>, ()>>, // vector of instructions to call
                                // call_ids: Vec<Address>,
    ) -> Result<FunctionResult, SwitchboardClientError> {
        // get map of call_id to index in calls
        // let call_id_map: std::collections::HashMap<Address, usize> = self
        //     .call_ids
        //     .iter()
        //     .enumerate()
        //     .map(|(i, c)| (c.clone(), i))
        //     .collect();

        let (txs, signatures): (Vec<StarknetCall>, Vec<Vec<Vec<u8>>>) = calls
            .into_iter()
            .map(|call| {
                // TODO: gas limit should be moved to function settings on-chain
               
                let txn = StarknetCall {
                    to: call.to.to_bytes_be().to_vec(),
                    selector: call.selector.to_bytes_be().to_vec(),
                    calldata: call.calldata.iter().map(|p| p.to_bytes_be().to_vec()).collect(),
                };
                let mut to_hash = vec![call.to, call.selector];
                let mut calldata = call.calldata;
                to_hash.append(&mut calldata);
                let call_hash: FieldElement = poseidon_hash_many(to_hash.as_slice());
                let signature = self.enclave_key.sign(&call_hash).unwrap();

                
                // let eip712_hash = eip712::get_transaction_hash(
                //     "Switchboard".to_string(),
                //     "0.0.1".to_string(),
                //     self.chain_id,
                //     self.verifying_contract,
                //     transaction,
                // )
                // .unwrap();

                // let evm_txn = EvmTransaction {
                //     expiration_time_seconds: expiration_time_seconds.as_u64(),
                //     gas_limit: gas_limit.to_string(),
                //     data: c.tx.data().unwrap().clone().to_vec(),
                //     from: self.enclave_wallet.address().as_bytes().to_vec(),
                //     to: c.tx.from().unwrap_or(&to).clone().as_bytes().to_vec(),
                //     value: c.tx.value().unwrap_or(&U256::from(0)).to_string(),
                // };

                // (
                //     evm_txn,
                //     Bytes::from(
                //         self.enclave_wallet
                //             .sign_hash(ethers::types::H256::from(eip712_hash))
                //             .unwrap()
                //             .to_vec(),
                //     ),
                // )
                let sig_encoded = vec![signature.r.to_bytes_be().to_vec(), signature.s.to_bytes_be().to_vec()];
                (txn, sig_encoded)
            })
            .unzip();

        // Only get the checksums for params at index of passed in call_ids using call_id_map
        // let checksums = call_ids
        //     .iter()
        //     .map(|c| {
        //         let index = call_id_map.get(c).unwrap();
        //         ethers::utils::keccak256(self.params[*index].clone())
        //             .as_slice()
        //             .to_vec()
        //     })
        //     .collect();

        let chain_result_info = ChainResultInfo::Starknet(StarknetFunctionResult {
            txs,
            signatures,
            // call_ids: call_ids.iter().map(|c| c.as_bytes().to_vec()).collect(),
            // checksums,
        });

        let quote_raw =
            Gramine::generate_quote(&self.enclave_key.verifying_key().scalar().to_bytes_be())
                .unwrap_or_default();

        if quote_raw.len() == 0 {
            println!(
                "WARNING: Error generating quote. This is likely due to the enclave not being initialized."
            )
        }

        // let fn_request_key = if self.params.len() != 0 {
        //     let request_key = load_env_address("FUNCTION_REQUEST_KEY").unwrap_or_default();
        //     request_key.as_bytes().to_vec()
        // } else {
        //     Vec::new()
        // };

        let fn_request_key = Vec::new();
        Ok(FunctionResult::V0(FunctionResultV0 {
            quote: quote_raw,
            fn_key: self.function_id.to_bytes_be().to_vec(),
            signer: self
                .enclave_key
                .verifying_key()
                .scalar()
                .to_bytes_be()
                .to_vec(),
            fn_request_key,
            fn_request_hash: Vec::new(),
            chain_result_info,
            error_code: 0,
        }))
    }

    // pub fn params<T: AbiDecode>(&self) -> Vec<(Result<T, SwitchboardClientError>, Address)> {
    //     // params and matching call_ids
    //     self.params
    //         .iter()
    //         .zip(self.call_ids.clone())
    //         .map(|(p, c)| {
    //             (
    //                 T::decode(p.as_slice()).map_err(|e| SwitchboardClientError::CustomError {
    //                     message: "failed to parse function param".to_string(),
    //                     source: Arc::new(e),
    //                 }),
    //                 c,
    //             )
    //         })
    //         .collect()
    // }

    // Emit the function result
    // This will trigger the switchboard verifier and trigger the submission of the
    // passed in meta-transactions (funded by the switchboard function escrow).
    pub fn emit(
        &self,
        to: FieldElement,
        // expiration_time_seconds: U256,
        // gas_limit: U256,
        calls: Vec<NativeCall>, // vector of instructions to call
    ) -> Result<(), SwitchboardClientError> {
        self.get_result(to, calls)
            .map_err(|e| SwitchboardClientError::CustomError {
                message: "failed to run function verify".to_string(),
                source: Arc::new(e),
            })
            .unwrap()
            .emit();
        Ok(())
    }

    // Emit but resolve a subset of call_ids corresponding to some parameters
    // This is useful for when you want to resolve a subset of the calls (allowing for 1 run per 1 call)
    pub fn emit_resolve(
        &self,
        to: FieldElement,
        // expiration_time_seconds: U256,
        // gas_limit: U256,
        calls: Vec<NativeCall>, // vector of instructions to call
                                // call_ids: Vec<Address>,
    ) -> Result<(), SwitchboardClientError> {
        self.get_result(to, calls)
            .map_err(|e| SwitchboardClientError::CustomError {
                message: "failed to run function resolve".to_string(),
                source: Arc::new(e),
            })
            .unwrap()
            .emit();
        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use starknet::core::utils::cairo_short_string_to_felt;

    // Note this useful idiom: importing names from outer (for mod tests) scope.
    use super::*;

    #[test]
    fn emit() {
        // this test is just to make sure everything works, the data is dummy
        let fe = FieldElement::from_hex_be(
            "0x4e521104197a8a8951ac5ab4a7fa8b4739665c68face7ed7317959b3c8d247b",
        )
        .unwrap();
        let sk = SigningKey::from_random();
        let w = LocalWallet::from_signing_key(sk.clone());
        let runner = StarknetFunctionRunner {
            function_id: fe.clone(),
            enclave_key: sk,
            enclave_wallet: w,
            signer: fe.clone(),
            verifying_contract: fe.clone(),
            chain_id: 1,
        };
        let native_call = NativeCall {
            to: fe.clone(),
            selector: cairo_short_string_to_felt("withdraw").unwrap(),
            calldata: vec![],
        };

        runner.emit(fe.clone(), vec![native_call]);
    }
}
