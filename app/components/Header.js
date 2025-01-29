"use client"
import { ethers } from "ethers";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Header() {
  const [account, setAccount] = useState(null);
  const pathname = usePathname();

  // Connect to the user's wallet
  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        // Request account access
        await window.ethereum.request({ method: "eth_requestAccounts" });
        setAccount("Connected");

        // Set up provider and signer
        const provider = new ethers.BrowserProvider(window.ethereum); // Updated to BrowserProvider
        const signer = await provider.getSigner();


        // Get and set the account address
        const address = await signer.getAddress();
        setAccount(address);
      } catch (error) {
        alert(`Error: ${error.message}`);
      }
    } else {
      alert("Please install MetaMask.");
    }
  };

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
            onClick={connectWallet}
          > {account ? "CONNECTED" : "CONNECT WALLET"}</button>
        </div>
      </header>
    </div>
  )
}