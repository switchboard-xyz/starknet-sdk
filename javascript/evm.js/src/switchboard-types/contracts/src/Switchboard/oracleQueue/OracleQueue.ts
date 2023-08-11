/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../../../../common";

export declare namespace OracleQueueLib {
  export type OracleQueueStruct = {
    name: PromiseOrValue<string>;
    authority: PromiseOrValue<string>;
    oracles: PromiseOrValue<string>[];
    unpermissionedFeedsEnabled: PromiseOrValue<boolean>;
    maxSize: PromiseOrValue<BigNumberish>;
    reward: PromiseOrValue<BigNumberish>;
    oracleTimeout: PromiseOrValue<BigNumberish>;
    gcIdx: PromiseOrValue<BigNumberish>;
    currIdx: PromiseOrValue<BigNumberish>;
  };

  export type OracleQueueStructOutput = [
    string,
    string,
    string[],
    boolean,
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber
  ] & {
    name: string;
    authority: string;
    oracles: string[];
    unpermissionedFeedsEnabled: boolean;
    maxSize: BigNumber;
    reward: BigNumber;
    oracleTimeout: BigNumber;
    gcIdx: BigNumber;
    currIdx: BigNumber;
  };

  export type AttestationConfigStruct = {
    attestationQueueId: PromiseOrValue<string>;
    mrEnclaves: PromiseOrValue<BytesLike>[];
    requireValidEnclave: PromiseOrValue<boolean>;
    requireHeartbeatPermission: PromiseOrValue<boolean>;
  };

  export type AttestationConfigStructOutput = [
    string,
    string[],
    boolean,
    boolean
  ] & {
    attestationQueueId: string;
    mrEnclaves: string[];
    requireValidEnclave: boolean;
    requireHeartbeatPermission: boolean;
  };
}

export interface OracleQueueInterface extends utils.Interface {
  functions: {
    "addMrEnclaveToOracleQueue(address,bytes32)": FunctionFragment;
    "createOracleQueue(string,address,bool,uint256,uint256,uint256)": FunctionFragment;
    "getOracleIdx(address)": FunctionFragment;
    "getOracleQueueAllowedMrEnclaves(address)": FunctionFragment;
    "getOracles(address)": FunctionFragment;
    "oracleQueues(address)": FunctionFragment;
    "queueAttestationConfigs(address)": FunctionFragment;
    "removeMrEnclaveFromOracleQueue(address,bytes32)": FunctionFragment;
    "setOracleQueueAttestationConfig(address,address,bytes32[],bool,bool)": FunctionFragment;
    "setOracleQueueConfig(address,string,address,bool,uint256,uint256,uint256)": FunctionFragment;
    "setOracleQueuePermission(address,address,uint256,bool)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "addMrEnclaveToOracleQueue"
      | "createOracleQueue"
      | "getOracleIdx"
      | "getOracleQueueAllowedMrEnclaves"
      | "getOracles"
      | "oracleQueues"
      | "queueAttestationConfigs"
      | "removeMrEnclaveFromOracleQueue"
      | "setOracleQueueAttestationConfig"
      | "setOracleQueueConfig"
      | "setOracleQueuePermission"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "addMrEnclaveToOracleQueue",
    values: [PromiseOrValue<string>, PromiseOrValue<BytesLike>]
  ): string;
  encodeFunctionData(
    functionFragment: "createOracleQueue",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<boolean>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "getOracleIdx",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "getOracleQueueAllowedMrEnclaves",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "getOracles",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "oracleQueues",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "queueAttestationConfigs",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "removeMrEnclaveFromOracleQueue",
    values: [PromiseOrValue<string>, PromiseOrValue<BytesLike>]
  ): string;
  encodeFunctionData(
    functionFragment: "setOracleQueueAttestationConfig",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BytesLike>[],
      PromiseOrValue<boolean>,
      PromiseOrValue<boolean>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "setOracleQueueConfig",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<boolean>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "setOracleQueuePermission",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<boolean>
    ]
  ): string;

  decodeFunctionResult(
    functionFragment: "addMrEnclaveToOracleQueue",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "createOracleQueue",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getOracleIdx",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getOracleQueueAllowedMrEnclaves",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getOracles", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "oracleQueues",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "queueAttestationConfigs",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "removeMrEnclaveFromOracleQueue",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setOracleQueueAttestationConfig",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setOracleQueueConfig",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setOracleQueuePermission",
    data: BytesLike
  ): Result;

  events: {
    "OracleQueueAccountInit(address,address)": EventFragment;
    "OracleQueueAddMrEnclave(address,address,bytes32)": EventFragment;
    "OracleQueueRemoveMrEnclave(address,address,bytes32)": EventFragment;
    "OracleQueueSetAttestationConfig(address,address)": EventFragment;
    "OracleQueueSetConfig(address,address)": EventFragment;
    "OracleQueueSetPermission(address,address,address,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "OracleQueueAccountInit"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OracleQueueAddMrEnclave"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OracleQueueRemoveMrEnclave"): EventFragment;
  getEvent(
    nameOrSignatureOrTopic: "OracleQueueSetAttestationConfig"
  ): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OracleQueueSetConfig"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OracleQueueSetPermission"): EventFragment;
}

