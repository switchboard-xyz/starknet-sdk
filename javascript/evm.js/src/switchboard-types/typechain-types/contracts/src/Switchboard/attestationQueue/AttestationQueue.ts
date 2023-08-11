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

export declare namespace AttestationQueueLib {
  export type AttestationQueueStruct = {
    authority: PromiseOrValue<string>;
    data: PromiseOrValue<string>[];
    maxSize: PromiseOrValue<BigNumberish>;
    reward: PromiseOrValue<BigNumberish>;
    lastHeartbeat: PromiseOrValue<BigNumberish>;
    mrEnclaves: PromiseOrValue<BytesLike>[];
    maxEnclaveVerificationAge: PromiseOrValue<BigNumberish>;
    allowAuthorityOverrideAfter: PromiseOrValue<BigNumberish>;
    maxConsecutiveFunctionFailures: PromiseOrValue<BigNumberish>;
    requireAuthorityHeartbeatPermission: PromiseOrValue<boolean>;
    requireUsagePermissions: PromiseOrValue<boolean>;
    enclaveTimeout: PromiseOrValue<BigNumberish>;
    gcIdx: PromiseOrValue<BigNumberish>;
    currIdx: PromiseOrValue<BigNumberish>;
  };

  export type AttestationQueueStructOutput = [
    string,
    string[],
    BigNumber,
    BigNumber,
    BigNumber,
    string[],
    BigNumber,
    BigNumber,
    BigNumber,
    boolean,
    boolean,
    BigNumber,
    BigNumber,
    BigNumber
  ] & {
    authority: string;
    data: string[];
    maxSize: BigNumber;
    reward: BigNumber;
    lastHeartbeat: BigNumber;
    mrEnclaves: string[];
    maxEnclaveVerificationAge: BigNumber;
    allowAuthorityOverrideAfter: BigNumber;
    maxConsecutiveFunctionFailures: BigNumber;
    requireAuthorityHeartbeatPermission: boolean;
    requireUsagePermissions: boolean;
    enclaveTimeout: BigNumber;
    gcIdx: BigNumber;
    currIdx: BigNumber;
  };
}

