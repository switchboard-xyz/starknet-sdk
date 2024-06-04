import type { SwitchboardProgram } from "./SwitchboardProgram";

import _ from "lodash";
import { type Event, hash, num } from "starknet";

export type EventCallback = (e: Event) => Promise<void>;

/**
 *  Poll Events on Starknet
 *
 *  _NOTE: uncleared setTimeout calls will keep processes from ending organically (SIGTERM is needed)_
 */
export class StarknetEvent {
  private _lastBlockNumber = Number.NaN;
  private _intervalId?: NodeJS.Timer;

  constructor(
    readonly program: SwitchboardProgram,
    readonly eventHandlerName: string,
    readonly pollIntervalMs: number = 5_000
  ) {}

  private get lastBlockNumber() {
    if (Number.isFinite(this._lastBlockNumber)) return this._lastBlockNumber;
    throw new Error("Block number has not yet been initialized.");
  }

  private set lastBlockNumber(blockNumber: number) {
    this._lastBlockNumber = blockNumber;
  }

  /**
   *  Start a poller to listen for the specified events.
   */
  async onTrigger(
    callback: EventCallback,
    errorHandler?: (error: unknown) => void
  ): Promise<StarknetEvent> {
    // If any current interval that might be running.
    clearInterval(this._intervalId);

    // Set the latest block number.
    try {
      this.lastBlockNumber = await this.program.provider
        .getBlockLatestAccepted()
        .then((result) => result.block_number);
    } catch (error) {
      console.error("Unable to retrieve block number:", error);
    }

    const handleError = (error) => {
      if (errorHandler) errorHandler(error);
      throw error;
    };

    this._intervalId = setInterval(async () => {
      try {
        const keys = this.eventHandlerName
          ? [[num.toHex(hash.starknetKeccak(this.eventHandlerName))]]
          : [[]];
        const { events } = await this.program.provider.getEvents({
          from_block: _.isFinite(this.lastBlockNumber)
            ? { block_number: this.lastBlockNumber + 1 }
            : undefined,
          chunk_size: 500,
          keys,
        });
        const newBlockNumber = _.last(events)?.block_number;
        if (newBlockNumber) this.lastBlockNumber = newBlockNumber;
        events.forEach((event) => callback(event).catch(handleError));
      } catch (error) {
        handleError(error);
      }
    }, this.pollIntervalMs);
    return this;
  }

  stop() {
    this._intervalId && clearInterval(this._intervalId);
  }
}
