import { useAccount, useConnect, useDisconnect } from "@starknet-react/core";

const Navbar = () => {
  const { connect, connectors } = useConnect();
  const { address, status, account } = useAccount();
  const { disconnect } = useDisconnect();
  const sliceAddressForView = (addrs) => {
    return `${addrs.slice(0, 6)}...${addrs.slice(-6)}`;
  };
  return (
    <nav className="bg-black p-4 flex justify-between">
      <div className="flex items-center">
        <span className="text-white text-xl font-bold">MarketPlace</span>
      </div>
      <div className="flex items-center ">
        <ul>
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
  );
};

export default Navbar;
