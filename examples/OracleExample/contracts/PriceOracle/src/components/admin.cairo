#[starknet::interface]
trait IAdminLib<State> {
    fn assert_admin(self: @State);
    fn get_function_address_internal(self: @State) -> starknet::ContractAddress;
    fn set_function_address_internal(ref self: State, function_address: starknet::ContractAddress,);
}

#[starknet::interface]
trait IExternalAdminLib<TContractState> {
    fn set_function_address(ref self: TContractState, function_address: starknet::ContractAddress);
    fn get_function_address(self: @TContractState) -> starknet::ContractAddress;
}

#[starknet::component]
mod admin_lib {
    // -- OpenZeppelin imports --
    use openzeppelin::access::accesscontrol::AccessControlComponent::InternalTrait;
    use openzeppelin::access::accesscontrol::AccessControlComponent::InternalImpl;
    use openzeppelin::access::accesscontrol::AccessControlComponent::AccessControl;
    use openzeppelin::access::accesscontrol::AccessControlComponent;
    use openzeppelin::introspection::src5::SRC5Component;

    // -- Starknet imports --
    use core::option::OptionTrait;

    // --  OpenZeppelin Access Control Roles --
    const ADMIN_ROLE: felt252 = selector!("ADMIN_ROLE");
    const USER_ROLE: felt252 = selector!("USER_ROLE");


    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        InitializeContract: InitializeContract,
    }


    #[derive(Drop, starknet::Event)]
    struct InitializeContract {
        #[key]
        function_address: starknet::ContractAddress,
    }

    #[storage]
    struct Storage {
        function_address: starknet::ContractAddress,
    }

    // For now we need to provie a helper to access UtilLib. In the future, helpers will be generated
    // to help components access their dependencies.
    #[generate_trait]
    impl Dependencies<
        TContractState,
        +HasComponent<TContractState>,
        +SRC5Component::HasComponent<TContractState>,
        +AccessControlComponent::HasComponent<TContractState>,
        +Drop<TContractState>
    > of DependenciesTrait<TContractState> {
        fn access_control(
            self: @ComponentState<TContractState>
        ) -> @AccessControlComponent::ComponentState<TContractState> {
            let contract = self.get_contract();
            AccessControlComponent::HasComponent::get_component(contract)
        }

        fn is_admin(
            self: @ComponentState<TContractState>, user: starknet::ContractAddress,
        ) -> bool {
            let access_control = self.access_control();
            access_control.has_role(ADMIN_ROLE, user)
        }
    }

    impl AdminLib<
        TContractState,
        +HasComponent<TContractState>,
        +SRC5Component::HasComponent<TContractState>,
        +AccessControlComponent::HasComponent<TContractState>,
        +Drop<TContractState>
    > of super::IAdminLib<ComponentState<TContractState>> {
        fn assert_admin(self: @ComponentState<TContractState>) {
            assert(self.is_admin(starknet::get_caller_address()), 'ACLNotAdmin');
        }

        fn get_function_address_internal(self: @ComponentState<TContractState>) -> starknet::ContractAddress {
            self.function_address.read()
        }

        fn set_function_address_internal(
            ref self: ComponentState<TContractState>, function_address: starknet::ContractAddress,
        ) {
            self.function_address.write(function_address);
        }
    }


    #[embeddable_as(AdminExternalImpl)]
    impl ExternalAdminLib<
        TContractState,
        +HasComponent<TContractState>,
        +SRC5Component::HasComponent<TContractState>,
        +AccessControlComponent::HasComponent<TContractState>,
        +Drop<TContractState>
    > of super::IExternalAdminLib<ComponentState<TContractState>> {
        fn set_function_address(
            ref self: ComponentState<TContractState>, function_address: starknet::ContractAddress
        ) {
            self.assert_admin();
            self.function_address.write(function_address);
        }
        fn get_function_address(
            self: @ComponentState<TContractState>
        ) -> starknet::ContractAddress {
            self.function_address.read()
        }
    }
}
