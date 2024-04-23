# Pixelated Chimes

A minimal NFT marketplace on Starknet. This repo consists of `contracts` written in Cairo and integrated user interface `client`. To be used for tutorial. User could upload and mint the NFT and can Buy with Sepolia ETH

# Repo Navigation

## Contracts

Requires [Scarb](https://docs.swmansion.com/scarb/download.html) on machine.

- Clone the repo
- `cd pixelated-chimes`
- `cd nftcontract`
  - Inside `src` folder there is `erc721.cairo` and `lib.cairo`
  - Optional: Edit, change few things, try to add new methods
- `scarb build` to test the build

## Client

Requires [pnpm](https://pnpm.io/installation) on machine.

- `cd pixelated-chimes`
- `cd nftclient`
- `pnpm install`
- `pnpm dev` and visit the relevant local host for interaction
  - Edit the `utils.js` with your deployed address to interact with your contract

#### Contract Used and Deployed(Sepolia): 0x0308445897818779e5aa3b9f3eeb7078c0a5aa4c6376ad7735a9be5e89b93d2c
