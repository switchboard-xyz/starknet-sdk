import { AccountNotFoundError } from "../error";
import { decode, encode } from "../internal/util";
import type { SwitchboardProgram } from "../SwitchboardProgram";

import { Account } from "./account";

import _ from "lodash";
import type { Result } from "starknet";

const statuses = ["Failure", "Pending", "Success", "Override"] as const;

const parseVerificationStatus = (result: Result): VerificationStatus => {
  const status = result["verification_status"].activeVariant();
  if (statuses.includes(status)) return status;
  throw new Error(`Unknown FunctionStatus: ${status}`);
};

export type VerificationStatus = (typeof statuses)[number];

export type VerifierAccountData = {
  id: string;
  authorityId: string;
  signerId: string;
  signerKey: string;
  cid: string;
  attestationQueueId: string;
  createdAt: number;
  updatedAt: number;
  lastHeartbeatAt: number;
  isOnQueue: boolean;
  verificationStatus: VerificationStatus;
  verificationTimestamp: number;
  verificationValidUntil: number;
  mrEnclave: string;
};

export class VerifierAccount extends Account<VerifierAccountData> {
  private static TAG = "VerifierAccount";

  static decode(result: Result): VerifierAccountData {
    _.isArray(result["cid"]);
    const cid = _.isArray(result["cid"])
      ? result["cid"].reduce<string>((p, c) => p + decode.shortString(c), "")
      : "";

    return {
      id: decode.hex(result["id"]),
      authorityId: decode.address(result["authority"]),
      signerId: decode.address(result["signer"]),
      signerKey: decode.address(result["signer_key"]),
      cid: cid,
      attestationQueueId: decode.hex(result["attestation_queue_id"]),
      createdAt: decode.timestamp(result["created_at"]),
      updatedAt: decode.timestamp(result["updated_at"]),
      lastHeartbeatAt: decode.timestamp(result["last_heartbeat_at"]),
      isOnQueue: decode.bool(result["is_on_queue"]),
      verificationStatus: parseVerificationStatus(result),
      verificationTimestamp: decode.timestamp(result["verification_timestamp"]),
      verificationValidUntil: decode.timestamp(
        result["verification_valid_until"]
      ),
      mrEnclave: decode.hex(result["mr_enclave"]),
    };
  }

  static async load(
    program: SwitchboardProgram,
    address: string
  ): Promise<[VerifierAccount, VerifierAccountData]> {
    const account = new VerifierAccount(program, address);
    return [account, await account.loadData()];
  }

  private throwAccountNotFoundError(error: any): never {
    throw new AccountNotFoundError(VerifierAccount.TAG, this.address, error);
  }

  async loadData(): Promise<VerifierAccountData> {
    const call = "view_verifier";
    const params = [encode.hex(this.address)];
    return await this.program.programContract
      .then((contract) => contract.call(call, params))
      .then((result) => {
        if (this.program.isVerbose) console.log(call, result);
        return result;
      })
      .then(VerifierAccount.decode)
      .catch((err) => this.throwAccountNotFoundError(err));
  }
}
