import { useAccount, useConnect, useDisconnect } from "@starknet-react/core";
import { sliceAddressForView } from "../lib/utils";
import { Link, Outlet } from "react-router-dom";
const Navbar = () => {
  const { connect, connectors } = useConnect();
  const { address, status } = useAccount();
  const { disconnect } = useDisconnect();

  return (
    <>
      <nav className="bg-black p-4 flex justify-between">
        <div className="flex items-center">
          <span className="text-white text-xl font-bold">MarketPlace</span>
        </div>
        <div className="flex items-center ">
          <button className="bg-white text-black px-6 py-2 mx-2 rounded-md">
            <Link to={`uploadandmint`}>UploadAndMint</Link>
          </button>
          <button className="bg-white text-black px-6 py-2 mx-2 rounded-md">
            <Link to={`buynft`}>BuyNFT</Link>
          </button>
          <ul className="flex items-start">
            {status === "disconnected" &&
              connectors.map((connector) => (
                <li key={connector.id}>
                  <button
                    onClick={() => connect({ connector })}
                    className="bg-white text-black px-6 py-2 mx-2 rounded-md"
                  >
                    Connect To {connector.id}
                  </button>
                </li>
              ))}

            {status === "connected" && (
              <button
                className="bg-white text-black px-6 py-2 mx-2 rounded-md"
                onClick={() => disconnect()}
              >
                {sliceAddressForView(address)}
              </button>
            )}
          </ul>
        </div>
      </nav>
      <Outlet />
    </>
  );
};

export default Navbar;
