use super::admin;


#[derive(Copy, Drop, Serde, starknet::Store)]
struct Feed {
    value: u128,
    timestamp: u64,
    reported_timestamp: u64,
    feed_id: felt252,
}

#[starknet::interface]
trait IReceiverLib<State> {}

#[starknet::interface]
trait IExternalReceiverLib<State> {
    fn update_price(ref self: State, feed_id: felt252, value: u128, reported_timestamp: u64);
    fn update_prices(ref self: State, feed_ids: Array<felt252>, values: Array<u128>, reported_timestamp: u64);
    fn get_feeds(self: @State) -> Array<Feed>;
    fn get_feed(self: @State, feed_id: felt252) -> Feed;
    fn get_latest_result(self: @State, feed_id: felt252) -> (u128, u64);
}

#[starknet::component]
mod receiver_lib {
    use super::admin::{admin_lib, IAdminLib};
    use super::Feed;
    use openzeppelin::access::accesscontrol::AccessControlComponent;
    use openzeppelin::introspection::src5::SRC5Component;

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        NewResult: NewResult,
    }

    #[derive(Drop, starknet::Event)]
    struct NewResult {
        feed_id: felt252,
        value: u256,
        timestamp: u64,
    }

    #[storage]
    struct Storage {
        // feed idx -> feed address
        // This is because using a span would limit is to 256 feeds in storage. Using this method is more scalable.
        feed_ids: LegacyMap<felt252, felt252>,
        // feed ids length
        feeds_ids_len: felt252,
        // DEPRECATED
        // feed hash -> feed description
        feed_map: LegacyMap<felt252, Feed>,
        // latest timestamp
        latest_timestamp: u64,
        // track values
        feed_values_map: LegacyMap<felt252, u128>,
    }

    // For now we need to provie a helper to access UtilLib. In the future, helpers will be generated
    // to help components access their dependencies.
    #[generate_trait]
    impl Dependencies<
        TContractState,
        +HasComponent<TContractState>,
        +admin_lib::HasComponent<TContractState>,
        +SRC5Component::HasComponent<TContractState>,
        +AccessControlComponent::HasComponent<TContractState>,
        +Drop<TContractState>
    > of DependenciesTrait<TContractState> {
        fn get_function_address(
            self: @ComponentState<TContractState>
        ) -> starknet::ContractAddress {
            let contract = self.get_contract();
            let admin_lib = admin_lib::HasComponent::get_component(contract);
            admin_lib.get_function_address_internal()
        }

        fn set_function_address(
            ref self: ComponentState<TContractState>,
            address: starknet::ContractAddress,
        ) {
            let mut contract = self.get_contract_mut();
            let mut admin_lib = admin_lib::HasComponent::get_component_mut(ref contract);
            admin_lib.set_function_address_internal(address);
        }

        fn write_price(
            ref self: ComponentState<TContractState>,
            feed_id: felt252,
            value: u128,
            timestamp: u64,
        ) {

            // Deprecated for now - we don't need to store individual update timestamps
            // let feed = Feed { value, timestamp, reported_timestamp: timestamp, feed_id };
            // self.feed_map.write(feed_id, feed);
            self.feed_values_map.write(feed_id, value);
        }

        fn write_feed(
            ref self: ComponentState<TContractState>,
            feed_id: felt252,
        ) {
            let feed_ids_len = self.feeds_ids_len.read();
            self.feed_ids.write(feed_ids_len, feed_id);
            self.feeds_ids_len.write(feed_ids_len + 1);
        }
    }

    impl ReceiverLib<
        TContractState,
        +HasComponent<TContractState>,
        +admin_lib::HasComponent<TContractState>,
        +SRC5Component::HasComponent<TContractState>,
        +AccessControlComponent::HasComponent<TContractState>,
        +Drop<TContractState>
    > of super::IReceiverLib<ComponentState<TContractState>> {}

    #[embeddable_as(ReceiverExternalImpl)]
    impl ExternalReceiverLib<
        TContractState,
        +HasComponent<TContractState>,
        +admin_lib::HasComponent<TContractState>,
        +SRC5Component::HasComponent<TContractState>,
        +AccessControlComponent::HasComponent<TContractState>,
        +Drop<TContractState>
    > of super::IExternalReceiverLib<ComponentState<TContractState>> {
        fn update_price(
            ref self: ComponentState<TContractState>,
            feed_id: felt252,
            value: u128,
            reported_timestamp: u64,
        ) {
            // For simple initialization flow, allow the first caller to be the switchboard function
            let now = starknet::info::get_block_timestamp();
            self.latest_timestamp.write(now);
            
            // Verify that caller is the switchboard function
            let switchboard_function_address = self.get_function_address();
            if switchboard_function_address.is_zero() {
                self.set_function_address(starknet::get_caller_address());
            }

            // Add feed if it hasn't been set before (first caller is the switchboard function)
            let existing_value: u128 = self.feed_values_map.read(feed_id);
            if existing_value == 0 {
                self.write_feed(feed_id);
            }

            self.feed_map.write(feed_id, Feed { value, timestamp: now, reported_timestamp, feed_id, });
        }

        fn update_prices(
            ref self: ComponentState<TContractState>,
            feed_ids: Array<felt252>,
            values: Array<u128>,
            reported_timestamp: u64,
        ) {

            // Update latest timestamp
            let now = starknet::info::get_block_timestamp();
            self.latest_timestamp.write(now);

            // For simple initialization flow, allow the first caller to be the switchboard function
            let switchboard_function_address = self.get_function_address();
            if switchboard_function_address.is_zero() {
                self.set_function_address(starknet::get_caller_address());
            }

            // Make sure feed ids and values are the same length so there's no mismatch
            let len = feed_ids.len();
            assert(len == values.len(), 'InvalidInputLength');

            // Update individual prices
            let mut i = 0;
            loop {
                if i == len {
                    break;
                }
                let feed_id = *feed_ids.at(i);
                let value = *values.at(i);

                let existing_value: u128 = self.feed_values_map.read(feed_id);
                if existing_value == 0 {
                    self.write_feed(feed_id);
                }

                self.write_price(feed_id, value, reported_timestamp);
                i = i + 1;
            }
        }

        fn get_feeds(self: @ComponentState<TContractState>) -> Array<Feed> {
            let mut feeds: Array<Feed> = array![];
            let mut i = 0;
            loop {
                let id = self.feed_ids.read(i.into());
                if id.is_zero() {
                    break;
                }
                
                let feed: Feed = self.get_feed(id);
                feeds.append(feed);
                i = i + 1;
            };
            feeds
        }

        fn get_feed(self: @ComponentState<TContractState>, feed_id: felt252) -> Feed {
            // Deprecated for now - we don't need to store individual update timestamps
            // self.feed_map.read(feed_id)
            Feed {
                value: self.feed_values_map.read(feed_id),
                timestamp: self.latest_timestamp.read(),
                reported_timestamp: self.latest_timestamp.read(),
                feed_id,
            }
        }

        fn get_latest_result(
            self: @ComponentState<TContractState>,
            feed_id: felt252,
        ) -> (u128, u64) {
            (self.feed_values_map.read(feed_id),  self.latest_timestamp.read())
        }
    }
}
