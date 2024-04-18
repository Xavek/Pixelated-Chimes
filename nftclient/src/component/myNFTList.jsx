import { useAccount } from "@starknet-react/core";
import { sliceAddressForView } from "../lib/utils";
import { fetchNFTData } from "../lib/erc721BuyList";
import { erc721ManagerInstance } from "../lib/erc721Manager";
import { useEffect, useState } from "react";
const NFTCard = ({ tokenId, image, text, amount, ownerAddress }) => {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg m-4">
      <img className="w-full" src={image} alt="Product" />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{text}</div>
        <p className="text-gray-700 text-base">Amount: {amount} eth</p>
        <p className="text-gray-700 text-base">
          {`Owner: ${sliceAddressForView(ownerAddress)}`}
        </p>
      </div>
      <div className="px-6 py-4"></div>
    </div>
  );
};

const MyNFTList = () => {
  const { status, account } = useAccount();
  const [NFTData, setNFTData] = useState([]);
  useEffect(() => {
    const fetchNFTLists = async () => {
      if (status === "connected") {
        const nftData = await fetchNFTData(erc721ManagerInstance);
        const connectedAddressNFTList = nftData.filter(
          (product) => product.ownerAddress === account.address,
        );
        setNFTData(connectedAddressNFTList);
      }
    };
    fetchNFTLists();
  }, [status === "connected"]);
  return (
    <div className="flex justify-center">
      {NFTData.length > 0
        ? NFTData.map((product) => (
            <NFTCard
              key={product.tokenId}
              tokenId={product.tokenId}
              image={product.tokenUri}
              text={product.tokenName}
              amount={product.amount}
              ownerAddress={product.ownerAddress}
            />
          ))
        : "You Have No NFTs. Either Buy Or Upload"}
    </div>
  );
};

export default MyNFTList;
