import { getPriorityConnector } from "@web3-react/core";
import { Connector } from "@web3-react/types";

import metaMask, { isMetaMask } from "./metaMask";

export function getConnectorName(connector) {
  if (isMetaMask(connector)) {
    return "MetaMask";
  } else {
    throw new Error("Unknown Connector");
  }
}

export const connectors = [metaMask];

export function useActiveProvider() {
  return getPriorityConnector(connectors[0]).usePriorityProvider();
}
