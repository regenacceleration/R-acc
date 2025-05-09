"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {  useEffect, useRef, useState } from "react";
import { formatAddress, getAddress, VerifyNetwork } from "../utils/helperFn";
import { chain } from "./constants";
import { connectors } from "../connectors";
import { Uniswap } from "./Uniswap";
import ConnectWallet from "./ConnectWalletPopup";
import { useNotification } from "../hooks/useNotification";
import { networks } from "../constants/networks";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [account, setAccount] = useState(null);
  const [buyEarth, setBuyEarth] = useState(null);
  const pathname = usePathname();
  const modalRef = useRef(null);
  const [connectwallet, setConnectWallet] = useState(false);
  const [connector, hooks] = connectors[0];
  const isActive = hooks.useIsActive();
  const networkResult = hooks.useChainId();
  const address = hooks.useAccount();
  const { showMessage } = useNotification()
  const [pairedTokenAddress,setPairedTokenAddress]=useState('')
  const [isOpen, setIsOpen] = useState(false);


  const connectWallet = async () => {
    if (isActive) {
      localStorage.clear();
      setAccount('');
      window.location.reload()
    } else {
      // connector.deactivate()
      // connector.connectEagerly()
      connector.activate();
      setConnectWallet(false)
    }
  };

  useEffect(() => {
    if (address) {
      // if (networkResult !== 8453) return;
      localStorage.setItem("address", address);
      localStorage.setItem("chainId", networkResult);
      const networkFilter = networks.find(network => network.chainId === networkResult);
      setPairedTokenAddress(networkFilter?.[0]?.earthAddress)
      setAccount(address);
    }
    const storedAddress = getAddress();
    if (storedAddress && !isActive) {
      // connector.connectEagerly()
      connector.activate();
    }
  }, [address]);

  const connectWalletw = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const networkResult = await VerifyNetwork(chain);
        if (!networkResult) return;
        const address = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        localStorage.setItem("address", address[0]);
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
    setAccount(address);
  }, []);

  const disconnectWallet = () => {
    localStorage.clear();
    setAccount("");
  };

  // Close buyEarth modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setBuyEarth(false);
      }
    };

    if (buyEarth) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [buyEarth]);

  const handleBuy = () => {
    const storedAddress = getAddress();
    if (!storedAddress || !isActive) {
      // setConnectWallet(true);
      showMessage({type:'error',value:'Connect the wallet with BASE Network'})
      return;
    }
    setBuyEarth(true);
  };

  return (
    <div>
      {/* Header */}
      <header className='flex items-center w-full justify-between px-8 py-4'>
        {pathname === "/" ? (
          <button className='text-[#000000] font-primary font-normal text-[13px]'>
            HOW IT WORKS?
          </button>
        ) : (
          <div className='flex justify-center items-center gap-5'>
            <Link href='/'>
              <button className='text-[#000000] font-normal font-primary text-[13px]'>
                GO BACK
              </button>
            </Link>
            <button className='text-[#000000] font-normal font-primary text-[13px]'>
              HOW IT WORKS?
            </button>
          </div>
        )}



        <div className='hidden md:flex gap-8'>
          <Link href='/form'>
            <button className='text-[#FF0000] font-normal font-primary text-[13px]'>
              CREATE TOKEN
            </button>
          </Link>
          <div>
            <button
              onClick={handleBuy}
              className='text-[#FF0000] font-normal font-primary text-[13px]'
            >
              {" "}
              Buy $EARTH
            </button>
          </div>

         

          <button
            className='text-[#000000] font-normal font-primary text-[13px] hover:text-[#FF0000]'
            onClick={connectWallet}
          >
            {" "}
            {account ? formatAddress(account) : "CONNECT WALLET"}
          </button>
        </div>
        <button
        onClick={() => setIsOpen(!isOpen)}
        className='md:hidden text-black text-xl'
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      {isOpen && (
        <div className='md:hidden space-y-4 bg-white shadow-lg rounded-md p-4 z-50 absolute top-16 left-4 right-4'>
          <Link href='/form'>
            <button className='text-[#FF0000] font-normal font-primary text-[13px]'>
              CREATE TOKEN
            </button>
          </Link>
          <div>
            <button
              onClick={handleBuy}
              className='text-[#FF0000] font-normal font-primary text-[13px]'
            >
              {" "}
              Buy $EARTH
            </button>
          </div>
         
          <button
            className='text-[#000000] font-normal font-primary text-[13px] hover:text-[#FF0000]'
            onClick={connectWallet}
          >
            {" "}
            {account ? formatAddress(account) : "CONNECT WALLET"}
          </button>
        </div>
      )}
      </header>
      {buyEarth && (
            <div className='fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50'>
              <div ref={modalRef} className='absolute z-50 Uniswap sm:w-[30%]'>
                <Uniswap
                  defaultInputTokenAddress='NATIVE'
                  defaultOutputTokenAddress={pairedTokenAddress}
                />
              </div>
            </div>
          )}
      {connectwallet ? (
        <ConnectWallet
          isOpen={connectwallet}
          onClose={() => setConnectWallet(false)}
          connectWallet={connectWallet}
        />
      ) : null}
    </div>
  );
}
