import React from "react";
import ReactDOM from "react-dom/client";
import { mainnet, goerli, sepolia } from "@starknet-react/chains";
import {
  StarknetConfig,
  publicProvider,
  argent,
  braavos,
  voyager,
} from "@starknet-react/core";
import App from "./App.jsx";
import "./index.css";

const connectors = [argent(), braavos()];
ReactDOM.createRoot(document.getElementById("root")).render(
  <StarknetConfig
    connectors={connectors}
    provider={publicProvider()}
    explorer={voyager}
    chains={[mainnet, goerli, sepolia]}
  >
    <App />
  </StarknetConfig>,
);
