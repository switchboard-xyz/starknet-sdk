import type { StarknetNetworkId } from "./types";
import { getProgramAddress } from "./util";

import type { AccountInterface, AllowArray, Call, RpcProvider } from "starknet";
import { CallData, Contract } from "starknet";

type SwitchboardOptions = {
  readonly programAddressOverride?: string;
  readonly isVerbose?: boolean;
};
/**
 * Wrapper class for the Switchboard Program.
 *
 * This class provides an interface to interact with the Switchboard program on the Starknet network.
 * It allows you to load the program, create and initialize connection objects, and interact with
 * Switchboard accounts.
 *
 * Basic usage example:
 *
 * ```ts
 * import { SwitchboardProgram } from '@switchboard-xyz/starknet.js';
 * import { RpcProvider } from 'starknet';

 * const rpcProvider: RpcProvider = ...
 * const program = new SwitchboardProgram('goerli-alpha', rpcProvider);
 * ```
 */
export class SwitchboardProgram {
  private _programContract: Promise<Contract> | undefined;

  /**
   *  Constructor
   */
  constructor(
    readonly networkId: StarknetNetworkId,
    readonly provider: RpcProvider,
    readonly options?: SwitchboardOptions
  ) {}
  /**
   *  Returns the address to the Switchboard program for this {@linkcode networkId}.
   */
  get programAddress(): string {
    if (this.options?.programAddressOverride) {
      return this.options.programAddressOverride;
    } else if (this.networkId === "localhost") {
      throw new Error(
        "The `programAddressOverride` parameter is required when running on localhost"
      );
    }
    return getProgramAddress(this.networkId);
  }
  /**
   *  Loads the Switchboard contract if needed and returns it.
   */
  get programContract(): Promise<Contract> {
    return (this._programContract ??= (async () => {
      const programAddress = this.programAddress;
      const contract = await this.provider
        .getClassAt(programAddress)
        .then((resp) => new Contract(resp.abi, programAddress, this.provider));
      return contract;
    })());
  }
  /**
   *  Whether logging should be verbose.
   */
  get isVerbose(): boolean {
    return Boolean(this.options?.isVerbose);
  }
  /**
   *  Execute all of the transactions using the signer {@linkcode AccountInterface}.
   */
  async execute(account: AccountInterface, transactions: AllowArray<Call>) {
    // Transform the transactions into Calls.
    const compiledTransactions = (
      Array.isArray(transactions) ? transactions : [transactions]
    ).map<Call>((transaction) => ({
      contractAddress: transaction.contractAddress,
      entrypoint: transaction.entrypoint,
      calldata: CallData.compile(transaction.calldata ?? {}),
    }));
    // Compute the max fee before sending the calls.
    const maxFee = account.estimateInvokeFee
      ? await account
          .estimateInvokeFee(compiledTransactions)
          .then(({ suggestedMaxFee }) => suggestedMaxFee)
          .catch(() => undefined)
      : undefined;
    // Execute the calls and return the transaction hash
    return await account.execute(
      /* transactions= */ compiledTransactions,
      /* abis= */ undefined,
      /* transactionsDetail= */ { maxFee, version: 1 }
    );
  }

  async waitForTransaction(
    /**
     *  The txn hash to wait for.
     */
    txHash: string,
    options?: {
      /**
       *  Retry interval every {@linkcode retryInterval} milliseconds.
       *
       *  Default: 5_000ms
       */
      retryInterval: number;
    }
  ) {
    type ReceiptResponse = Awaited<
      ReturnType<typeof this.provider.getTransactionReceipt>
    >;

    const retryInterval = Math.max(options?.retryInterval ?? 5_000, 1_000);
    const isVerbose = this.isVerbose;
    if (isVerbose) console.log("Waiting for transaction...", txHash);

    const _internalCallWithRetry = async (
      attempt: number
    ): Promise<ReceiptResponse> =>
      await Promise.resolve()
        .then(async () => {
          const receipt = await Promise.race([
            this.provider.getTransactionReceipt(txHash),
            new Promise<null>((_, rej) =>
              setTimeout(() => rej("Timed out waiting for receipt."), 3_000)
            ),
          ])
            .then((receipt) => receipt ?? undefined)
            .catch(() => undefined);
          if (isVerbose) {
            console.log(
              `Checking txn status (${attempt}):`,
              `execution_status=${receipt?.execution_status}`,
              `finality_status=${receipt?.finality_status}`
            );
          }
          if (receipt?.execution_status) {
            return receipt;
          } else if (receipt?.finality_status === "ACCEPTED_ON_L1") {
            return receipt;
          } else if (receipt?.finality_status === "ACCEPTED_ON_L2") {
            return receipt;
          } else throw new Error("Txn status not yet complete.");
        })
        .catch(async (error) => {
          if (attempt >= 50) throw error;
          await new Promise((r) => setTimeout(r, retryInterval));
          return _internalCallWithRetry(attempt + 1);
        });
    const status = await _internalCallWithRetry(0);
    if (isVerbose) {
      console.log(
        `Final txn status:`,
        `execution_status=${status.execution_status}`,
        `finality_status=${status.finality_status}`
      );
    }
    return status;
  }
}
