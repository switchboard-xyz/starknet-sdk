import type { SwitchboardProgram } from "../SwitchboardProgram";

export abstract class Account<T> {
  /**
   *  Account constructor
   *
   *  @param program SwitchboardProgram
   *  @param address Hex string address of the account
   */
  constructor(readonly program: SwitchboardProgram, readonly address: string) {}
  /**
   *  Retrieve and decode the data in this account.
   */
  abstract loadData(): Promise<T>;
}
