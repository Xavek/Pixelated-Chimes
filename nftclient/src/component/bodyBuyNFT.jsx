import { useAccount } from "@starknet-react/core";
import { buyNFT, ownerOfNFT, priceOfNFT, titleOfNFT } from "../lib/erc721Api";
import { erc721ManagerInstance } from "../lib/erc721Manager";
import { sliceAddressForView } from "../lib/utils";
const NFTMock = [
  {
    tokenId: 9,
    tokenUri: "https://via.placeholder.com/200",
    tokenName: "Product 1",
    amount: "0.01",
    ownerAddress:
      "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
  },
  {
    tokenId: 6,
    tokenUri: "https://via.placeholder.com/200",
    tokenName: "Product 2",
    amount: "0.02",
    ownerAddress:
      "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
  },
  {
    tokenId: 5,
    tokenUri: "https://via.placeholder.com/200",
    tokenName: "Product 3",
    amount: "0.1",
    ownerAddress:
      "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
  },
];

const NFTCard = ({ tokenId, image, text, amount, ownerAddress }) => {
  const { status, account } = useAccount();
  const handleBuyClick = async () => {
    if (status === "disconnected") {
      alert(`Connect To Wallet. Disconnected atm`);
      throw Error(`Must be connected to Wallet`);
    }
    //todo: need to transform the data of return?
    // todo: change into promise.all with transform ?
    const tokenTitle = await titleOfNFT(erc721ManagerInstance, 1);
    console.log(tokenTitle);
    const tokenOwner = await ownerOfNFT(erc721ManagerInstance, 1);
    console.log(tokenOwner);
    const tokenPrice = await priceOfNFT(erc721ManagerInstance, 1);
    console.log(tokenPrice);

    await buyNFT(erc721ManagerInstance, account, tokenId, amount);
    console.log(`Buying ${tokenId} for ${amount}`);
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

const NFTList = () => {
  return (
    <div className="flex justify-center">
      {NFTMock.map((product) => (
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
