use starknet::ContractAddress;
#[starknet::interface]
trait IERC721<T> {
    // NFT Metadata
    fn name(self: @T) -> felt252;
    fn symbol(self: @T) -> felt252;
    fn token_uri(self: @T, token_id: u256) -> felt252;
// fn balance_of(self: @T, account: ContractAddress) -> u256;
// fn owner_of(self: @T, token_id: u256) -> ContractAddress;
// fn transfer_from(ref self: T, from: ContractAddress, to: ContractAddress, token_id: u256);
}

#[starknet::contract]
mod ERC721 {
    use super::{ContractAddress, IERC721};

    #[storage]
    struct Storage {
        ERC721_name: felt252,
        ERC721_symbol: felt252,
        ERC721_owners: LegacyMap<u256, ContractAddress>,
        ERC721_balances: LegacyMap<ContractAddress, u256>,
        ERC721_token_uri: LegacyMap<u256, felt252>
    }

    #[external(v0)]
    impl ExternalImplERC721 of IERC721<ContractState> {
        fn name(self: @ContractState) -> felt252 {
            self.ERC721_name.read()
        }

        fn symbol(self: @ContractState) -> felt252 {
            self.ERC721_symbol.read()
        }

        fn token_uri(self: @ContractState, token_id: u256) -> felt252 {
            //todo: do the token uri assert
            self.ERC721_token_uri.read(token_id)
        }
    }
}

