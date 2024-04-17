import React from "react";
import ReactDOM from "react-dom/client";
import { mainnet, goerli, sepolia } from "@starknet-react/chains";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {
  StarknetConfig,
  publicProvider,
  argent,
  braavos,
  voyager,
} from "@starknet-react/core";
import App from "./App.jsx";
import "./index.css";
import UploadForm from "./component/bodyUploadAndMint.jsx";
import NFTList from "./component/bodyBuyNFT.jsx";
import { fetchNFTData } from "./lib/erc721BuyList.js";
import { erc721ManagerInstance } from "./lib/erc721Manager.js";

const NFTData = await fetchNFTData(erc721ManagerInstance);
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "uploadandmint",
        element: <UploadForm />,
      },
      {
        path: "buynft",
        element: <NFTList NFTData={NFTData} />,
      },
    ],
  },
]);

const connectors = [argent(), braavos()];
ReactDOM.createRoot(document.getElementById("root")).render(
  <StarknetConfig
    connectors={connectors}
    provider={publicProvider()}
    explorer={voyager}
    chains={[sepolia]}
  >
    <RouterProvider router={router} />
  </StarknetConfig>,
);