export interface OracleQueueAccountInitEventObject {
  authority: string;
  accountId: string;
}
export type OracleQueueAccountInitEvent = TypedEvent<
  [string, string],
  OracleQueueAccountInitEventObject
>;

export type OracleQueueAccountInitEventFilter =
  TypedEventFilter<OracleQueueAccountInitEvent>;

export interface OracleQueueAddMrEnclaveEventObject {
  queueId: string;
  attestationQueueId: string;
  mrEnclave: string;
}
export type OracleQueueAddMrEnclaveEvent = TypedEvent<
  [string, string, string],
  OracleQueueAddMrEnclaveEventObject
>;

export type OracleQueueAddMrEnclaveEventFilter =
  TypedEventFilter<OracleQueueAddMrEnclaveEvent>;

export interface OracleQueueRemoveMrEnclaveEventObject {
  queueId: string;
  attestationQueueId: string;
  mrEnclave: string;
}
export type OracleQueueRemoveMrEnclaveEvent = TypedEvent<
  [string, string, string],
  OracleQueueRemoveMrEnclaveEventObject
>;

export type OracleQueueRemoveMrEnclaveEventFilter =
  TypedEventFilter<OracleQueueRemoveMrEnclaveEvent>;

export interface OracleQueueSetAttestationConfigEventObject {
  queueId: string;
  attestationQueueId: string;
}
export type OracleQueueSetAttestationConfigEvent = TypedEvent<
  [string, string],
  OracleQueueSetAttestationConfigEventObject
>;

export type OracleQueueSetAttestationConfigEventFilter =
  TypedEventFilter<OracleQueueSetAttestationConfigEvent>;

export interface OracleQueueSetConfigEventObject {
  queueId: string;
  authority: string;
}
export type OracleQueueSetConfigEvent = TypedEvent<
  [string, string],
  OracleQueueSetConfigEventObject
>;

export type OracleQueueSetConfigEventFilter =
  TypedEventFilter<OracleQueueSetConfigEvent>;

export interface OracleQueueSetPermissionEventObject {
  queueId: string;
  granter: string;
  grantee: string;
  permission: BigNumber;
}
export type OracleQueueSetPermissionEvent = TypedEvent<
  [string, string, string, BigNumber],
  OracleQueueSetPermissionEventObject
>;

export type OracleQueueSetPermissionEventFilter =
  TypedEventFilter<OracleQueueSetPermissionEvent>;

