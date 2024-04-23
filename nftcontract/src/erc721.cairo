use starknet::ContractAddress;
#[starknet::interface]
trait IERC721<T> {
    fn name(self: @T) -> felt252;
    fn symbol(self: @T) -> felt252;
    fn token_uri(self: @T, token_id: u256) -> felt252;
    fn balance_of(self: @T, account: ContractAddress) -> u256;
    fn owner_of(self: @T, token_id: u256) -> ContractAddress;
    fn get_counter_id(self: @T) -> u256;
    fn allowed_erc20_address(self: @T) -> ContractAddress;
    fn price_of_token_id(self: @T, token_id: u256) -> u256;
    fn token_title(self: @T, token_id: u256) -> felt252;
    fn upload_and_mint(ref self: T, metadata_uri: felt252, price: u256, token_name: felt252);
    fn buy_nft(ref self: T, token_id: u256, amount: u256);
}

#[starknet::interface]
trait IERC20<TState> {
    fn balance_of(self: @TState, account: ContractAddress) -> u256;
    fn transfer_from(
        ref self: TState, sender: ContractAddress, recipient: ContractAddress, amount: u256
    ) -> bool;
}

#[starknet::contract]
mod ERC721 {
    use core::zeroable::Zeroable;
    use super::{ContractAddress, IERC721, IERC20, IERC20Dispatcher, IERC20DispatcherTrait};
    use starknet::{get_caller_address, get_contract_address};

    #[storage]
    struct Storage {
        ERC721_name: felt252,
        ERC721_symbol: felt252,
        ERC721_owners: LegacyMap<u256, ContractAddress>,
        ERC721_balances: LegacyMap<ContractAddress, u256>,
        ERC721_token_uri: LegacyMap<u256, felt252>,
        ERC721_token_prices: LegacyMap<u256, u256>,
        ERC721_token_name: LegacyMap<u256, felt252>,
        ERC721_id_counter: u256,
        ERC721_token_uri_flag: LegacyMap<felt252, bool>,
        ERC20_token_contract: ContractAddress
    }

    #[constructor]
    fn constructor(
        ref self: ContractState,
        name: felt252,
        symbol: felt252,
        erc20_token_contract: ContractAddress
    ) {
        self.ERC721_name.write(name);
        self.ERC721_symbol.write(symbol);
        self.ERC20_token_contract.write(erc20_token_contract);
        self.ERC721_id_counter.write(1);
    }

    #[abi(embed_v0)]
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

        fn token_title(self: @ContractState, token_id: u256) -> felt252 {
            self.ERC721_token_name.read(token_id)
        }

        fn get_counter_id(self: @ContractState) -> u256 {
            self.ERC721_id_counter.read()
        }

        fn allowed_erc20_address(self: @ContractState) -> ContractAddress {
            self.ERC20_token_contract.read()
        }

        fn price_of_token_id(self: @ContractState, token_id: u256) -> u256 {
            self.ERC721_token_prices.read(token_id)
        }

        fn upload_and_mint(
            ref self: ContractState, metadata_uri: felt252, price: u256, token_name: felt252
        ) {
            assert(!price.is_zero(), 'ZERO_PRICE');
            assert(
                !self.ERC721_token_uri_flag.read(metadata_uri), 'METADATA_URI_ALREADY_SUBMITTED'
            );
            let caller: ContractAddress = get_caller_address();
            self._upload_and_mint(caller, metadata_uri, price, token_name);
        }

        fn buy_nft(ref self: ContractState, token_id: u256, amount: u256) {
            assert(self._exists(token_id), 'INVALID_TOKEN_ID');
            assert(amount == self.ERC721_token_prices.read(token_id), 'INSUFFICIENT_FUNDS');
            let caller: ContractAddress = get_caller_address();
            assert(!caller.is_zero(), 'INVALID_CALLER');
            let caller_current_balance: u256 = self
                ._check_erc20_balance(self.ERC20_token_contract.read(), caller);
            assert(caller_current_balance >= amount, 'INSUFFICIENT_ERC20_BALANCE');
            self._buy_nft(caller, token_id, amount);
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

        fn _mint(ref self: ContractState, to: ContractAddress, token_id: u256) {
            assert(!to.is_zero(), 'INVALID_RECEIVER');
            assert(!self._exists(token_id), 'ALREADY_MINTED');

            self.ERC721_balances.write(to, self.ERC721_balances.read(to) + 1);
            self.ERC721_owners.write(token_id, to);
        }

        fn _burn(ref self: ContractState, token_id: u256) {
            let owner = self._owner_of(token_id);

            self.ERC721_balances.write(owner, self.ERC721_balances.read(owner) - 1);
            self.ERC721_owners.write(token_id, Zeroable::zero());
        }

        fn _current_counter(self: @ContractState) -> u256 {
            self.ERC721_id_counter.read()
        }

        fn _upload_and_mint(
            ref self: ContractState,
            owner: ContractAddress,
            metadata_uri: felt252,
            price: u256,
            token_name: felt252
        ) {
            let current_token_id = self._current_counter();
            self._mint(owner, current_token_id);
            self.ERC721_token_prices.write(current_token_id, price);
            self.ERC721_token_uri.write(current_token_id, metadata_uri);
            self.ERC721_token_name.write(current_token_id, token_name);
            self.ERC721_token_uri_flag.write(metadata_uri, true);
            self.ERC721_id_counter.write(current_token_id + 1);
        }

        fn _buy_nft(
            ref self: ContractState, caller: ContractAddress, token_id: u256, amount: u256
        ) {
            let owner_or_seller = self.ERC721_owners.read(token_id);
            self
                ._do_erc20_transfer(
                    self.ERC20_token_contract.read(), caller, owner_or_seller, amount
                );
            self._transfer(owner_or_seller, caller, token_id);
        }

        fn _check_erc20_balance(
            ref self: ContractState,
            erc20_contract_address: ContractAddress,
            user_address: ContractAddress
        ) -> u256 {
            let current_balance: u256 = IERC20Dispatcher {
                contract_address: erc20_contract_address
            }
                .balance_of(user_address);
            current_balance
        }

        fn _do_erc20_transfer(
            ref self: ContractState,
            contract_address: ContractAddress,
            from: ContractAddress,
            to: ContractAddress,
            amount: u256
        ) {
            let amount_u256: u256 = amount.into();
            let transfer_return_flag = IERC20Dispatcher { contract_address: contract_address }
                .transfer_from(from, to, amount_u256);
            assert(transfer_return_flag, 'NFT_BUY_FAIL_ERC20_TRANSFER');
        }
    }
}
