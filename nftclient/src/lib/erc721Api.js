// Write Methods
export const doERC20Approve = async (
  ERC721Manager,
  account,
  amount,
  contractAddress,
) => {};
export const buyNFT = async (ERC721Manager, account, tokenId, amount) => {
  const contractInvokeData = [tokenId, amount];
  const contractResponse = await ERC721Manager.invokeContractFunction(
    account,
    "buy_nft",
    contractInvokeData,
  );
  console.log(contractResponse);
};

export const uploadNFT = async (
  ERC721Manager,
  account,
  nftName,
  tokenURI,
  amount,
) => {
  const contractInvokeData = [tokenURI, amount, nftName];
  const contractResponse = await ERC721Manager.invokeContractFunction(
    account,
    "upload_and_mint",
    contractInvokeData,
  );
  console.log(contractResponse);
};

// Read Methods

export const priceOfNFT = async (ERC721Manager, tokenId) => {
  const contractInvokeData = [tokenId];
  const contractResponse = await ERC721Manager.readContractFunction(
    "price_of_token_id",
    contractInvokeData,
  );
  return contractResponse;
};

export const ownerOfNFT = async (ERC721Manager, tokenId) => {
  const contractInvokeData = [tokenId];
  const contractResponse = await ERC721Manager.readContractFunction(
    "owner_of",
    contractInvokeData,
  );
  return contractResponse;
};

export const titleOfNFT = async (ERC721Manager, tokenId) => {
  const contractInvokeData = [tokenId];
  const contractResponse = await ERC721Manager.readContractFunction(
    "token_title",
    contractInvokeData,
  );
  return contractResponse;
};
