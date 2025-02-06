"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { formatAddress, getAddress } from "../utils/helperFn";

export default function Header() {
  const [account, setAccount] = useState(null);
  const pathname = usePathname();

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
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

        <div className="flex gap-10">

          <Link href="/form">
            <button className="text-[#FF0000] font-normal font-primary text-[13px]">CREATE TOKEN</button>
          </Link>
          <button className="text-[#000000] font-normal font-primary text-[13px]"
            onClick={account ? disconnectWallet : connectWallet}
          > {account ? formatAddress(account) : "CONNECT WALLET"}</button>
        </div>
      </header>
    </div>
  )
}