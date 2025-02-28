"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { formatAddress, getAddress, VerifyNetwork } from "../utils/helperFn";
import { chain } from "./constants";
import { connectors } from "../connectors";
import { Uniswap } from "./Uniswap";

export default function Header() {
  const [account, setAccount] = useState(null);
  // const [buyEarth, setBuyEarth] = useState(null);
  const pathname = usePathname();

  const [connector, hooks] = connectors[0]
  const isActive = hooks.useIsActive()
  console.log(connector, hooks);

  const connectWallet =async () => {
    if (isActive) {
     await connector.deactivate()
    } else {
      // connector.deactivate()
     await connector.activate()
    }
  }

  const connectWalletw = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const networkResult = await VerifyNetwork(chain);
        if (!networkResult) return
        const address = await window.ethereum.request({ method: "eth_requestAccounts" });
        localStorage.setItem('address', address[0])
        setAccount(address[0]);
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("Please install MetaMask.");
    }
  };

  useEffect(() => {
    const address = getAddress();
    setAccount(address)
  }, [])

  const disconnectWallet = () => {
    localStorage.clear();
    setAccount('')
  }

  return (
    <div>
      {/* Header */}
      <header className="flex items-center w-full justify-between px-8 py-4">
        {pathname === "/" ?

          <button className="text-[#000000] font-primary font-normal text-[13px]">HOW IT WORKS?</button>
          :
          <div className="flex justify-center items-center gap-5">
            <Link href="/">
              <button className="text-[#000000] font-normal font-primary text-[13px]">GO BACK</button>
            </Link>
            <button className="text-[#000000] font-normal font-primary text-[13px]">HOW IT WORKS?</button>
          </div>
        }

        <div className="flex gap-8">

          <Link href="/form">
            <button className="text-[#FF0000] font-normal font-primary text-[13px]">CREATE TOKEN</button>
          </Link>
          <div >
            <button
              // onClick={() => setBuyEarth(true)}
              className="text-[#FF0000] font-normal font-primary text-[13px]"> Buy $EARTH</button>
          </div>
       <Uniswap/>
          {/* {buyEarth && (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div
                className="absolute Uniswap w-[19rem] sm:w-[22rem] flex flex-col  border border-[#EAECF0]  shadow-lg gap-8 p-6  rounded-lg bg-white"
              >
                <SwapWidget
                  width={360}
                />
              </div>
            </div>
          )} */}

          

          <button className="text-[#000000] font-normal font-primary text-[13px]"
            onClick={account ? disconnectWallet : connectWallet}
          > {account ? formatAddress(account) : "CONNECT WALLET"}</button>
        </div>
      </header>
    </div>
  )
}