export interface AttestationQueueInterface extends utils.Interface {
  functions: {
    "addMrEnclaveToAttestationQueue(address,bytes32)": FunctionFragment;
    "attestationQueueHasMrEnclave(address,bytes32)": FunctionFragment;
    "attestationQueues(address)": FunctionFragment;
    "createAttestationQueue(address,uint256,uint256,uint256,uint256,uint256,bool,bool,uint256)": FunctionFragment;
    "getAttestationQueueMrEnclaves(address)": FunctionFragment;
    "getEnclaveIdx(address)": FunctionFragment;
    "getEnclaves(address)": FunctionFragment;
    "removeMrEnclaveFromAttestationQueue(address,bytes32)": FunctionFragment;
    "setAttestationQueueConfig(address,address,uint256,uint256,uint256,uint256,uint256,bool,bool,uint256)": FunctionFragment;
    "setAttestationQueuePermission(address,address,uint256,bool)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "addMrEnclaveToAttestationQueue"
      | "attestationQueueHasMrEnclave"
      | "attestationQueues"
      | "createAttestationQueue"
      | "getAttestationQueueMrEnclaves"
      | "getEnclaveIdx"
      | "getEnclaves"
      | "removeMrEnclaveFromAttestationQueue"
      | "setAttestationQueueConfig"
      | "setAttestationQueuePermission"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "addMrEnclaveToAttestationQueue",
    values: [PromiseOrValue<string>, PromiseOrValue<BytesLike>]
  ): string;
  encodeFunctionData(
    functionFragment: "attestationQueueHasMrEnclave",
    values: [PromiseOrValue<string>, PromiseOrValue<BytesLike>]
  ): string;
  encodeFunctionData(
    functionFragment: "attestationQueues",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "createAttestationQueue",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<boolean>,
      PromiseOrValue<boolean>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "getAttestationQueueMrEnclaves",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "getEnclaveIdx",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "getEnclaves",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "removeMrEnclaveFromAttestationQueue",
    values: [PromiseOrValue<string>, PromiseOrValue<BytesLike>]
  ): string;
  encodeFunctionData(
    functionFragment: "setAttestationQueueConfig",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<boolean>,
      PromiseOrValue<boolean>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "setAttestationQueuePermission",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<boolean>
    ]
  ): string;

  decodeFunctionResult(
    functionFragment: "addMrEnclaveToAttestationQueue",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "attestationQueueHasMrEnclave",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "attestationQueues",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "createAttestationQueue",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getAttestationQueueMrEnclaves",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getEnclaveIdx",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getEnclaves",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "removeMrEnclaveFromAttestationQueue",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setAttestationQueueConfig",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setAttestationQueuePermission",
    data: BytesLike
  ): Result;

  events: {
    "AddMrEnclave(address,bytes32)": EventFragment;
    "AttestationQueueAccountInit(address,address)": EventFragment;
    "AttestationQueuePermissionUpdated(address,address,address,uint256)": EventFragment;
    "AttestationQueueSetConfig(address,address)": EventFragment;
    "RemoveMrEnclave(address,bytes32)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "AddMrEnclave"): EventFragment;
  getEvent(
    nameOrSignatureOrTopic: "AttestationQueueAccountInit"
  ): EventFragment;
  getEvent(
    nameOrSignatureOrTopic: "AttestationQueuePermissionUpdated"
  ): EventFragment;
  getEvent(nameOrSignatureOrTopic: "AttestationQueueSetConfig"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RemoveMrEnclave"): EventFragment;
}

export interface AddMrEnclaveEventObject {
  queueId: string;
  mrEnclave: string;
}
export type AddMrEnclaveEvent = TypedEvent<
  [string, string],
  AddMrEnclaveEventObject
>;

export type AddMrEnclaveEventFilter = TypedEventFilter<AddMrEnclaveEvent>;

export interface AttestationQueueAccountInitEventObject {
  authority: string;
  accountId: string;
}
export type AttestationQueueAccountInitEvent = TypedEvent<
  [string, string],
  AttestationQueueAccountInitEventObject
>;

export type AttestationQueueAccountInitEventFilter =
  TypedEventFilter<AttestationQueueAccountInitEvent>;

export interface AttestationQueuePermissionUpdatedEventObject {
  queueId: string;
  granter: string;
  grantee: string;
  permission: BigNumber;
}
export type AttestationQueuePermissionUpdatedEvent = TypedEvent<
  [string, string, string, BigNumber],
  AttestationQueuePermissionUpdatedEventObject
>;

export type AttestationQueuePermissionUpdatedEventFilter =
  TypedEventFilter<AttestationQueuePermissionUpdatedEvent>;

export interface AttestationQueueSetConfigEventObject {
  queueId: string;
  authority: string;
}
export type AttestationQueueSetConfigEvent = TypedEvent<
  [string, string],
  AttestationQueueSetConfigEventObject
>;

export type AttestationQueueSetConfigEventFilter =
  TypedEventFilter<AttestationQueueSetConfigEvent>;

export interface RemoveMrEnclaveEventObject {
  queueId: string;
  mrEnclave: string;
}
export type RemoveMrEnclaveEvent = TypedEvent<
  [string, string],
  RemoveMrEnclaveEventObject
>;

export type RemoveMrEnclaveEventFilter = TypedEventFilter<RemoveMrEnclaveEvent>;

export interface AttestationQueue extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: AttestationQueueInterface;

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
    addMrEnclaveToAttestationQueue(
      queueId: PromiseOrValue<string>,
      mrEnclave: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    attestationQueueHasMrEnclave(
      queueId: PromiseOrValue<string>,
      mrEnclave: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    attestationQueues(
      queueId: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[AttestationQueueLib.AttestationQueueStructOutput]>;

    createAttestationQueue(
      authority: PromiseOrValue<string>,
      maxSize: PromiseOrValue<BigNumberish>,
      reward: PromiseOrValue<BigNumberish>,
      enclaveTimeout: PromiseOrValue<BigNumberish>,
      maxEnclaveVerificationAge: PromiseOrValue<BigNumberish>,
      allowAuthorityOverrideAfter: PromiseOrValue<BigNumberish>,
      requireAuthorityHeartbeatPermission: PromiseOrValue<boolean>,
      requireUsagePermissions: PromiseOrValue<boolean>,
      maxConsecutiveFunctionFailures: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    getAttestationQueueMrEnclaves(
      queueId: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[string[]]>;

    getEnclaveIdx(
      enclaveId: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    getEnclaves(
      queueId: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[string[]]>;

    removeMrEnclaveFromAttestationQueue(
      queueId: PromiseOrValue<string>,
      mrEnclave: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setAttestationQueueConfig(
      queueId: PromiseOrValue<string>,
      authority: PromiseOrValue<string>,
      maxSize: PromiseOrValue<BigNumberish>,
      reward: PromiseOrValue<BigNumberish>,
      enclaveTimeout: PromiseOrValue<BigNumberish>,
      maxEnclaveVerificationAge: PromiseOrValue<BigNumberish>,
      allowAuthorityOverrideAfter: PromiseOrValue<BigNumberish>,
      requireAuthorityHeartbeatPermission: PromiseOrValue<boolean>,
      requireUsagePermissions: PromiseOrValue<boolean>,
      maxConsecutiveFunctionFailures: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setAttestationQueuePermission(
      queueId: PromiseOrValue<string>,
      grantee: PromiseOrValue<string>,
      permission: PromiseOrValue<BigNumberish>,
      on: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  addMrEnclaveToAttestationQueue(
    queueId: PromiseOrValue<string>,
    mrEnclave: PromiseOrValue<BytesLike>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  attestationQueueHasMrEnclave(
    queueId: PromiseOrValue<string>,
    mrEnclave: PromiseOrValue<BytesLike>,
    overrides?: CallOverrides
  ): Promise<boolean>;

  attestationQueues(
    queueId: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<AttestationQueueLib.AttestationQueueStructOutput>;

  createAttestationQueue(
    authority: PromiseOrValue<string>,
    maxSize: PromiseOrValue<BigNumberish>,
    reward: PromiseOrValue<BigNumberish>,
    enclaveTimeout: PromiseOrValue<BigNumberish>,
    maxEnclaveVerificationAge: PromiseOrValue<BigNumberish>,
    allowAuthorityOverrideAfter: PromiseOrValue<BigNumberish>,
    requireAuthorityHeartbeatPermission: PromiseOrValue<boolean>,
    requireUsagePermissions: PromiseOrValue<boolean>,
    maxConsecutiveFunctionFailures: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  getAttestationQueueMrEnclaves(
    queueId: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<string[]>;

  getEnclaveIdx(
    enclaveId: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getEnclaves(
    queueId: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<string[]>;

  removeMrEnclaveFromAttestationQueue(
    queueId: PromiseOrValue<string>,
    mrEnclave: PromiseOrValue<BytesLike>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setAttestationQueueConfig(
    queueId: PromiseOrValue<string>,
    authority: PromiseOrValue<string>,
    maxSize: PromiseOrValue<BigNumberish>,
    reward: PromiseOrValue<BigNumberish>,
    enclaveTimeout: PromiseOrValue<BigNumberish>,
    maxEnclaveVerificationAge: PromiseOrValue<BigNumberish>,
    allowAuthorityOverrideAfter: PromiseOrValue<BigNumberish>,
    requireAuthorityHeartbeatPermission: PromiseOrValue<boolean>,
    requireUsagePermissions: PromiseOrValue<boolean>,
    maxConsecutiveFunctionFailures: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setAttestationQueuePermission(
    queueId: PromiseOrValue<string>,
    grantee: PromiseOrValue<string>,
    permission: PromiseOrValue<BigNumberish>,
    on: PromiseOrValue<boolean>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    addMrEnclaveToAttestationQueue(
      queueId: PromiseOrValue<string>,
      mrEnclave: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<void>;

    attestationQueueHasMrEnclave(
      queueId: PromiseOrValue<string>,
      mrEnclave: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    attestationQueues(
      queueId: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<AttestationQueueLib.AttestationQueueStructOutput>;

    createAttestationQueue(
      authority: PromiseOrValue<string>,
      maxSize: PromiseOrValue<BigNumberish>,
      reward: PromiseOrValue<BigNumberish>,
      enclaveTimeout: PromiseOrValue<BigNumberish>,
      maxEnclaveVerificationAge: PromiseOrValue<BigNumberish>,
      allowAuthorityOverrideAfter: PromiseOrValue<BigNumberish>,
      requireAuthorityHeartbeatPermission: PromiseOrValue<boolean>,
      requireUsagePermissions: PromiseOrValue<boolean>,
      maxConsecutiveFunctionFailures: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    getAttestationQueueMrEnclaves(
      queueId: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<string[]>;

    getEnclaveIdx(
      enclaveId: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getEnclaves(
      queueId: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<string[]>;

    removeMrEnclaveFromAttestationQueue(
      queueId: PromiseOrValue<string>,
      mrEnclave: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<void>;

    setAttestationQueueConfig(
      queueId: PromiseOrValue<string>,
      authority: PromiseOrValue<string>,
      maxSize: PromiseOrValue<BigNumberish>,
      reward: PromiseOrValue<BigNumberish>,
      enclaveTimeout: PromiseOrValue<BigNumberish>,
      maxEnclaveVerificationAge: PromiseOrValue<BigNumberish>,
      allowAuthorityOverrideAfter: PromiseOrValue<BigNumberish>,
      requireAuthorityHeartbeatPermission: PromiseOrValue<boolean>,
      requireUsagePermissions: PromiseOrValue<boolean>,
      maxConsecutiveFunctionFailures: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    setAttestationQueuePermission(
      queueId: PromiseOrValue<string>,
      grantee: PromiseOrValue<string>,
      permission: PromiseOrValue<BigNumberish>,
      on: PromiseOrValue<boolean>,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "AddMrEnclave(address,bytes32)"(
      queueId?: PromiseOrValue<string> | null,
      mrEnclave?: null
    ): AddMrEnclaveEventFilter;
    AddMrEnclave(
      queueId?: PromiseOrValue<string> | null,
      mrEnclave?: null
    ): AddMrEnclaveEventFilter;

    "AttestationQueueAccountInit(address,address)"(
      authority?: PromiseOrValue<string> | null,
      accountId?: PromiseOrValue<string> | null
    ): AttestationQueueAccountInitEventFilter;
    AttestationQueueAccountInit(
      authority?: PromiseOrValue<string> | null,
      accountId?: PromiseOrValue<string> | null
    ): AttestationQueueAccountInitEventFilter;

    "AttestationQueuePermissionUpdated(address,address,address,uint256)"(
      queueId?: PromiseOrValue<string> | null,
      granter?: PromiseOrValue<string> | null,
      grantee?: PromiseOrValue<string> | null,
      permission?: null
    ): AttestationQueuePermissionUpdatedEventFilter;
    AttestationQueuePermissionUpdated(
      queueId?: PromiseOrValue<string> | null,
      granter?: PromiseOrValue<string> | null,
      grantee?: PromiseOrValue<string> | null,
      permission?: null
    ): AttestationQueuePermissionUpdatedEventFilter;

    "AttestationQueueSetConfig(address,address)"(
      queueId?: PromiseOrValue<string> | null,
      authority?: PromiseOrValue<string> | null
    ): AttestationQueueSetConfigEventFilter;
    AttestationQueueSetConfig(
      queueId?: PromiseOrValue<string> | null,
      authority?: PromiseOrValue<string> | null
    ): AttestationQueueSetConfigEventFilter;

    "RemoveMrEnclave(address,bytes32)"(
      queueId?: PromiseOrValue<string> | null,
      mrEnclave?: null
    ): RemoveMrEnclaveEventFilter;
    RemoveMrEnclave(
      queueId?: PromiseOrValue<string> | null,
      mrEnclave?: null
    ): RemoveMrEnclaveEventFilter;
  };

  estimateGas: {
    addMrEnclaveToAttestationQueue(
      queueId: PromiseOrValue<string>,
      mrEnclave: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    attestationQueueHasMrEnclave(
      queueId: PromiseOrValue<string>,
      mrEnclave: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    attestationQueues(
      queueId: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    createAttestationQueue(
      authority: PromiseOrValue<string>,
      maxSize: PromiseOrValue<BigNumberish>,
      reward: PromiseOrValue<BigNumberish>,
      enclaveTimeout: PromiseOrValue<BigNumberish>,
      maxEnclaveVerificationAge: PromiseOrValue<BigNumberish>,
      allowAuthorityOverrideAfter: PromiseOrValue<BigNumberish>,
      requireAuthorityHeartbeatPermission: PromiseOrValue<boolean>,
      requireUsagePermissions: PromiseOrValue<boolean>,
      maxConsecutiveFunctionFailures: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    getAttestationQueueMrEnclaves(
      queueId: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getEnclaveIdx(
      enclaveId: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getEnclaves(
      queueId: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    removeMrEnclaveFromAttestationQueue(
      queueId: PromiseOrValue<string>,
      mrEnclave: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setAttestationQueueConfig(
      queueId: PromiseOrValue<string>,
      authority: PromiseOrValue<string>,
      maxSize: PromiseOrValue<BigNumberish>,
      reward: PromiseOrValue<BigNumberish>,
      enclaveTimeout: PromiseOrValue<BigNumberish>,
      maxEnclaveVerificationAge: PromiseOrValue<BigNumberish>,
      allowAuthorityOverrideAfter: PromiseOrValue<BigNumberish>,
      requireAuthorityHeartbeatPermission: PromiseOrValue<boolean>,
      requireUsagePermissions: PromiseOrValue<boolean>,
      maxConsecutiveFunctionFailures: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setAttestationQueuePermission(
      queueId: PromiseOrValue<string>,
      grantee: PromiseOrValue<string>,
      permission: PromiseOrValue<BigNumberish>,
      on: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    addMrEnclaveToAttestationQueue(
      queueId: PromiseOrValue<string>,
      mrEnclave: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    attestationQueueHasMrEnclave(
      queueId: PromiseOrValue<string>,
      mrEnclave: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    attestationQueues(
      queueId: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    createAttestationQueue(
      authority: PromiseOrValue<string>,
      maxSize: PromiseOrValue<BigNumberish>,
      reward: PromiseOrValue<BigNumberish>,
      enclaveTimeout: PromiseOrValue<BigNumberish>,
      maxEnclaveVerificationAge: PromiseOrValue<BigNumberish>,
      allowAuthorityOverrideAfter: PromiseOrValue<BigNumberish>,
      requireAuthorityHeartbeatPermission: PromiseOrValue<boolean>,
      requireUsagePermissions: PromiseOrValue<boolean>,
      maxConsecutiveFunctionFailures: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    getAttestationQueueMrEnclaves(
      queueId: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getEnclaveIdx(
      enclaveId: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getEnclaves(
      queueId: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    removeMrEnclaveFromAttestationQueue(
      queueId: PromiseOrValue<string>,
      mrEnclave: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setAttestationQueueConfig(
      queueId: PromiseOrValue<string>,
      authority: PromiseOrValue<string>,
      maxSize: PromiseOrValue<BigNumberish>,
      reward: PromiseOrValue<BigNumberish>,
      enclaveTimeout: PromiseOrValue<BigNumberish>,
      maxEnclaveVerificationAge: PromiseOrValue<BigNumberish>,
      allowAuthorityOverrideAfter: PromiseOrValue<BigNumberish>,
      requireAuthorityHeartbeatPermission: PromiseOrValue<boolean>,
      requireUsagePermissions: PromiseOrValue<boolean>,
      maxConsecutiveFunctionFailures: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setAttestationQueuePermission(
      queueId: PromiseOrValue<string>,
      grantee: PromiseOrValue<string>,
      permission: PromiseOrValue<BigNumberish>,
      on: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}