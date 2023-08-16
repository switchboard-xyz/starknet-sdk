/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { ethers } from "ethers";
import {
  FactoryOptions,
  HardhatEthersHelpers as HardhatEthersHelpersBase,
} from "@nomiclabs/hardhat-ethers/types";

import * as Contracts from ".";

declare module "hardhat/types/runtime" {
  interface HardhatEthersHelpers extends HardhatEthersHelpersBase {
    getContractFactory(
      name: "ISwitchboard",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ISwitchboard__factory>;
    getContractFactory(
      name: "ReceiverExample",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ReceiverExample__factory>;
    getContractFactory(
      name: "Recipient",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Recipient__factory>;
    getContractFactory(
      name: "UserInitializedReceiverExample",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.UserInitializedReceiverExample__factory>;

    getContractAt(
      name: "ISwitchboard",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ISwitchboard>;
    getContractAt(
      name: "ReceiverExample",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ReceiverExample>;
    getContractAt(
      name: "Recipient",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Recipient>;
    getContractAt(
      name: "UserInitializedReceiverExample",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.UserInitializedReceiverExample>;

    // default types
    getContractFactory(
      name: string,
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<ethers.ContractFactory>;
    getContractFactory(
      abi: any[],
      bytecode: ethers.utils.BytesLike,
      signer?: ethers.Signer
    ): Promise<ethers.ContractFactory>;
    getContractAt(
      nameOrAbi: string | any[],
      address: string,
      signer?: ethers.Signer
    ): Promise<ethers.Contract>;
  }
}
