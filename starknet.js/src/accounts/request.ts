import { AccountNotFoundError } from "../error";
import { buildApproveFeeTokenCall, decode, encode } from "../internal/util";
import type { SwitchboardProgram } from "../SwitchboardProgram";

import { Account } from "./account";
import type { FunctionStatus } from "./function";
import { parseFunctionStatus } from "./function";

import { Big } from "@switchboard-xyz/common";
import _ from "lodash";
import type { AccountInterface, AllowArray, Call } from "starknet";
import { cairo, hash, num, type Result } from "starknet";

export type RequestAccountData = {
  id: string;
  authorityId: string;
  createdAt: number;
  updatedAt: number;
  functionId: string;
  params: string;
  paramsChecksum: string;
  startAfter: number;
  escrowId: string;
  lastExecutedAt: number;
  executed: boolean;
  consecutiveFailures: number;
  status: FunctionStatus;
  errorCode: number;
  balance: Big;
};

export type RequestCreateParams = {
  /**
   *  _OPTIONAL_ The id of the request.
   *
   *  If not provided, will be generated.
   */
  id?: string;
  /**
   *  The authority account for this request.
   */
  authorityId: string;
  /**
   *  The function that this request is attached to.
   */
  functionId: string;
  /**
   *  The params that the request is run with.
   */
  params?: Buffer;
  /**
   *  Run this request after a delay.
   */
  startAfter: number;
  /**
   *  The amount to fund this request with initially.
   *
   *  If not provided, will be initialized without funds.
   */
  initialFunding?: bigint;
  /**
   *  _OPTIONAL_ The escrow that the request is funded through.
   *
   *  If not provided, will be generated.
   */
  escrowId?: string;
};

export type RequestUpdateParams = {
  /**
   *  The id of the request to update.
   */
  id: string;
  /**
   *  The updated authority of the request.
   */
  authorityId?: string;
  /**
   *  The updated function that the request is attached to.
   */
  functionId?: string;
  /**
   *  The updated params that the request is run with.
   */
  params?: Buffer;
  /**
   *  Run this request after a delay.
   */
  startAfter?: number;
  /**
   *  _OPTIONAL_ The escrow that the request is funded through.
   *
   *  If not provided, will be generated.
   */
  escrowId?: string;
};

export class RequestAccount extends Account<RequestAccountData> {
  private static TAG = "RequestAccount";

