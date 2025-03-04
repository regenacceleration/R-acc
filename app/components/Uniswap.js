'use client'

import { AiOutlineLoading3Quarters } from "react-icons/ai";
import dynamic from "next/dynamic"
import { useActiveProvider } from "../connectors";
import { getAddress } from "../utils/helperFn";
import { pairedTokenAddress } from "./constants";
import { useEffect } from "react";


const SwapWidget = dynamic(async () => (await import("@dex-swap/widgets")).SwapWidget, {
  ssr: true,
  loading: () => {
    
    return <AiOutlineLoading3Quarters className="animate-spin w-full flex items-center justify-center" />
  },
})

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

  const MY_TOKEN= [
    {
      "name": "EARTH",
      "address": pairedTokenAddress,
      "symbol": "ETH",
      "decimals": 18,
      "chainId": 8453,
      "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png"
    },
  ]
  
 
  useEffect(() => {
    if (props.token) {
      MY_TOKEN.push(props?.token)
    }
  },[props.token])
    
    useEffect(() => {
      if (typeof window !== "undefined" && props.setIsLoaded) {
        setTimeout(() => {
          props.setIsLoaded(false)
        },1000)
      };
    }, []);


  return (
      <SwapWidget
      key={getAddress() + JSON.stringify(props?.token)}
      provider={useActiveProvider()}
      tokenList={MY_TOKEN}
      defaultChainId={8453}
      hideConnectionUI
      isWalletConnectedOverride
      width="100%"
       {...props}
      />
  )
}