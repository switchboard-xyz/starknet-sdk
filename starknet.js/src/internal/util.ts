import type { StarknetNetworkId } from "../types";
import { getProgramAddress } from "../util";

import { Big } from "@switchboard-xyz/common";
import _ from "lodash";
import type { BigNumberish, Call } from "starknet";
import { addAddressPadding, cairo, num, shortString, uint256 } from "starknet";

export const decode = {
  address: (bn: any) => addAddressPadding(decode.hex(bn)),
  big: (bn: any) => Big(num.toBigInt(bn).toString()),
  bool: (obj: any) => Boolean(obj),
  hex: (bn: any) => num.toHexString(bn),
  number: (bn: any) => Number(num.toBigInt(bn)),
  shortString: (bn: any) =>
    bn ? shortString.decodeShortString(decode.hex(bn)).replace(/\0/g, "") : "",
  timestamp: (bn: any) => decode.number(bn),
};

export const encode = {
  shortString: (value: string) => {
    const toEncode = _.first(shortString.splitLongString(value));
    return toEncode ? shortString.encodeShortString(toEncode) : cairo.felt(0);
  },
  longString: (value: string) =>
    shortString.splitLongString(value).map(encode.shortString),
  hex: (value: string) => num.toHex(value),
  u256: (value: BigNumberish) => uint256.bnToUint256(value),
  number: (value: number) => cairo.felt(value),
  bool: (value: boolean) => num.toCairoBool(value),
};

export const buildApproveFeeTokenCall = (
  amount: Big,
  network: StarknetNetworkId
): Call => {
  return {
    contractAddress:
      "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
    entrypoint: "approve",
    calldata: {
      spender: encode.hex(getProgramAddress(network)),
      amount: encode.u256(amount.toString()),
    },
  };
};
