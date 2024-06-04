import * as errors from "../error";
import { decode, encode } from "../internal/util";
import type { SwitchboardProgram } from "../SwitchboardProgram";

import { Account } from "./account";
import { FunctionAccount, type FunctionAccountData } from "./function";

import { BN } from "@switchboard-xyz/common";
import _ from "lodash";
import type { Result } from "starknet";

export type AttestationQueueAccountData = {
  id: string;
  authorityId: string;
  createdAt: number;
  updatedAt: number;
  lastHeartbeatAt: number;
  mrEnclaves: string[];
  verifierIds: string[];
  requireHeartbeatPermission: boolean;
  requireUsagePermission: boolean;
  allowAuthorityOverrideAfter: number;
  maxConsecutiveFunctionFailures: number;
  maxSize: number;
  reward: BN;
  verifierTimeout: number;
  gcIdx: number;
  curIdx: number;
};

export class AttestationQueueAccount extends Account<AttestationQueueAccountData> {
  private static TAG = "AttestationQueueAccount";

  static decode(config: Result, state: Result): AttestationQueueAccountData {
    return {
      id: decode.hex(config["id"]),
      authorityId: decode.address(config["authority"]),
      createdAt: decode.timestamp(config["created_at"]),
      updatedAt: decode.timestamp(config["updated_at"]),
      lastHeartbeatAt: decode.timestamp(state["last_heartbeat"]),
      mrEnclaves: config["mr_enclaves"].map(decode.hex),
      verifierIds: config["verifiers"].map(decode.hex),
      requireHeartbeatPermission: decode.bool(
        config["require_heartbeat_permission"]
      ),
      requireUsagePermission: decode.bool(config["require_usage_permission"]),
      allowAuthorityOverrideAfter: decode.number(
        config["allow_authority_overide_after"]
      ),
      maxConsecutiveFunctionFailures: decode.number(
        config["max_consecutive_function_failures"]
      ),
      maxSize: decode.number(config["max_size"]),
      reward: new BN(config["reward"]),
      verifierTimeout: decode.number(config["verifier_timeout"]),
      gcIdx: decode.number(state["gc_idx"]),
      curIdx: decode.number(state["cur_idx"]),
    };
  }

  static async load(
    program: SwitchboardProgram,
    address: string
  ): Promise<[AttestationQueueAccount, AttestationQueueAccountData]> {
    const account = new AttestationQueueAccount(program, address);
    return [account, await account.loadData()];
  }

  private throwAccountNotFoundError(error: any): never {
    if (this.program.isVerbose) console.error(error);
    throw new errors.AccountNotFoundError(
      AttestationQueueAccount.TAG,
      this.address,
      error
    );
  }

  private throwUnexpectedResponseError(error: any): never {
    if (this.program.isVerbose) console.error(error);
    throw new errors.UnexpectedResponse(
      AttestationQueueAccount.TAG,
      this.address,
      error
    );
  }

  async loadData(): Promise<AttestationQueueAccountData> {
    const get_call = "attestation_queue_get";
    const get_state_call = "attestation_queue_get_state";
    const contract = await this.program.programContract;
    return await Promise.all([
      await contract
        .call(get_call, [encode.hex(this.address)])
        .then((result) => {
          if (this.program.isVerbose) console.log(get_call, result);
          return result;
        })
        .catch((err) => this.throwAccountNotFoundError(err)),
      await contract
        .call(get_state_call, [encode.hex(this.address)])
        .then((result) => {
          if (this.program.isVerbose) console.log(get_state_call, result);
          return result;
        })
        .catch((err) => this.throwAccountNotFoundError(err)),
    ]).then((result) => AttestationQueueAccount.decode(result[0], result[1]));
  }

  async loadActiveFunctionAccounts(): Promise<FunctionAccountData[]> {
    const call = "get_active_functions_by_queue";
    const params = [encode.hex(this.address)];
    return await this.program.programContract
      .then((contract) => contract.call(call, params))
      .then((result) => {
        if (this.program.isVerbose) console.log(call, result);
        if (!_.isArray(result)) throw new Error("Response is not an array.");
        return result.map(FunctionAccount.decode);
      })
      .catch((err) => this.throwUnexpectedResponseError(err));
  }
}
