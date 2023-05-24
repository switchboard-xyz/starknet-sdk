/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  ISwitchboard,
  ISwitchboardInterface,
} from "../../../../../contracts/src/Switchboard/interfaces/ISwitchboard";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "authority",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "accountAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "AggregatorAccountInit",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "aggregatorAddress",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "funder",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "AggregatorFundEvent",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "aggregatorAddress",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "intervalId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "balanceLeftForInterval",
        type: "uint256",
      },
    ],
    name: "AggregatorIntervalRefreshed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "aggregatorAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "varianceThreshold",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "minJobResults",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "forceReportPeriod",
        type: "uint256",
      },
    ],
    name: "AggregatorResponseSettingsUpdate",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "aggregatorAddress",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "oracle",
        type: "address",
      },
      {
        indexed: true,
        internalType: "int256",
        name: "value",
        type: "int256",
      },
    ],
    name: "AggregatorSaveResult",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "aggregatorAddress",
        type: "address",
      },
      {
        indexed: true,
        internalType: "int256",
        name: "value",
        type: "int256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "AggregatorUpdate",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "authority",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "accountAddress",
        type: "address",
      },
    ],
    name: "OracleAccountInit",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "oracleAddress",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "aggregatorAddress",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "OraclePayoutEvent",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "authority",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "accountAddress",
        type: "address",
      },
    ],
    name: "OracleQueueAccountInit",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "aggregatorId",
        type: "address",
      },
    ],
    name: "getCurrentIntervalId",
    outputs: [
      {
        internalType: "uint80",
        name: "",
        type: "uint80",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "aggregatorId",
        type: "address",
      },
      {
        internalType: "uint80",
        name: "round",
        type: "uint80",
      },
    ],
    name: "getIntervalResult",
    outputs: [
      {
        internalType: "int256",
        name: "value",
        type: "int256",
      },
      {
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "medianTimestamp",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "aggregatorId",
        type: "address",
      },
    ],
    name: "latestResult",
    outputs: [
      {
        internalType: "int256",
        name: "value",
        type: "int256",
      },
      {
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
] as const;

export class ISwitchboard__factory {
  static readonly abi = _abi;
  static createInterface(): ISwitchboardInterface {
    return new utils.Interface(_abi) as ISwitchboardInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ISwitchboard {
    return new Contract(address, _abi, signerOrProvider) as ISwitchboard;
  }
}
