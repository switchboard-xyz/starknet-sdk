import { AccountNotFoundError, UnexpectedResponse } from "../error";
import { decode, encode } from "../internal/util";
import type { SwitchboardProgram } from "../SwitchboardProgram";

import { Account } from "./account";
import { RequestAccount, type RequestAccountData } from "./request";
import { RoutineAccount, type RoutineAccountData } from "./routine";

import { parseMrEnclave } from "@switchboard-xyz/common";
import _ from "lodash";
import type { AllowArray, Call } from "starknet";
import {
  type AccountInterface,
  encode as snEncode,
  hash,
  num,
  type Result,
} from "starknet";

const statuses = [
  "None",
  "Active",
  "NonExecutable",
  "Expired",
  "OutOfFunds",
  "InvalidPermissions",
  "Deactivated",
] as const;

export const parseFunctionStatus = (status: any): FunctionStatus => {
  if (statuses.includes(status)) return status;
  throw new Error(`Unknown RoutineStatus: ${status}`);
};

export type ContainerRegistryType = "dockerhub" | "ipfs";
export type FunctionStatus = (typeof statuses)[number];

export type FunctionAccountData = {
  id: string;
  name: string;
  authorityId: string;
  verifierId: string;
  functionAccountId: string;
  functionAccountClassHash: string;
  attestationQueueId: string;
  createdAt: number;
  updatedAt: number;
  containerRegistry: ContainerRegistryType;
  container: string;
  version: string;
  mrEnclaves: string[];
  consecutiveFailures: number;
  lastExecutedAt: number;
  queueIdx: number;
  errorCode: number;
  status: FunctionStatus;
};

export type FunctionCreateParams = {
  name: string;
  authorityId: string;
  attestationQueueId: string;
  containerRegistry: ContainerRegistryType;
  container: string;
  version: string;
};

export type FunctionUpdateParams = {
  name?: string;
  authorityId?: string;
  containerRegistry?: ContainerRegistryType;
  container?: string;
  version?: string;
};

export class FunctionAccount extends Account<FunctionAccountData> {
  private static TAG = "FunctionAccount";
  /**
   *  Given a {@linkcode Result}, try to decode into {@linkcode FunctionAccountData}.
   */
  static decode(result: Result): FunctionAccountData {
    return {
      id: decode.hex(result["id"]),
      name: decode.shortString(result["name"]),
      authorityId: decode.address(result["authority"]),
      verifierId: decode.hex(result["verifier_id"]),
      functionAccountId: decode.hex(result["function_account"]),
      functionAccountClassHash: decode.address(
        result["function_account_class_hash"]
      ),
      attestationQueueId: decode.hex(result["attestation_queue_id"]),
      createdAt: decode.timestamp(result["created_at"]),
      updatedAt: decode.timestamp(result["updated_at"]),
      containerRegistry: decode.shortString(
        result["container_registry"]
      ) as ContainerRegistryType,
      container: result["container"].reduce(
        (res, cur) => res + decode.shortString(cur),
        ""
      ),
      version: decode.shortString(result["version"]),
      mrEnclaves: result["mr_enclaves"].map(decode.hex),
      consecutiveFailures: decode.number(result["consecutive_failures"]),
      lastExecutedAt: decode.timestamp(result["last_execution_timestamp"]),
      queueIdx: decode.number(result["queue_idx"]),
      errorCode: decode.number(result["error_code"]),
      status: parseFunctionStatus(result["status"].activeVariant()),
    };
  }
  /**
   *  Build params to create a new {@linkcode FunctionAccount}.
   *
   *  @returns AllowArray<Call>
   */
  static createTransaction(
    program: SwitchboardProgram,
    params: FunctionCreateParams
  ): AllowArray<Call> {
    return {
      contractAddress: program.programAddress,
      entrypoint: "function_create",
      calldata: {
        params: {
          name: encode.shortString(params.name),
          authority: encode.hex(params.authorityId),
          attestation_queue_id: encode.hex(params.attestationQueueId),
          container_registry: encode.shortString(params.containerRegistry),
          container: encode.longString(params.container),
          version: encode.shortString(params.version),
          mr_enclaves: [],
        },
      },
    };
  }
  /**
   *  Create and submit a transaction to create a new {@linkcode FunctionAccount}.
   *
   *  @returns The newly created {@linkcode FunctionAccount} and transaction hash.
   */
  static async create(
    program: SwitchboardProgram,
    payer: AccountInterface,
    params: FunctionCreateParams
  ): Promise<[FunctionAccount, string]> {
    const transaction = FunctionAccount.createTransaction(program, params);
    const { transaction_hash } = await program.execute(payer, transaction);
    if (program.isVerbose) console.log("function_create", transaction_hash);

    // Wait for the transaction, and upon success, get the receipt to parse events from.
    await program.waitForTransaction(transaction_hash);
    const txnReceipt = await program.provider.getTransactionReceipt(
      transaction_hash
    );
    // Parse the address from the FunctionCreate event
    const eventNameHash = num.toHex(hash.starknetKeccak("FunctionCreate"));
    for (const event of txnReceipt.events) {
      const keys = event.keys;
      if (keys.shift() !== eventNameHash) continue;
      const address = keys.shift();
      if (!address) continue;
      return [
        new FunctionAccount(program, decode.hex(address)),
        transaction_hash,
      ];
    }
    throw new Error(
      `Failed to parse 'FunctionCreate' event from tx. ${transaction_hash}. Check your explorer.`
    );
  }
  /**
   *  Load all of the functions known to the {@linkcode SwitchboardProgram}.
   */
  static async loadAll(program: SwitchboardProgram) {
    const call = "get_all_functions";
    return await program.programContract
      .then((contract) => contract.call(call, []))
      .then((result) => {
        if (program.isVerbose) console.log(call, result);
        if (!_.isArray(result)) throw new Error("Response is not an array.");
        return result.map(FunctionAccount.decode);
      })
      .catch((err) => {
        throw new UnexpectedResponse(FunctionAccount.TAG, undefined, err);
      });
  }
  /**
   *  Load the {@linkcode FunctionAccountData} for a function at the specified address.
   *
   *  @returns The {@linkcode FunctionAccount} and its associated {@linkcode FunctionAccountData}.
   */
  static async load(
    program: SwitchboardProgram,
    address: string
  ): Promise<[FunctionAccount, FunctionAccountData]> {
    const account = new FunctionAccount(program, address);
    return [account, await account.loadData()];
  }