export interface OracleQueue extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: OracleQueueInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    addMrEnclaveToOracleQueue(
      queueId: PromiseOrValue<string>,
      mrEnclave: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    createOracleQueue(
      name: PromiseOrValue<string>,
      authority: PromiseOrValue<string>,
      unpermissionedFeedsEnabled: PromiseOrValue<boolean>,
      maxSize: PromiseOrValue<BigNumberish>,
      reward: PromiseOrValue<BigNumberish>,
      oracleTimeout: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    getOracleIdx(
      oracleId: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    getOracleQueueAllowedMrEnclaves(
      queueId: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[string[]]>;

    getOracles(
      queueId: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[string[]]>;

    oracleQueues(
      queueId: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[OracleQueueLib.OracleQueueStructOutput]>;

    queueAttestationConfigs(
      queueId: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[OracleQueueLib.AttestationConfigStructOutput]>;

    removeMrEnclaveFromOracleQueue(
      queueId: PromiseOrValue<string>,
      mrEnclave: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setOracleQueueAttestationConfig(
      queueId: PromiseOrValue<string>,
      attestationQueueId: PromiseOrValue<string>,
      mrEnclaves: PromiseOrValue<BytesLike>[],
      requireValidEnclave: PromiseOrValue<boolean>,
      requireHeartbeatPermission: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setOracleQueueConfig(
      queueId: PromiseOrValue<string>,
      name: PromiseOrValue<string>,
      authority: PromiseOrValue<string>,
      unpermissionedFeedsEnabled: PromiseOrValue<boolean>,
      maxSize: PromiseOrValue<BigNumberish>,
      reward: PromiseOrValue<BigNumberish>,
      oracleTimeout: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setOracleQueuePermission(
      queueId: PromiseOrValue<string>,
      grantee: PromiseOrValue<string>,
      permission: PromiseOrValue<BigNumberish>,
      on: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  addMrEnclaveToOracleQueue(
    queueId: PromiseOrValue<string>,
    mrEnclave: PromiseOrValue<BytesLike>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  createOracleQueue(
    name: PromiseOrValue<string>,
    authority: PromiseOrValue<string>,
    unpermissionedFeedsEnabled: PromiseOrValue<boolean>,
    maxSize: PromiseOrValue<BigNumberish>,
    reward: PromiseOrValue<BigNumberish>,
    oracleTimeout: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  getOracleIdx(
    oracleId: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getOracleQueueAllowedMrEnclaves(
    queueId: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<string[]>;

  getOracles(
    queueId: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<string[]>;

  oracleQueues(
    queueId: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<OracleQueueLib.OracleQueueStructOutput>;

  queueAttestationConfigs(
    queueId: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<OracleQueueLib.AttestationConfigStructOutput>;

  removeMrEnclaveFromOracleQueue(
    queueId: PromiseOrValue<string>,
    mrEnclave: PromiseOrValue<BytesLike>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setOracleQueueAttestationConfig(
    queueId: PromiseOrValue<string>,
    attestationQueueId: PromiseOrValue<string>,
    mrEnclaves: PromiseOrValue<BytesLike>[],
    requireValidEnclave: PromiseOrValue<boolean>,
    requireHeartbeatPermission: PromiseOrValue<boolean>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setOracleQueueConfig(
    queueId: PromiseOrValue<string>,
    name: PromiseOrValue<string>,
    authority: PromiseOrValue<string>,
    unpermissionedFeedsEnabled: PromiseOrValue<boolean>,
    maxSize: PromiseOrValue<BigNumberish>,
    reward: PromiseOrValue<BigNumberish>,
    oracleTimeout: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setOracleQueuePermission(
    queueId: PromiseOrValue<string>,
    grantee: PromiseOrValue<string>,
    permission: PromiseOrValue<BigNumberish>,
    on: PromiseOrValue<boolean>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    addMrEnclaveToOracleQueue(
      queueId: PromiseOrValue<string>,
      mrEnclave: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<void>;

    createOracleQueue(
      name: PromiseOrValue<string>,
      authority: PromiseOrValue<string>,
      unpermissionedFeedsEnabled: PromiseOrValue<boolean>,
      maxSize: PromiseOrValue<BigNumberish>,
      reward: PromiseOrValue<BigNumberish>,
      oracleTimeout: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    getOracleIdx(
      oracleId: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getOracleQueueAllowedMrEnclaves(
      queueId: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<string[]>;

    getOracles(
      queueId: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<string[]>;

    oracleQueues(
      queueId: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<OracleQueueLib.OracleQueueStructOutput>;

    queueAttestationConfigs(
      queueId: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<OracleQueueLib.AttestationConfigStructOutput>;

    removeMrEnclaveFromOracleQueue(
      queueId: PromiseOrValue<string>,
      mrEnclave: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<void>;

    setOracleQueueAttestationConfig(
      queueId: PromiseOrValue<string>,
      attestationQueueId: PromiseOrValue<string>,
      mrEnclaves: PromiseOrValue<BytesLike>[],
      requireValidEnclave: PromiseOrValue<boolean>,
      requireHeartbeatPermission: PromiseOrValue<boolean>,
      overrides?: CallOverrides
    ): Promise<void>;

    setOracleQueueConfig(
      queueId: PromiseOrValue<string>,
      name: PromiseOrValue<string>,
      authority: PromiseOrValue<string>,
      unpermissionedFeedsEnabled: PromiseOrValue<boolean>,
      maxSize: PromiseOrValue<BigNumberish>,
      reward: PromiseOrValue<BigNumberish>,
      oracleTimeout: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    setOracleQueuePermission(
      queueId: PromiseOrValue<string>,
      grantee: PromiseOrValue<string>,
      permission: PromiseOrValue<BigNumberish>,
      on: PromiseOrValue<boolean>,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "OracleQueueAccountInit(address,address)"(
      authority?: PromiseOrValue<string> | null,
      accountId?: PromiseOrValue<string> | null
    ): OracleQueueAccountInitEventFilter;
    OracleQueueAccountInit(
      authority?: PromiseOrValue<string> | null,
      accountId?: PromiseOrValue<string> | null
    ): OracleQueueAccountInitEventFilter;

    "OracleQueueAddMrEnclave(address,address,bytes32)"(
      queueId?: PromiseOrValue<string> | null,
      attestationQueueId?: PromiseOrValue<string> | null,
      mrEnclave?: null
    ): OracleQueueAddMrEnclaveEventFilter;
    OracleQueueAddMrEnclave(
      queueId?: PromiseOrValue<string> | null,
      attestationQueueId?: PromiseOrValue<string> | null,
      mrEnclave?: null
    ): OracleQueueAddMrEnclaveEventFilter;

    "OracleQueueRemoveMrEnclave(address,address,bytes32)"(
      queueId?: PromiseOrValue<string> | null,
      attestationQueueId?: PromiseOrValue<string> | null,
      mrEnclave?: null
    ): OracleQueueRemoveMrEnclaveEventFilter;
    OracleQueueRemoveMrEnclave(
      queueId?: PromiseOrValue<string> | null,
      attestationQueueId?: PromiseOrValue<string> | null,
      mrEnclave?: null
    ): OracleQueueRemoveMrEnclaveEventFilter;

    "OracleQueueSetAttestationConfig(address,address)"(
      queueId?: PromiseOrValue<string> | null,
      attestationQueueId?: PromiseOrValue<string> | null
    ): OracleQueueSetAttestationConfigEventFilter;
    OracleQueueSetAttestationConfig(
      queueId?: PromiseOrValue<string> | null,
      attestationQueueId?: PromiseOrValue<string> | null
    ): OracleQueueSetAttestationConfigEventFilter;

    "OracleQueueSetConfig(address,address)"(
      queueId?: PromiseOrValue<string> | null,
      authority?: PromiseOrValue<string> | null
    ): OracleQueueSetConfigEventFilter;
    OracleQueueSetConfig(
      queueId?: PromiseOrValue<string> | null,
      authority?: PromiseOrValue<string> | null
    ): OracleQueueSetConfigEventFilter;

    "OracleQueueSetPermission(address,address,address,uint256)"(
      queueId?: PromiseOrValue<string> | null,
      granter?: PromiseOrValue<string> | null,
      grantee?: PromiseOrValue<string> | null,
      permission?: null
    ): OracleQueueSetPermissionEventFilter;
    OracleQueueSetPermission(
      queueId?: PromiseOrValue<string> | null,
      granter?: PromiseOrValue<string> | null,
      grantee?: PromiseOrValue<string> | null,
      permission?: null
    ): OracleQueueSetPermissionEventFilter;
  };

  estimateGas: {
    addMrEnclaveToOracleQueue(
      queueId: PromiseOrValue<string>,
      mrEnclave: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    createOracleQueue(
      name: PromiseOrValue<string>,
      authority: PromiseOrValue<string>,
      unpermissionedFeedsEnabled: PromiseOrValue<boolean>,
      maxSize: PromiseOrValue<BigNumberish>,
      reward: PromiseOrValue<BigNumberish>,
      oracleTimeout: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    getOracleIdx(
      oracleId: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getOracleQueueAllowedMrEnclaves(
      queueId: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getOracles(
      queueId: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    oracleQueues(
      queueId: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    queueAttestationConfigs(
      queueId: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    removeMrEnclaveFromOracleQueue(
      queueId: PromiseOrValue<string>,
      mrEnclave: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setOracleQueueAttestationConfig(
      queueId: PromiseOrValue<string>,
      attestationQueueId: PromiseOrValue<string>,
      mrEnclaves: PromiseOrValue<BytesLike>[],
      requireValidEnclave: PromiseOrValue<boolean>,
      requireHeartbeatPermission: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setOracleQueueConfig(
      queueId: PromiseOrValue<string>,
      name: PromiseOrValue<string>,
      authority: PromiseOrValue<string>,
      unpermissionedFeedsEnabled: PromiseOrValue<boolean>,
      maxSize: PromiseOrValue<BigNumberish>,
      reward: PromiseOrValue<BigNumberish>,
      oracleTimeout: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setOracleQueuePermission(
      queueId: PromiseOrValue<string>,
      grantee: PromiseOrValue<string>,
      permission: PromiseOrValue<BigNumberish>,
      on: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    addMrEnclaveToOracleQueue(
      queueId: PromiseOrValue<string>,
      mrEnclave: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    createOracleQueue(
      name: PromiseOrValue<string>,
      authority: PromiseOrValue<string>,
      unpermissionedFeedsEnabled: PromiseOrValue<boolean>,
      maxSize: PromiseOrValue<BigNumberish>,
      reward: PromiseOrValue<BigNumberish>,
      oracleTimeout: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    getOracleIdx(
      oracleId: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getOracleQueueAllowedMrEnclaves(
      queueId: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getOracles(
      queueId: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    oracleQueues(
      queueId: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    queueAttestationConfigs(
      queueId: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    removeMrEnclaveFromOracleQueue(
      queueId: PromiseOrValue<string>,
      mrEnclave: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setOracleQueueAttestationConfig(
      queueId: PromiseOrValue<string>,
      attestationQueueId: PromiseOrValue<string>,
      mrEnclaves: PromiseOrValue<BytesLike>[],
      requireValidEnclave: PromiseOrValue<boolean>,
      requireHeartbeatPermission: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setOracleQueueConfig(
      queueId: PromiseOrValue<string>,
      name: PromiseOrValue<string>,
      authority: PromiseOrValue<string>,
      unpermissionedFeedsEnabled: PromiseOrValue<boolean>,
      maxSize: PromiseOrValue<BigNumberish>,
      reward: PromiseOrValue<BigNumberish>,
      oracleTimeout: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setOracleQueuePermission(
      queueId: PromiseOrValue<string>,
      grantee: PromiseOrValue<string>,
      permission: PromiseOrValue<BigNumberish>,
      on: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}