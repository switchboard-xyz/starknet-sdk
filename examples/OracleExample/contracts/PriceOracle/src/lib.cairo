mod components;

#[starknet::contract]
mod PriceOracle {
    // -- Starknet Dependencies --
    use starknet::class_hash::{ClassHash, ClassHashZeroable};
    use starknet::contract_address::{ContractAddress, ContractAddressZeroable};

    // -- Oracle Dependencies --
    use super::components::admin::admin_lib as admin_lib;
    use super::components::receiver::receiver_lib as receiver_lib;

    // -- OpenZeppelin Dependencies --
    use openzeppelin::access::ownable::OwnableComponent;
    use openzeppelin::upgrades::UpgradeableComponent;
    use openzeppelin::upgrades::interface::IUpgradeable;
    use openzeppelin::access::accesscontrol::AccessControlComponent;
    use openzeppelin::access::accesscontrol::DEFAULT_ADMIN_ROLE;
    use openzeppelin::introspection::src5::SRC5Component;

    // -- OpenZeppelin Access Control Roles --
    const ADMIN_ROLE: felt252 = selector!("ADMIN_ROLE");
    const USER_ROLE: felt252 = selector!("USER_ROLE");

    // -- Oracle Components -- 
    component!(path: admin_lib, storage: admin_lib, event: AdminLibEvent);
    component!(path: receiver_lib, storage: receiver_lib, event: ReceiverLibEvent);

    // -- OpenZeppelin Components --
    component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);
    component!(path: UpgradeableComponent, storage: upgradeable, event: UpgradeableEvent);
    component!(path: AccessControlComponent, storage: accesscontrol, event: AccessControlEvent);
    component!(path: SRC5Component, storage: src5, event: SRC5Event);


    // ╔═════════════════════════════════════════════╗
    // ║  TRAITS                                     ║
    // ╚═════════════════════════════════════════════╝

    // -- OpenZeppelin --
    #[abi(embed_v0)]
    impl OwnableImpl = OwnableComponent::OwnableImpl<ContractState>;
    impl OwnableInternalImpl = OwnableComponent::InternalImpl<ContractState>;
    impl UpgradeableInternalImpl = UpgradeableComponent::InternalImpl<ContractState>;
    #[abi(embed_v0)]
    impl AccessControlImpl =
        AccessControlComponent::AccessControlImpl<ContractState>;
    impl AccessControlInternalImpl = AccessControlComponent::InternalImpl<ContractState>;

    // -- Oracle --
    impl AdminLib = admin_lib::AdminLib<ContractState>;
    #[abi(embed_v0)]
    impl AdminLibExternal = admin_lib::AdminExternalImpl<ContractState>;
    #[abi(embed_v0)]
    impl ReceiverImpl = receiver_lib::ReceiverExternalImpl<ContractState>;


    // ╔═════════════════════════════════════════════╗
    // ║  EVENTS                                     ║
    // ╚═════════════════════════════════════════════╝

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        AdminLibEvent: admin_lib::Event,
        ReceiverLibEvent: receiver_lib::Event,
        // -- OpenZeppelin --
        #[flat]
        OwnableEvent: OwnableComponent::Event,
        #[flat]
        UpgradeableEvent: UpgradeableComponent::Event,
        #[flat]
        AccessControlEvent: AccessControlComponent::Event,
        #[flat]
        SRC5Event: SRC5Component::Event,
    }

    // ╔═════════════════════════════════════════════╗
    // ║  STORAGE                                    ║
    // ╚═════════════════════════════════════════════╝

    #[storage]
    struct Storage {
        #[substorage(v0)]
        ownable: OwnableComponent::Storage,
        #[substorage(v0)]
        upgradeable: UpgradeableComponent::Storage,
        #[substorage(v0)]
        accesscontrol: AccessControlComponent::Storage,
        #[substorage(v0)]
        src5: SRC5Component::Storage,
        #[substorage(v0)]
        admin_lib: admin_lib::Storage,
        #[substorage(v0)]
        receiver_lib: receiver_lib::Storage,
    }

    // ╔═════════════════════════════════════════════╗
    // ║  CONSTRUCTOR                                ║
    // ╚═════════════════════════════════════════════╝

    #[constructor]
    fn constructor(ref self: ContractState, owner: ContractAddress) {
        self.ownable.initializer(owner);
        self.accesscontrol.initializer();
        self.accesscontrol._grant_role(DEFAULT_ADMIN_ROLE, owner);
        self.accesscontrol._grant_role(ADMIN_ROLE, owner);
    }

    // ╔═════════════════════════════════════════════╗
    // ║  UPGRADES                                   ║
    // ╚═════════════════════════════════════════════╝

    #[external(v0)]
    impl UpgradeableImpl of IUpgradeable<ContractState> {
        fn upgrade(ref self: ContractState, new_class_hash: ClassHash) {
            self.ownable.assert_only_owner();
            self.upgradeable._upgrade(new_class_hash);
        }
    }
}
