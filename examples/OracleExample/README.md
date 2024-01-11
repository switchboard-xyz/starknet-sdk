# Switchboard Starknet SDK

**A library for interacting with switchboard smart contracts** written in Cairo for [Starknet](https://starkware.co/product/starknet/), a decentralized ZK Rollup.

> **Warning**
> This repo contains highly experimental code.
> It has no code coverage checks.
> It hasn't been audited.
> **Use at your own risk.**

## Usage

> **Warning**
> Expect rapid iteration.
> Some contracts or features are not ready to be deployed.
> Check the **Unsupported** section below.

### Prepare the environment

Simply [install Cairo and scarb](https://docs.swmansion.com/scarb/download).

### Set up your project

Create a new project and `cd` into it.

```bash
scarb new my_project && cd my_project
```

The contents of `my_project` should look like this:

```bash
$ ls

Scarb.toml src
```

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

    fn read_switchboard_value(
        ref self: ContractState,
        feed_id: felt252,
    ) -> (u128, u64) {
        let dispatcher = ISwitchboardPushDispatcher { contract_address: self.switchboard_address.read() };
        let (value, timestamp) = dispatcher.get_latest_result(feed_id);
        (value, timestamp)
    }
}
```
