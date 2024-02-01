use starknet::ContractAddress;
#[starknet::interface]
trait IERC721<T> {
    // NFT Metadata
    fn name(self: @T) -> felt252;
    fn symbol(self: @T) -> felt252;
    fn token_uri(self: @T, token_id: u256) -> felt252;
    fn balance_of(self: @T, account: ContractAddress) -> u256;
    fn owner_of(self: @T, token_id: u256) -> ContractAddress;
    fn transfer_from(ref self: T, from: ContractAddress, to: ContractAddress, token_id: u256);
}

#[starknet::contract]
mod ERC721 {
    use core::zeroable::Zeroable;
    use super::{ContractAddress, IERC721};

    #[storage]
    struct Storage {
        ERC721_name: felt252,
        ERC721_symbol: felt252,
        ERC721_owners: LegacyMap<u256, ContractAddress>,
        ERC721_balances: LegacyMap<ContractAddress, u256>,
        ERC721_token_uri: LegacyMap<u256, felt252>
    }

    #[constructor]
    fn constructor(ref self: ContractState, name: felt252, symbol: felt252) {
        self.ERC721_name.write(name);
        self.ERC721_symbol.write(symbol);
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
            assert(self._exists(token_id), 'INVALID_TOKEN_ID');
            self.ERC721_token_uri.read(token_id)
        }

        fn balance_of(self: @ContractState, account: ContractAddress) -> u256 {
            assert(!account.is_zero(), 'INVALID_ACCOUNT');
            self.ERC721_balances.read(account)
        }

        fn owner_of(self: @ContractState, token_id: u256) -> ContractAddress {
            self._owner_of(token_id)
        }
        fn transfer_from(
            ref self: ContractState, from: ContractAddress, to: ContractAddress, token_id: u256
        ) {
            self._transfer(from, to, token_id);
        }
    }

    #[generate_trait]
    impl InternalImpl of InternalTrait {
        fn _owner_of(self: @ContractState, token_id: u256) -> ContractAddress {
            let owner = self.ERC721_owners.read(token_id);
            match owner.is_zero() {
                bool::False(()) => owner,
                bool::True(()) => panic(array!['INVALID_TOKEN_ID'])
            }
        }

        fn _exists(self: @ContractState, token_id: u256) -> bool {
            !self.ERC721_owners.read(token_id).is_zero()
        }

        fn _transfer(
            ref self: ContractState, from: ContractAddress, to: ContractAddress, token_id: u256
        ) {
            assert(!to.is_zero(), 'INVALID_RECEIVER');
            let owner = self._owner_of(token_id);
            assert(from == owner, 'WRONG_SENDER');

            self.ERC721_balances.write(from, self.ERC721_balances.read(from) - 1);
            self.ERC721_balances.write(to, self.ERC721_balances.read(to) + 1);
            self.ERC721_owners.write(token_id, to);
        }
    }
}

