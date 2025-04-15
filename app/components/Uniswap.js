'use client'

import { AiOutlineLoading3Quarters } from "react-icons/ai";
import dynamic from "next/dynamic"
import { useActiveProvider } from "../connectors";
import { getAddress } from "../utils/helperFn";
import { pairedTokenAddress } from "./constants";
import { useEffect, useRef, useState } from "react";
import { ethers } from "ethers";


// const SwapWidget = dynamic(async () => (await import("@dex-swap/widgets")).SwapWidget, {
//   ssr: true,
//   loading: () => {
    
//     return <AiOutlineLoading3Quarters className="animate-spin w-full flex items-center justify-center" />
//   },
// })

export const RPC_LIST_ETH = [
  "https://base-mainnet.infura.io/v3/4102c7bb5d0848bea41573a3aa7148b5",
];

const widgetUrl = 'https://app.uniswap.org/'

export const getRPC = (chainId) => {
  let randomRPC;
  if (chainId == 1) {
    randomRPC = RPC_LIST_ETH[Math.floor(Math.random() * RPC_LIST_ETH.length)];
  }
  return randomRPC?.toString();
};

export function Uniswap(props) {

  const iframeRef = useRef(null);

  if (typeof window !== "undefined") {
    // @ts-ignore
    window.Browser = {
      T: () => { }
    };
  }

  const [outputToken,setOutputToken]=useState('')

  const MY_TOKEN= [
    {
      "name": "EARTH",
      "address": pairedTokenAddress,
      "symbol": "EAR",
      "decimals": 18,
      "chainId": 8453,
      "logoURI": "https://polygonscan.com/token/images/solarpunkdao_32.png"
    },
  ]
  
 
  useEffect(() => {
    if (props?.token) {
      MY_TOKEN.push(props?.token)
      setOutputToken(props?.token?.address)
    }
  },[props.token,getAddress()])
    
    useEffect(() => {
      if (typeof window !== "undefined" && props.setIsLoaded) {
        setTimeout(() => {
          props.setIsLoaded(false)
        },1000)
      };
    }, []);

  // useEffect(() => {
  //   const observer = new MutationObserver(() => {
  //     document.querySelectorAll("[class^='TokenOptions__OnHover']").forEach((el) => el.remove());
  //   });
  //   observer.observe(document.body, { childList: true, subtree: true });

  //   return () => observer.disconnect();
  // }, []);


  useEffect(() => {
    if (!window.ethereum) {
      console.error('MetaMask is not installed');
      return;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const reloadWidget = () => {
      iframeRef.current?.contentWindow?.postMessage(
        { target: 'swapWidget', method: 'reload' },
        widgetUrl
      );
    };

    provider.send('eth_requestAccounts', []).then(() => {
      if (iframeRef.current) {
        iframeRef.current.addEventListener('load', () => {
          console.log('dd');
          
          iframeRef.current.contentWindow.postMessage(
            {
              target: 'swapWidget',
              method: 'setConfig',
              payload: {
                jsonRpcEndpoint: RPC_LIST_ETH[0],
                tokenList: MY_TOKEN,
              },
            },
            widgetUrl
          );
        });
      }

      const handleMessage = (e) => {
        if (e.origin !== widgetUrl || !e.data.jsonrpc || !provider.getSigner()) return;
        const request = e.data.method;
        console.log(request);
        
        provider.send(request?.method, request?.params || []).then((result) => {
          iframeRef.current?.contentWindow?.postMessage(
            {
              jsonrpc: e.data.jsonrpc,
              id: e.data.id,
              result,
            },
            widgetUrl
          );
        });
      };

      const handleAccountsChanged = () => reloadWidget();
      const handleNetworkChanged = () => reloadWidget();

      window.addEventListener('message', handleMessage);
      provider.provider.on('accountsChanged', handleAccountsChanged);
      provider.provider.on('networkChanged', handleNetworkChanged);

      return () => {
        window.removeEventListener('message', handleMessage);
        provider.provider.removeListener('accountsChanged', handleAccountsChanged);
        provider.provider.removeListener('networkChanged', handleNetworkChanged);
      };
    });
  }, []);

  return (
    <iframe
      ref={iframeRef}
      src={`https://app.uniswap.org/#/swap?outputCurrency=${props?.defaultOutputTokenAddress}&inputCurrency=${props?.defaultInputTokenAddress}`}
      height="500px"
      width="100%"
   
    />
      // <SwapWidget
      // key={getAddress() + JSON.stringify(props?.token)}
      // jsonRpcUrlMap={{8453:new ethers.providers.JsonRpcProvider(RPC_LIST_ETH?.[0])}}
      // provider={useActiveProvider()}

      // tokenList={MY_TOKEN}
      // // defaultChainId={8453}
      
      // hideConnectionUI
      // isWalletConnectedOverride
      // defaultOutputTokenAddress={props?.defaultOutputTokenAddress || outputToken }
      // width="100%"
      //  {...props}
      // />
  )
}