  static decode(result: Result): RequestAccountData {
    return {
      id: decode.hex(result["id"]),
      authorityId: decode.address(result["authority"]),
      escrowId: decode.hex(result["escrow_account"]),
      functionId: decode.hex(result["function_id"]),
      createdAt: decode.timestamp(result["created_at"]),
      updatedAt: decode.timestamp(result["updated_at"]),
      params: result["params"].reduce(
        (res, cur) => res + decode.shortString(cur),
        ""
      ),
      paramsChecksum: decode.hex(result["params_checksum"]),
      startAfter: decode.number(result["start_after"]),
      lastExecutedAt: decode.timestamp(result["last_executed_at"]),
      executed: decode.bool(result["executed"]),
      consecutiveFailures: decode.number(result["consecutive_failures"]),
      status: parseFunctionStatus(result["status"].activeVariant()),
      errorCode: decode.number(result["error_code"]),
      balance: decode.big(result["balance"]),
    };
  }
  /**
   *  Build params to create a new {@linkcode RequestAccount}.
   *
   *  @returns AllowArray<Call>
   */
  static createTransaction(
    program: SwitchboardProgram,
    params: RequestCreateParams
  ): AllowArray<Call> {
    const transactions: Call[] = [
      {
        contractAddress: program.programAddress,
        entrypoint: "request_create",
        calldata: {
          params: {
            id: params.id ? encode.hex(params.id) : cairo.felt(0),
            authority: encode.hex(params.authorityId),
            function_id: encode.hex(params.functionId),
            params: encode.longString(params.params?.toString("utf8") ?? ""),
            start_after: encode.number(params.startAfter),
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
   *  Create and submit a transaction to create a new {@linkcode RequestAccount}.
   *
   *  @returns The newly created {@linkcode RequestAccount} and transaction hash.
   */
  static async create(
    program: SwitchboardProgram,
    payer: AccountInterface,
    params: RequestCreateParams
  ): Promise<[RequestAccount, string]> {
    const transaction = RequestAccount.createTransaction(program, params);
    const { transaction_hash } = await program.execute(payer, transaction);
    if (program.isVerbose) console.log("request_create", transaction_hash);

    // Wait for the transaction, and upon success, get the receipt to parse events from.
    const txnReceipt = await program.waitForTransaction(transaction_hash);
    // Parse the address from the RequestCreate event
    const eventNameHash = num.toHex(hash.starknetKeccak("RequestCreate"));
    for (const event of txnReceipt.events) {
      const keys = event.keys;
      if (keys.shift() !== eventNameHash) continue;
      const address = keys.shift();
      if (!address) continue;
      return [
        new RequestAccount(program, decode.hex(address)),
        transaction_hash,
      ];
    }
    throw new Error(
      `Failed to parse 'RequestCreate' event from tx. ${transaction_hash}. Check your explorer.`
    );
  }
  /**
   *  Load the {@linkcode RequestAccountData} for a request at the specified address.
   *
   *  @returns The {@linkcode RequestAccount} and its associated {@linkcode RequestAccountData}.
   */
  static async load(
    program: SwitchboardProgram,
    address: string
  ): Promise<[RequestAccount, RequestAccountData]> {
    const account = new RequestAccount(program, address);
    return [account, await account.loadData()];
  }

  private throwAccountNotFoundError(error: any): never {
    throw new AccountNotFoundError(RequestAccount.TAG, this.address, error);
  }

  /**
   *  Fetch the latest {@linkcode RequestAccountData} for this {@linkcode RequestAccount}.
   *
   *  @returns RequestAccountData
   */
  async loadData(): Promise<RequestAccountData> {
    const call = "view_request_get";
    const params = [encode.hex(this.address)];
    return await this.program.programContract
      .then((contract) => contract.call(call, params))
      .then((result) => {
        if (this.program.isVerbose) console.log(call, result);
        return result;
      })
      .then((result) => RequestAccount.decode(result))
      .catch((err) => this.throwAccountNotFoundError(err));
  }
  /**
   *  Build params to update the configuration of this {@linkcode RequestAccount}.
   *
   *  @returns Promise<AllowArray<Call>>
   */
  async updateTransaction(
    params: RequestUpdateParams
  ): Promise<AllowArray<Call>> {
    const current = await this.loadData();
    return {
      contractAddress: this.program.programAddress,
      entrypoint: "request_update",
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
          start_after: encode.number(params.startAfter ?? current.startAfter),
          escrow_account: encode.shortString(
            params.escrowId ?? current.escrowId
          ),
        },
      },
    };
  }
  /**
   *  Build params to contribute funds from this {@linkcode RequestAccount}.
   *
   *  @returns AllowArray<Call>
   */
  fundTransaction(amount: Big): AllowArray<Call> {
    return [
      buildApproveFeeTokenCall(amount, this.program.networkId),
      {
        contractAddress: this.program.programAddress,
        entrypoint: "request_fund",
        calldata: {
          routine_id: encode.hex(this.address),
          amount: encode.u256(amount.toString()),
        },
      },
    ];
  }
  /**
   *  Build params to withdraw funds from this {@linkcode RequestAccount}.
   *
   *  @returns AllowArray<Call>
   */
  withdrawTransaction(): AllowArray<Call> {
    return {
      contractAddress: this.program.programAddress,
      entrypoint: "request_withdraw",
      calldata: {
        request_id: encode.hex(this.address),
      },
    };
  }
}
