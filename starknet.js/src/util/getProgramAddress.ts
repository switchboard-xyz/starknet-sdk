import type { StarknetNetworkId } from "../types";

import { networks } from "@switchboard-xyz/common";
import _ from "lodash";

export const getProgramAddress = (network: StarknetNetworkId): string => {
  const programAddress = (() => {
    switch (network) {
      case "goerli":
        return networks.starknet.goerli.address;
      case "sepolia":
        return networks.starknet.sepolia.address;
      case "mainnet":
        return networks.starknet.mainnet.address;
      default:
        return undefined;
    }
  })();
  if (programAddress) return programAddress;
  throw new Error(
    _.isUndefined(programAddress)
      ? `No program ID found this network (${network}). Add an override in SwitchboardProgram's constructor.`
      : `Switchboard hasn't been deployed on this network: ${network}`
  );
};
