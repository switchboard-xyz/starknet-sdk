import { ISwitchboardProgram, TransactionOptions } from "../types.js";

import { BigNumber, ContractTransaction } from "ethers";
import { OracleQueueAccount } from "./OracleQueueAccount.js";
import { AttestationQueueAccount } from "./AttestationQueueAccount.js";

/**
 * @interface PermissionInitParams
 * @description Interface for the Permission initialization parameters
 */
export interface PermissionInitParams {
  grantee: string;
  granter: string;
  permission: number;
  enable?: boolean;
}

/**
 * @class Permissions
 * @description Class for interacting with Permissions in the Switchboard.sol and SwitchboardAttestationService.sol contracts.
 */
export class Permissions {
  private constructor() {}

  /**
   * @async
   * @function set
   * @description Static method to set permissions between a granter and a grantee
   *
   * @param switchboard - Instance of the {@linkcode SwitchboardProgram} class
   * @param granter - The account granting permissions
   * @param grantee - The account being granted permissions
   * @param permission - The type of permissions to grant
   * @param [enable] - Whether to enable the permissions
   * @param [options] - Transaction options
   *
   * @returns {Promise<ContractTransaction>} Promise that resolves to the ContractTransaction
   *
   * @example
   * const contractTransaction = await Permissions.set(switchboard, granter, grantee, permission, enable, options);
   */
  public static async set(
    switchboard: ISwitchboardProgram,
    granter: OracleQueueAccount | AttestationQueueAccount,
    grantee: string,
    permission: number,
    enable?: boolean,
    options?: TransactionOptions
  ): Promise<ContractTransaction> {
    const tx =
      granter instanceof AttestationQueueAccount
        ? await Permissions.setAttestationPermissions(
            switchboard,
            granter.address,
            grantee,
            permission,
            enable,
            options
          )
        : await Permissions.setSwitchboardPermissions(
            switchboard,
            granter.address,
            grantee,
            permission,
            enable,
            options
          );
    return tx;
  }

  /**
   * @async
   * @function has
   * @description Static method to determine whether a given grantee and granter have a set of permissions
   *
   * @param switchboard - Instance of the {@linkcode SwitchboardProgram} class
   * @param granter - The account granting permissions
   * @param grantee - The account being granted permissions
   * @param permission - The type of permissions to check
   *
   * @returns {Promise<boolean>} Promise that resolves to a boolean indicating whether the grantee and granter have the set of permissions
   *
   * @example
   * const hasPermissions = await Permissions.has(switchboard, granter, grantee, permission);
   */
  public static async has(
    switchboard: ISwitchboardProgram,
    granter: OracleQueueAccount | AttestationQueueAccount,
    grantee: string,
    permission: number
  ): Promise<boolean> {
    const tx =
      granter instanceof AttestationQueueAccount
        ? await Permissions.hasAttestationPermissions(
            switchboard,
            granter.address,
            grantee,
            permission
          )
        : await Permissions.hasSwitchboardPermissions(
            switchboard,
            granter.address,
            grantee,
            permission
          );
    return tx;
  }

  /**
   * @async
   * @function setSwitchboardPermissions
   * @description Static method to set permissions between a granter and a grantee
   *
   * @param switchboard - Instance of the Switchboard Program class
   * @param granter - The account granting permissions
   * @param grantee - The account being granted permissions
   * @param permission - The type of permissions to grant
   * @param [enable] - Whether to enable the permissions
   * @param [options] - Transaction options
   *
   * @returns {Promise<ContractTransaction>} Promise that resolves to the ContractTransaction
   *
   * @example
   * const contractTransaction = await Permissions.setSwitchboardPermissions(switchboard, granter, grantee, permission, enable, options);
   */
  public static async setSwitchboardPermissions(
    switchboard: ISwitchboardProgram,
    granter: string,
    grantee: string,
    permission: number,
    enable?: boolean,
    options?: TransactionOptions
  ): Promise<ContractTransaction> {
    const tx = await switchboard.sendSbTxn(
      "setPermission",
      [granter, grantee, BigNumber.from(permission), enable],
      options
    );
    return tx;
  }

  /**
   * @async
   * @function hasSwitchboardPermissions
   * @description Static method to determine whether a given grantee and granter have a set of permissions in Switchboard
   *
   * @param switchboard - Instance of the Switchboard Program class
   * @param granter - The account granting permissions
   * @param grantee - The account being granted permissions
   * @param permission - The type of permissions to check
   *
   * @returns {Promise<boolean>} Promise that resolves to a boolean indicating whether the grantee and granter have the set of permissions in Switchboard
   *
   * @example
   * const hasPermissions = await Permissions.hasSwitchboardPermissions(switchboard, granter, grantee, permission);
   */
  public static async hasSwitchboardPermissions(
    switchboard: ISwitchboardProgram,
    granter: string,
    grantee: string,
    permission: number
  ): Promise<boolean> {
    const hasPermissions = await switchboard.sb.hasPermission(
      granter,
      grantee,
      BigNumber.from(permission)
    );
    return hasPermissions;
  }

  /**
   * @async
   * @function setAttestationPermissions
   * @description Static method to set permissions between a granter and a grantee in Attestation
   *
   * @param switchboard - Instance of the Switchboard Program class
   * @param granter - The account granting permissions
   * @param grantee - The account being granted permissions
   * @param permission - The type of permissions to grant
   * @param [enable] - Whether to enable the permissions
   * @param [options] - Transaction options
   *
   * @returns {Promise<ContractTransaction>} Promise that resolves to the ContractTransaction
   *
   * @example
   * const contractTransaction = await Permissions.setAttestationPermissions(switchboard, granter, grantee, permission, enable, options);
   */
  public static async setAttestationPermissions(
    switchboard: ISwitchboardProgram,
    granter: string,
    grantee: string,
    permission: number,
    enable?: boolean,
    options?: TransactionOptions
  ): Promise<ContractTransaction> {
    const tx = await switchboard.sendVsTxn(
      "setPermission",
      [granter, grantee, BigNumber.from(permission), enable],
      options
    );
    return tx;
  }

  /**
   * @async
   * @function hasAttestationPermissions
   * @description Static method to determine whether a given grantee and granter have a set of permissions in Attestation
   *
   * @param switchboard - Instance of the Switchboard Program class
   * @param granter - The account granting permissions
   * @param grantee - The account being granted permissions
   * @param permission - The type of permissions to check
   *
   * @returns {Promise<boolean>} Promise that resolves to a boolean indicating whether the grantee and granter have the set of permissions in Attestation
   *
   * @example
   * const hasPermissions = await Permissions.hasAttestationPermissions(switchboard, granter, grantee, permission);
   */
  public static async hasAttestationPermissions(
    switchboard: ISwitchboardProgram,
    granter: string,
    grantee: string,
    permission: number
  ): Promise<boolean> {
    const hasPermissions = await switchboard.vs.hasPermission(
      granter,
      grantee,
      BigNumber.from(permission)
    );
    return hasPermissions;
  }
}
