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
        element: <NFTList />,
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
    chains={[mainnet, goerli, sepolia]}
  >
    <RouterProvider router={router} />
  </StarknetConfig>,
);