  private throwAccountNotFoundError(error: any): never {
    throw new AccountNotFoundError(FunctionAccount.TAG, this.address, error);
  }
  /**
   *  Fetch the latest {@linkcode FunctionAccountData} for this {@linkcode FunctionAccount}.
   *
   *  @returns FunctionAccountData
   */
  async loadData(): Promise<FunctionAccountData> {
    const call = "view_function";
    const params = [encode.hex(this.address)];
    return await this.program.programContract
      .then((contract) => contract.call(call, params))
      .then((result) => {
        if (this.program.isVerbose) console.log(call, result);
        return result;
      })
      .then((result) => FunctionAccount.decode(result))
      .catch((err) => this.throwAccountNotFoundError(err));
  }
  /**
   *  Load all of the Routines that are attached to this {@linkcode FunctionAccount}.
   *
   *  @returns RoutineAccountData[]
   */
  async loadRoutines(): Promise<RoutineAccountData[]> {
    const call = "get_routines_by_function";
    const params = [encode.hex(this.address)];
    return await this.program.programContract
      .then((contract) => contract.call(call, params))
      .then((result) => {
        if (this.program.isVerbose) console.log(call, result);
        if (!_.isArray(result)) throw new Error("Response is not an array.");
        return result.map(RoutineAccount.decode);
      })
      .catch((err) => {
        throw new UnexpectedResponse(FunctionAccount.TAG, this.address, err);
      });
  }
  /**
   *  Load all of the Requests that are attached to this {@linkcode FunctionAccount}.
   *
   *  @returns RequestAccountData[]
   */
  async loadRequests(): Promise<RequestAccountData[]> {
    const call = "get_requests_by_function";
    const params = [encode.hex(this.address)];
    return await this.program.programContract
      .then((contract) => contract.call(call, params))
      .then((result) => {
        if (this.program.isVerbose) console.log(call, result);
        if (!_.isArray(result)) throw new Error("Response is not an array.");
        return result.map(RequestAccount.decode);
      })
      .catch((err) => {
        throw new UnexpectedResponse(FunctionAccount.TAG, this.address, err);
      });
  }
  /**
   *  Build params to update the configuration of this {@linkcode FunctionAccount}.
   *
   *  @returns Promise<AllowArray<Call>>
   */
  async updateTransaction(
    params: FunctionUpdateParams
  ): Promise<AllowArray<Call>> {
    const current = await this.loadData();
    return {
      contractAddress: this.program.programAddress,
      entrypoint: "function_update",
      calldata: {
        params: {
          id: encode.hex(this.address),
          name: encode.shortString(params.name ?? current.name),
          authority: encode.hex(params.authorityId ?? current.authorityId),
          container_registry: encode.shortString(
            params.containerRegistry ?? current.containerRegistry
          ),
          container: encode.longString(params.container ?? current.container),
          version: encode.shortString(params.version ?? current.version),
          mr_enclaves: [],
        },
      },
    };
  }
  /**
   *  Build params to add an {@linkcode mrEnclave} to this {@linkcode FunctionAccount}.
   *
   *  @returns AllowArray<Call>
   */
  addMrEnclaveTransaction(mrEnclave: string): AllowArray<Call> {
    return {
      contractAddress: this.program.programAddress,
      entrypoint: "function_add_mr_enclave",
      calldata: {
        function_id: encode.hex(this.address),
        mr_enclave: encode.u256(this._checkMrEnclave(mrEnclave)),
      },
    };
  }
  /**
   *  Build params to remove an {@linkcode mrEnclave} from this {@linkcode FunctionAccount}.
   *
   *  @returns AllowArray<Call>
   */
  removeMrEnclaveTransaction(mrEnclave: string): AllowArray<Call> {
    return {
      contractAddress: this.program.programAddress,
      entrypoint: "function_remove_mr_enclave",
      calldata: {
        function_id: encode.hex(this.address),
        mr_enclave: encode.u256(this._checkMrEnclave(mrEnclave)),
      },
    };
  }
  /**
   *  Check if the {@linkcode mrEnclave} is valid and return the cleaned / hexified string.
   */
  private _checkMrEnclave(mrEnclave: string): string {
    return snEncode.addHexPrefix(
      Buffer.from(parseMrEnclave(mrEnclave)).toString("hex")
    );
  }
}
