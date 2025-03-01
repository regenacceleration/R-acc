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

  const tokenList = [
    {
      chainId: 1,
      address: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8',
      symbol: 'ETH',
      name: 'Ethereum',
      decimals: 18,
    },
    {
      chainId: 1,
      address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
      symbol: 'UNI',
      name: 'Uniswap',
      decimals: 18,
    },
  ];

  return (
      <SwapWidget
        key={getAddress()}
        provider={useActiveProvider()}
      tokenList={tokenList}
      
      hideConnectionUI
      isWalletConnectedOverride
      defaultInputTokenAddress="0x2170Ed0880ac9A755fd29B2688956BD959F933F8"
      defaultOutputTokenAddress='0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984'
      // defaultInputAmount={}
      // defaultOutputAmount={}
      // defaultInputTokenAddress={}
    // defaultOutputTokenAddress={}
       {...props}
      />
  )
}