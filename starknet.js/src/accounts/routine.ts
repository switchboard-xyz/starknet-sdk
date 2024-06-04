import { AccountNotFoundError } from "../error";
import { buildApproveFeeTokenCall, decode, encode } from "../internal/util";
import type { SwitchboardProgram } from "../SwitchboardProgram";

import { Account } from "./account";

import { Big, parseCronSchedule } from "@switchboard-xyz/common";
import _ from "lodash";
import type { AccountInterface, AllowArray, Call } from "starknet";
import { cairo, hash, num, type Result } from "starknet";

const statuses = [
  "None",
  "Active",
  "NonExecutable",
  "Expired",
  "OutOfFunds",
  "InvalidPermissions",
  "Deactivated",
  "NotReady",
] as const;

const parseRoutineStatus = (status: any): RoutineStatus => {
  if (statuses.includes(status)) return status;
  throw new Error(`Unknown RoutineStatus: ${status}`);
};

export type RoutineStatus = (typeof statuses)[number];

export type RoutineAccountData = {
  id: string;
  authorityId: string;
  createdAt: number;
  updatedAt: number;
  schedule: string;
  functionId: string;
  params: string;
  paramsChecksum: string;
  escrowId: string;
  consecutiveFailures: number;
  status: RoutineStatus;
  errorCode: number;
  lastExecutedAt: number;
  balance: Big;
};

export type RoutineCreateParams = {
  /**
   *  _OPTIONAL_ The id of the routine.
   *
   *  If not provided, will be generated.
   */
  id?: string;
  /**
   *  The authority account for this routine.
   */
  authorityId: string;
  /**
   *  The function that this routine is attached to.
   */
  functionId: string;
  /**
   *  The params that the routine is run with.
   */
  params?: Buffer;
  /**
   *  The cron schedule that the routine will be run on.
   */
  schedule: string;
  /**
   *  The amount to fund this routine with initially.
   *
   *  If not provided, will be initialized without funds.
   */
  initialFunding?: bigint;
  /**
   *  _OPTIONAL_ The escrow that the routine is funded through.
   *
   *  If not provided, will be generated.
   */
  escrowId?: string;
};

export type RoutineUpdateParams = {
  /**
   *  The id of the routine to update.
   */
  id: string;
  /**
   *  The updated authority of the routine.
   */
  authorityId?: string;
  /**
   *  The updated function that the routine is attached to.
   */
  functionId?: string;
  /**
   *  The updated params that the routine is run with.
   */
  params?: Buffer;
  /**
   *  The updated cron schedule that the routine will be run on.
   */
  schedule?: string;
  /**
   *  The updated escrow that the routine is funded through.
   */
  escrowId?: string;
};

