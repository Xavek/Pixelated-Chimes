// Constant
// free rpc from nethermind no api key needed
export const NODE_URL_API = "https://free-rpc.nethermind.io/sepolia-juno";

export const DEPLOYED_CONTRACT_ADDRESS =
  "0x06d9c782805710f312e64700b22407e6a1c9a118d18ccaa8d92304ea21edba53";
export const ERC20_ADDRESS =
  "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7";

// utils
export const sliceAddressForView = (addrs) => {
  return `${addrs.slice(0, 6)}...${addrs.slice(-6)}`;
};

export const validateTokenUri = (tokenUriStr) => {
  return tokenUriStr.length <= 31 ? true : false;
};
