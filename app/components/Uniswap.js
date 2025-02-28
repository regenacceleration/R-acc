'use client'

import { AiOutlineLoading3Quarters } from "react-icons/ai";
import dynamic from "next/dynamic"
import { useActiveProvider } from "../connectors";
const SwapWidget = dynamic(async () => (await import("@dex-swap/widgets")).SwapWidget, {
	ssr: true,
	loading: () => <AiOutlineLoading3Quarters className="animate-spin" />,
})
const TOKEN_LIST = 'https://ipfs.io/ipns/tokens.uniswap.org'

const UNI = '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984'


export const RPC_LIST_ETH = [
	"https://eth.llamarpc.com",
	"https://eth.public-rpc.com",
	"https://rpc.builder0x69.io",
	"https://eth-mainnet.g.alchemy.com/v2/QWnDJnnZFRJSZABxedDHL1l1x2Y3c1aR",
];

export const getRPC = (chainId) => {
	let randomRPC;
	if (chainId == 1) {
		randomRPC = RPC_LIST_ETH[Math.floor(Math.random() * RPC_LIST_ETH.length)];
	}
	return randomRPC?.toString();
};

export function Uniswap() {
	if (typeof window !== "undefined") {
		// @ts-ignore
		window.Browser = {
			T: () => {
			}
		};
	}

	return (
		<main>
			<SwapWidget
				jsonRpcUrlMap={{
					1: ['https://eth.public-rpc.com']
				}}
				provider={useActiveProvider()}
				tokenList={TOKEN_LIST}
				defaultInputTokenAddress="NATIVE"
				defaultInputAmount="1"
				defaultOutputTokenAddress={UNI}
			/>
		</main>
	)
}