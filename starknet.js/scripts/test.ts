import * as sb from "../src";

import { RpcProvider } from "starknet";

const nodeUrl =
  "https://starknet-goerli.g.alchemy.com/v2/hHVcjVS0egDnSYwSlc0_LtVHFROOh4jx";

(async () => {
  // Build the Switchboard program.
  const program = new sb.SwitchboardProgram(
    /* networkId= */ "goerli",
    new RpcProvider({ nodeUrl }),
    { isVerbose: true }
  );
  console.log();

  //
  //  AttestationQueue
  //
  const [account, accountData] = await sb.AttestationQueueAccount.load(
    program,
    "0x1"
  );
  console.log(account.address, accountData);
  console.log();

  const functionDatas = await account.loadActiveFunctionAccounts();
  console.log("Functions on queue:", functionDatas);
  console.log();

  //
  //  Verifier
  //
  // const [account2, accountData2] = await sb.VerifierAccount.load(
  //   program,
  //   "0x000000000000000000000000000000000000000000000000000000000000385"
  // );
  // console.log(account2.address, accountData2);
  // console.log();

  //
  //  Functions
  //
  const functionDatas2 = await sb.FunctionAccount.loadAll(program);
  console.log("All Functions:", functionDatas2);
  console.log();

  //
  //  Functions
  //
  const [functionAccount, functionData] = await sb.FunctionAccount.load(
    program,
    // "0x0383f263475579f0081c77e0ef28fbe0a23f0a4195ad5b99563238b7c294e479"
    "0x11097766dbccad5b09f019faf974955c33becfc36212f4776aed1ec52106d61"
  );
  console.log("Function:", functionData);
  console.log();

  const requestDatas1 = await functionAccount.loadRequests();
  console.log("Requests:", requestDatas1);
  console.log();

  const routineDatas1 = await functionAccount.loadRoutines();
  console.log("Routines:", routineDatas1);
  console.log();
})();
