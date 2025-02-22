// import { getRequestContext } from '@cloudflare/next-on-pages'

import {
  encodeFunctionData,
  fallback,
  getAddress,
  parseUnits,
  parseGwei,
  PrepareTransactionRequestReturnType,
  Chain,
  http,
} from "viem";
import {
  createParaAccount,
  createParaViemClient,
} from "@getpara/viem-v2-integration";
import { Para as ParaServer, Environment } from "@getpara/server-sdk";
import { erc20Abi } from "abitype/abis";
import { env } from "@/lib/env.mjs";
import { sepolia } from "viem/chains";

const gasDefaults = {
  gas: 21000n,
  maxFeePerGas: parseGwei("20"),
  maxPriorityFeePerGas: parseGwei("3"),
};

export const runtime = "edge";

export async function POST(request: Request) {
  const { to, value, contractAddress, serializedSession, decimals } =
    (await request.json()) as {
      to: string;
      value: string;
      contractAddress: string;
      serializedSession: string;
      decimals: number;
    };


  const para = new ParaServer(Environment.BETA, env.PARA_API_KEY_BETA);
  await para.importSession(serializedSession);

  const viemParaAccount = createParaAccount(para);
  const viemClient = createParaViemClient(para, {
    account: viemParaAccount,
    chain: sepolia,
    transport: http(),
  });

  try {
    let request: PrepareTransactionRequestReturnType;

    if (contractAddress) {
      request = await viemClient.prepareTransactionRequest({
        account: viemParaAccount,
        to: getAddress(contractAddress),
        data: encodeFunctionData({
          abi: erc20Abi,
          functionName: "transfer",
          args: [getAddress(to), parseUnits(value, decimals)],
        }),
        chain: sepolia,
        ...gasDefaults,
      });
    } else {
      request = await viemClient.prepareTransactionRequest({
        account: viemParaAccount,
        to: getAddress(to),
        value: parseUnits(value, decimals),
        chain: sepolia,
        ...gasDefaults,
      });
    }

    console.log("txnRequest", request);
    const signatureResult = await viemClient.signTransaction(request);
    // const signatureResult = await viemClient.sendTransaction(request);
    console.log("hash", signatureResult);
    const txUrl = sepolia.blockExplorers?.default.url + "/tx/" + signatureResult;

    return new Response(
      JSON.stringify({ message: "ok", hash: signatureResult, txUrl: txUrl })
    );
  } catch (error) {
    console.error(
      "ERROR::createTransactionEVM — trying to create evm transaction - ",
      error
    );
    return new Response(
      JSON.stringify({
        message: error instanceof Error ? error.message : "error",
      }),
      { status: 500 }
    );
  }
}
