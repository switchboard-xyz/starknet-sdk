<div align="center">

![Switchboard Logo](https://github.com/switchboard-xyz/sbv2-core/raw/main/website/static/img/icons/switchboard/avatar.png)

# Switchboard x Starknet

> A collection of libraries and examples for interacting with Switchboard on Starknet

[![NPM Badge](https://img.shields.io/github/package-json/v/switchboard-xyz/sbv2-evm?color=red&filename=javascript%2Fstarknet.js%2Fpackage.json&label=%40switchboard-xyz%2Fstarknet.js&logo=npm)](https://www.npmjs.com/package/@switchboard-xyz/starknet.js)

</div>

## Getting Started

To get started, clone the
[starknet](https://github.com/switchboard-xyz/starknet-sdk) repository.

## Switchboard Functions

Switchboard V3 revolves around the concept of a `Switchboard Function`. Functions are the core building block of Switchboard. They are the unit of work that is performed by the Switchboard network. Functions can be user defined, and can be composed together to create more complex functions. Function calls can be initialized on-chain, or on a schedule.

## Switchboard Feeds

Switchboard Data Feeds are powered by Switchboard Functions. You can find the source code (contracts and off-chain logic) for the Switchboard Function that powers the available feeds in the [functions repository](https://github.com/switchboard-xyz/starknet-sdk/examples/OracleExample).

- [receiver.cairo](https://github.com/switchboard-xyz/starknet-sdk/examples/OracleExample/contracts/PriceOracle/src/components/receiver.cairo) - The main entry point for the Switchboard Feed Function. This contract is deployed by the Switchboard, and is responsible for receiving data from the off-chain Switchboard Function, and making it available to other contracts.
- [Main.rs](https://github.com/switchboard-xyz/starknet-sdk/examples/OracleExample/switchboard-function/src/main.rs) - The off-chain Switchboard Function that powers the Switchboard Feed. This function is responsible for fetching data from an external API, and submitting it to the Switchboard Receiver contract.

You can find existing Switchboard Feeds and their ID's for accessing in solidity at [app.switchboard.xyz](https://app.switchboard.xyz/).

You can use this simple price function (which supplies 20+ feeds from top exchanges!) and build custom functionality on top of it

## Addresses

### Starknet

The following addresses can be used with the Switchboard deployment on Starknet

#### Mainnet

| Account                  | Address                                                              |
| ------------------------ | -------------------------------------------------------------------- |
| Switchboard Address      | `0x0728d32b3d508dbe5989824dd0edb1e03b8a319d561b9ec6507dff245a95c52f` |
| Switchboard Push Address | `0x02b5ebc4a7149600ca4890102bdb6b7d6daac2fbb9d9ccd01f7198ca29107ec4` |
| Permissionless Queue ID  | `0x0000000000000000000000000000000000000000000000000000000000000001` |

#### Testnet (Goerli)

| Account                  | Address                                                              |
| ------------------------ | -------------------------------------------------------------------- |
| Switchboard Address      | `0x026183fd8df673e4b2a007eec9d70bc38eb8a0df960dd5b0c57a9250ae2e63ac` |
| Switchboard Push Address | `0x014d660768cb98256ceb18d821fd02fd1b54b6028679ceca3dbe03389228f285` |
| Permissionless Queue ID  | `0x0000000000000000000000000000000000000000000000000000000000000001` |

### Using Switchboard

Open `src/lib.cairo` and write your contract.

The easiest way to use Switchboard on Starknet is to use the following simple interface:

```cairo
// This will generate ISwitchboardPushDispatcher and ISwitchboardPushDispatcherTrait
#[starknet::interface]
trait ISwitchboardPush<State> {
    fn get_latest_result(self: @State, feed_id: felt252) -> (u128, u64);
}
```

```cairo
#[starknet::contract]
mod MyProject {
    #[constructor]
    fn constructor(
        ref self: ContractState,
        switchboard_address: ContractAddress,
    ) {
        ...
    }

    // ETH/USD Feed ID: 0x4554482f555344
    // BTC/USD Feed ID: 0x4254432f555344
    fn read_switchboard_value(
        ref self: ContractState,
        feed_id: felt252,
    ) -> (u128, u64) {
        // mainnet address: 0x02b5ebc4a7149600ca4890102bdb6b7d6daac2fbb9d9ccd01f7198ca29107ec4
        // testnet (goerli) address: 0x014d660768cb98256ceb18d821fd02fd1b54b6028679ceca3dbe03389228f285
        let dispatcher = ISwitchboardPushDispatcher { contract_address: self.switchboard_address.read() };
        let (value, timestamp) = dispatcher.get_latest_result(feed_id);
        (value, timestamp)
    }
}
```

<!-- ## Clients
## Example Contracts -->

## Troubleshooting

1. File a [GitHub Issue](https://github.com/switchboard-xyz/sbv2-evm/issues/new)
2. Ask a question in
   [Discord #dev-support](https://discord.com/channels/841525135311634443/984343400377647144)
