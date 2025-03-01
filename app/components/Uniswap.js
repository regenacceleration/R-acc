'use client'

import { AiOutlineLoading3Quarters } from "react-icons/ai";
import dynamic from "next/dynamic"
import { useActiveProvider } from "../connectors";
import { getAddress } from "../utils/helperFn";


const SwapWidget = dynamic(async () => (await import("@dex-swap/widgets")).SwapWidget, {
  ssr: true,
  loading: () => <AiOutlineLoading3Quarters className="animate-spin" />,
})

const TOKEN_LIST = 'https://ipfs.io/ipns/tokens.uniswap.org'
const UNI = '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984'

export const RPC_LIST_ETH = [
  "https://base-mainnet.infura.io/v3/4102c7bb5d0848bea41573a3aa7148b5",
];

export const getRPC = (chainId) => {
  let randomRPC;
  if (chainId == 1) {
    randomRPC = RPC_LIST_ETH[Math.floor(Math.random() * RPC_LIST_ETH.length)];
  }
  return randomRPC?.toString();
};

export function Uniswap(props) {
  if (typeof window !== "undefined") {
    // @ts-ignore
    window.Browser = {
      T: () => { }
    };
  }
  const MY_TOKEN_LIST = {
    name: "My Token List",
    timestamp: new Date().toISOString(),
    version: { major: 1, minor: 0, patch: 0 },
    tokens: [
      {
        "chainId": 1,
        "address": "0xB98d4C97425d9908E66E53A6fDf673ACcA0BE986",
        "name": "Arcblock",
        "symbol": "ABT",
        "decimals": 18,
        "logoURI": "https://assets.coingecko.com/coins/images/2341/thumb/arcblock.png?1547036543",
        "extensions": {
          "bridgeInfo": {
            "130": {
              "tokenAddress": "0xDDCe42b89215548beCaA160048460747Fe5675bC"
            },
            "8453": {
              "tokenAddress": "0xe2A8cCB00E328a0EC2204CB0c736309D7c1fa556"
            }
          }
        }
      },
      {
        "chainId": 1,
        "address": "0xADE00C28244d5CE17D72E40330B1c318cD12B7c3",
        "name": "Ambire AdEx",
        "symbol": "ADX",
        "decimals": 18,
        "logoURI": "https://assets.coingecko.com/coins/images/847/thumb/Ambire_AdEx_Symbol_color.png?1655432540",
        "extensions": {
          "bridgeInfo": {
            "56": {
              "tokenAddress": "0x6bfF4Fb161347ad7de4A625AE5aa3A1CA7077819"
            },
            "130": {
              "tokenAddress": "0x3e1C572d8b069fc2f14ac4f8bdCE6e8eA299A500"
            },
            "137": {
              "tokenAddress": "0xdDa7b23D2D72746663E7939743f929a3d85FC975"
            },
            "8453": {
              "tokenAddress": "0x3c87e7AF3cDBAe5bB56b4936325Ea95CA3E0EfD9"
            }
          }
        }
      },
    ],
  };
  return (
      <SwapWidget
        key={getAddress()}
        provider={useActiveProvider()}
      tokenList={'https://tokens.uniswap.org/'}
      // tokenList={{ tokens: MY_TOKEN_LIST }}
      // tokenList={{ token: MY_TOKEN_LIST }}
      // jsonRpcUrlMap={{ 8453: ['https://base-mainnet.infura.io/v3/4102c7bb5d0848bea41573a3aa7148b5']}}
      defaultChainId={8453}
      hideConnectionUI
      isWalletConnectedOverride
      defaultInputTokenAddress="NATIVE"
      defaultOutputTokenAddress="0x3c87e7AF3cDBAe5bB56b4936325Ea95CA3E0EfD9"
      // defaultInputAmount={}
      // defaultOutputAmount={}
      // defaultInputTokenAddress={}
    // defaultOutputTokenAddress={}
       {...props}
      />
  )
}