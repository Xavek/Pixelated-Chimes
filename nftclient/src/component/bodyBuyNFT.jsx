import { useAccount } from "@starknet-react/core";
import { buyNFT, doERC20Approve } from "../lib/erc721Api";
import { ethers } from "ethers";
import { erc721ManagerInstance } from "../lib/erc721Manager";
import {
  DEPLOYED_CONTRACT_ADDRESS,
  ERC20_ADDRESS,
  sliceAddressForView,
} from "../lib/utils";

const NFTCard = ({ tokenId, image, text, amount, ownerAddress }) => {
  const { status, account } = useAccount();
  const handleBuyClick = async () => {
    if (status === "disconnected") {
      alert(`Connect To Wallet. Disconnected atm`);
      throw Error(`Must be connected to Wallet`);
    }
    try {
      console.log(`Buying ${tokenId} for ${amount}`);

      await doERC20Approve(
        erc721ManagerInstance,
        account,
        ethers.parseEther(amount),
        ERC20_ADDRESS,
        DEPLOYED_CONTRACT_ADDRESS,
      );
      await buyNFT(
        erc721ManagerInstance,
        account,
        tokenId,
        ethers.parseEther(amount),
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg m-4">
      <img className="w-full" src={image} alt="Product" />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{text}</div>
        <p className="text-gray-700 text-base">{amount} eth</p>
        <p className="text-gray-700 text-base">
          {sliceAddressForView(ownerAddress)}
        </p>
      </div>
      <div className="px-6 py-4">
        <button
          className="bg-black text-white px-4 py-2 rounded-md w-full"
          onClick={handleBuyClick}
        >
          Buy
        </button>
      </div>
    </div>
  );
};

const NFTList = (props) => {
  return (
    <div className="flex justify-center">
      {props.NFTData.map((product) => (
        <NFTCard
          key={product.tokenId}
          tokenId={product.tokenId}
          image={product.tokenUri}
          text={product.tokenName}
          amount={product.amount}
          ownerAddress={product.ownerAddress}
        />
      ))}
    </div>
  );
};

export default NFTList;