export class RoutineAccount extends Account<RoutineAccountData> {
  private static TAG = "RoutineAccount";
  /**
   *  Given a {@linkcode Result}, try to decode into {@linkcode RoutineAccountData}.
   */
  static decode(result: Result): RoutineAccountData {
    return {
      id: decode.hex(result["id"]),
      authorityId: decode.address(result["authority"]),
      functionId: decode.hex(result["function_id"]),
      escrowId: decode.hex(result["escrow_account"]),
      createdAt: decode.timestamp(result["created_at"]),
      updatedAt: decode.timestamp(result["updated_at"]),
      schedule: decode.shortString(result["schedule"]),
      params: result["params"].reduce(
        (res, cur) => res + decode.shortString(cur),
        ""
      ),
      paramsChecksum: decode.hex(result["params_checksum"]),
      consecutiveFailures: decode.number(result["consecutive_failures"]),
      status: parseRoutineStatus(result["status"].activeVariant()),
      errorCode: decode.number(result["error_code"]),
      lastExecutedAt: decode.timestamp(result["last_executed_at"]),
      balance: decode.big(result["balance"]),
    };
  }
  /**
   *  Build params to create a new {@linkcode RoutineAccount}.
   *
   *  @returns AllowArray<Call>
   */
  static createTransaction(
    program: SwitchboardProgram,
    params: RoutineCreateParams
  ): AllowArray<Call> {
    const transactions: Call[] = [
      {
        contractAddress: program.programAddress,
        entrypoint: "routine_create",
        calldata: {
          params: {
            id: params.id ? encode.hex(params.id) : cairo.felt(0),
            authority: encode.hex(params.authorityId),
            function_id: encode.hex(params.functionId),
            params: encode.longString(params.params?.toString("utf8") ?? ""),
            schedule: encode.shortString(parseCronSchedule(params.schedule)),
            initial_funding: params.initialFunding
              ? encode.u256(params.initialFunding.toString())
              : encode.u256(0),
            escrow_account: params.escrowId
              ? encode.hex(params.escrowId)
              : cairo.felt(0),
          },
        },
      },
    ];
    if (params.initialFunding) {
      const amount = Big(params.initialFunding.toString());
      transactions.unshift(buildApproveFeeTokenCall(amount, program.networkId));
    }
    return transactions;
  }
  /**
   *  Create and submit a transaction to create a new {@linkcode RoutineAccount}.
   *
   *  @returns The newly created {@linkcode RoutineAccount} and transaction hash.
   */
  static async create(
    program: SwitchboardProgram,
    payer: AccountInterface,
    params: RoutineCreateParams
  ): Promise<[RoutineAccount, string]> {
    const transaction = RoutineAccount.createTransaction(program, params);
    const { transaction_hash } = await program.execute(payer, transaction);
    if (program.isVerbose) console.log("routine_create", transaction_hash);

    // Wait for the transaction, and upon success, get the receipt to parse events from.
    const txnReceipt = await program.waitForTransaction(transaction_hash);
    // Parse the address from the RoutineCreate event
    const eventNameHash = num.toHex(hash.starknetKeccak("RoutineCreate"));
    for (const event of txnReceipt.events) {
      const keys = event.keys;
      if (keys.shift() !== eventNameHash) continue;
      const address = keys.shift();
      if (!address) continue;
      return [
        new RoutineAccount(program, decode.hex(address)),
        transaction_hash,
      ];
    }
    throw new Error(
      `Failed to parse 'RoutineCreate' event from tx. ${transaction_hash}. Check your explorer.`
    );
  }
  /**
   *  Load the {@linkcode RoutineAccountData} for a routine at the specified address.
   *
   *  @returns The {@linkcode RoutineAccount} and its associated {@linkcode RoutineAccountData}.
   */
  static async load(
    program: SwitchboardProgram,
    address: string
  ): Promise<[RoutineAccount, RoutineAccountData]> {
    const account = new RoutineAccount(program, address);
    return [account, await account.loadData()];
  }

  private throwAccountNotFoundError(error: any): never {
    throw new AccountNotFoundError(RoutineAccount.TAG, this.address, error);
  }

  /**
   *  Fetch the latest {@linkcode RoutineAccountData} for this {@linkcode RoutineAccount}.
   *
   *  @returns RoutineAccountData
   */
  async loadData(): Promise<RoutineAccountData> {
    const call = "view_routine_get";
    const params = [encode.hex(this.address)];
    return await this.program.programContract
      .then((contract) => contract.call(call, params))
      .then((result) => {
        if (this.program.isVerbose) console.log(call, result);
        return result;
      })
      .then((result) => RoutineAccount.decode(result))
      .catch((err) => this.throwAccountNotFoundError(err));
  }
  /**
   *  Build params to update the configuration of this {@linkcode RoutineAccount}.
   *
   *  @returns Promise<AllowArray<Call>>
   */
  async updateTransaction(
    params: RoutineUpdateParams
  ): Promise<AllowArray<Call>> {
    const current = await this.loadData();
    return {
      contractAddress: this.program.programAddress,
      entrypoint: "routine_update",
      calldata: {
        params: {
          id: encode.hex(this.address),
          authority: encode.hex(params.authorityId ?? current.authorityId),
          function_id: encode.shortString(
            params.functionId ?? current.functionId
          ),
          params: encode.shortString(
            params.params?.toString("utf8") ?? current.params
          ),
          schedule: params.schedule
            ? encode.shortString(parseCronSchedule(params.schedule))
            : encode.shortString(current.schedule),
          escrow_account: encode.shortString(
            params.escrowId ?? current.escrowId
          ),
        },
      },
    };
  }
  /**
   *  Build params to contribute funds from this {@linkcode RoutineAccount}.
   *
   *  @returns AllowArray<Call>
   */
  fundTransaction(amount: Big): AllowArray<Call> {
    return [
      buildApproveFeeTokenCall(amount, this.program.networkId),
      {
        contractAddress: this.program.programAddress,
        entrypoint: "routine_fund",
        calldata: {
          routine_id: encode.hex(this.address),
          amount: encode.u256(amount.toString()),
        },
      },
    ];
  }
  /**
   *  Build params to withdraw funds from this {@linkcode RoutineAccount}.
   *
   *  @returns AllowArray<Call>
   */
  withdrawTransaction(): AllowArray<Call> {
    return {
      contractAddress: this.program.programAddress,
      entrypoint: "routine_withdraw",
      calldata: {
        routine_id: encode.hex(this.address),
      },
    };
  }
}
