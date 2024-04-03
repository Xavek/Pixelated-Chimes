// Constant
const key = import.meta.env.VITE_APP_URL_KEY;
export const NODE_URL_API = `https://base-url/${key}`;
export const DEPLOYED_CONTRACT_ADDRESS = "";
export const ERC20_ADDRESS = "";

// utils
export const sliceAddressForView = (addrs) => {
  return `${addrs.slice(0, 6)}...${addrs.slice(-6)}`;
};

export const validateTokenUri = (tokenUriStr) => {
  return tokenUriStr.length <= 31 ? true : false;
};
