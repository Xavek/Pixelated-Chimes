import {
  nftTokenCounterId,
  titleOfNFT,
  ownerOfNFT,
  priceOfNFT,
  nftTokenURI,
} from "./erc721Api";
import { shortString } from "starknet";
import { ethers } from "ethers";
const NFTDefaultData = [
  {
    tokenId: 9,
    tokenUri: "https://via.placeholder.com/300",
    tokenName: "First Upload And Mint Or Buy",
    amount: "0.01",
    ownerAddress:
      "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
  },
  {
    tokenId: 6,
    tokenUri: "https://via.placeholder.com/300",
    tokenName: "First Upload And Mint Or Buy",
    amount: "0.02",
    ownerAddress:
      "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
  },
  {
    tokenId: 5,
    tokenUri: "https://via.placeholder.com/300",
    tokenName: "First Upload And Mint Or Buy",
    amount: "0.1",
    ownerAddress:
      "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
  },
];

export const fetchNFTData = async (erc721ManagerInstance) => {
  const counterIDe = await nftTokenCounterId(erc721ManagerInstance);
  const counterId = Number(counterIDe) - 1;
  if (counterId >= 1) {
    const arrOfObj = [];
    for (let i = 1; i <= counterId; i++) {
      const tokenTitle = await titleOfNFT(erc721ManagerInstance, counterId);
      const tokenOwner = await ownerOfNFT(erc721ManagerInstance, counterId);
      const tokenPrice = await priceOfNFT(erc721ManagerInstance, counterId);
      const tokenUri = await nftTokenURI(erc721ManagerInstance, counterId);
      const tokenDataObj = {
        tokenId: counterId,
        tokenName: shortString.decodeShortString(tokenTitle),
        amount: ethers.formatEther(tokenPrice),
        ownerAddress: `0x${tokenOwner.toString(16)}`,
        tokenUri: shortString.decodeShortString(tokenUri),
      };
      console.log(tokenDataObj);
      arrOfObj.push(tokenDataObj);
    }
    return arrOfObj;
  } else {
    return NFTDefaultData;
  }
};
