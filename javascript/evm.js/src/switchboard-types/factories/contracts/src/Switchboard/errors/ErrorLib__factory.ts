/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../../common";
import type {
  ErrorLib,
  ErrorLibInterface,
} from "../../../../../contracts/src/Switchboard/errors/ErrorLib";

const _abi = [
  {
    inputs: [],
    name: "ACLAdminAlreadyInitialized",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "ACLNotAdmin",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "ACLNotAllowed",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "aggregatorId",
        type: "address",
      },
    ],
    name: "AggregatorAlreadyExists",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "aggregatorId",
        type: "address",
      },
    ],
    name: "AggregatorDoesNotExist",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "txHash",
        type: "bytes32",
      },
    ],
    name: "AlreadyExecuted",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "attestationQueueId",
        type: "address",
      },
    ],
    name: "AttestationQueueAlreadyExists",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "attestationQueueId",
        type: "address",
      },
    ],
    name: "AttestationQueueDoesNotExist",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "oracleId",
        type: "address",
      },
    ],
    name: "EarlyOracleResponse",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "enclaveId",
        type: "address",
      },
    ],
    name: "EnclaveAlreadyExists",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "enclaveId",
        type: "address",
      },
    ],
    name: "EnclaveDoesNotExist",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "enclaveId",
        type: "address",
      },
    ],
    name: "EnclaveExpired",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "queueId",
        type: "address",
      },
      {
        internalType: "address",
        name: "enclaveId",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "enclaveIdx",
        type: "uint256",
      },
    ],
    name: "EnclaveNotAtQueueIdx",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "queueId",
        type: "address",
      },
      {
        internalType: "address",
        name: "enclaveId",
        type: "address",
      },
    ],
    name: "EnclaveNotOnQueue",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "enclaveId",
        type: "address",
      },
    ],
    name: "EnclaveNotReadyForVerification",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "enclaveId",
        type: "address",
      },
    ],
    name: "EnclaveUnverified",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "gasLimit",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "gasSpent",
        type: "uint256",
      },
    ],
    name: "ExcessiveGasSpent",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "queueId",
        type: "address",
      },
    ],
    name: "ForceOverrideNotReady",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "functionId",
        type: "address",
      },
    ],
    name: "FunctionAlreadyExists",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "functionId",
        type: "address",
      },
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "FunctionCallerNotPermitted",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "functionId",
        type: "address",
      },
    ],
    name: "FunctionDoesNotExist",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "functionId",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "expected",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "received",
        type: "uint256",
      },
    ],
    name: "FunctionFeeTooLow",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "functionId",
        type: "address",
      },
      {
        internalType: "address",
        name: "received",
        type: "address",
      },
    ],
    name: "FunctionIncorrectTarget",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "expected",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "received",
        type: "bytes32",
      },
    ],
    name: "FunctionMrEnclaveMismatch",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "current",
        type: "address",
      },
      {
        internalType: "address",
        name: "received",
        type: "address",
      },
    ],
    name: "FunctionSignerAlreadySet",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "limit",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "used",
        type: "uint256",
      },
    ],
    name: "GasLimitExceeded",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "maxExpectedTime",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "reportedTime",
        type: "uint256",
      },
    ],
    name: "IncorrectReportedTime",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "expectedBalance",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "receivedBalance",
        type: "uint256",
      },
    ],
    name: "InsufficientBalance",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "expected",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "received",
        type: "uint256",
      },
    ],
    name: "InsufficientNodes",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "expected",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "received",
        type: "uint256",
      },
    ],
    name: "InsufficientSamples",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "aggregatorId",
        type: "address",
      },
    ],
    name: "IntervalHistoryNotRecorded",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "argumentIndex",
        type: "uint256",
      },
    ],
    name: "InvalidArgument",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "expectedAuthority",
        type: "address",
      },
      {
        internalType: "address",
        name: "receivedAuthority",
        type: "address",
      },
    ],
    name: "InvalidAuthority",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "enclaveId",
        type: "address",
      },
    ],
    name: "InvalidEnclave",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidEntry",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "expectedSender",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "txHash",
        type: "bytes32",
      },
      {
        internalType: "bytes",
        name: "signature",
        type: "bytes",
      },
    ],
    name: "InvalidSignature",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "expectedSigner",
        type: "address",
      },
      {
        internalType: "address",
        name: "receivedSigner",
        type: "address",
      },
    ],
    name: "InvalidSigner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "expected",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "received",
        type: "uint256",
      },
    ],
    name: "InvalidStatus",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "queueId",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "mrEnclave",
        type: "bytes32",
      },
    ],
    name: "MrEnclaveNotAllowed",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "oracleId",
        type: "address",
      },
    ],
    name: "OracleAlreadyExists",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "oracleId",
        type: "address",
      },
    ],
    name: "OracleExpired",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "queueId",
        type: "address",
      },
      {
        internalType: "address",
        name: "oracleId",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "oracleIdx",
        type: "uint256",
      },
    ],
    name: "OracleNotAtQueueIdx",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "queueId",
        type: "address",
      },
      {
        internalType: "address",
        name: "oracleId",
        type: "address",
      },
    ],
    name: "OracleNotOnQueue",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "oracleQueueId",
        type: "address",
      },
    ],
    name: "OracleQueueDoesNotExist",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "granter",
        type: "address",
      },
      {
        internalType: "address",
        name: "grantee",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "permission",
        type: "uint256",
      },
    ],
    name: "PermissionDenied",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "expectedQueueId",
        type: "address",
      },
      {
        internalType: "address",
        name: "receivedQueueId",
        type: "address",
      },
    ],
    name: "QueuesDoNotMatch",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "aggregators",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "results",
        type: "uint256",
      },
    ],
    name: "SubmittedResultsMismatch",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "expirationTime",
        type: "uint256",
      },
    ],
    name: "TransactionExpired",
    type: "error",
  },
] as const;

const _bytecode =
  "0x60566037600b82828239805160001a607314602a57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe73000000000000000000000000000000000000000030146080604052600080fdfea26469706673582212206526ff9274f65b1d9254b19f6b29b451725620a4bdf1645953a8b97c4ccd98f764736f6c63430008110033";

type ErrorLibConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ErrorLibConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class ErrorLib__factory extends ContractFactory {
  constructor(...args: ErrorLibConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ErrorLib> {
    return super.deploy(overrides || {}) as Promise<ErrorLib>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): ErrorLib {
    return super.attach(address) as ErrorLib;
  }
  override connect(signer: Signer): ErrorLib__factory {
    return super.connect(signer) as ErrorLib__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ErrorLibInterface {
    return new utils.Interface(_abi) as ErrorLibInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ErrorLib {
    return new Contract(address, _abi, signerOrProvider) as ErrorLib;
  }
}