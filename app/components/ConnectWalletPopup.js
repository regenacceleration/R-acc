"use client"

import { AiOutlineClose } from "react-icons/ai";
import { Loader } from "./Loader";
import { useState } from "react";

export default function ConnectWallet({ isOpen, onClose, connectWallet }) {
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    setLoading(true);;
  };

  if (!isOpen) return null;
  return (
    <div>
        <div className="fixed inset-0 bg-black z-50 bg-opacity-60 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg shadow-lg w-80 h-44">
          <div className="flex justify-end" onClick={onClose}>
            <AiOutlineClose style={{cursor:"pointer"}} className="text-[#000000]"  size={20} />
            </div>
            <div className="flex flex-col gap-5 mt-5 items-center justify-center">
            <h3 className="text-[#000000] font-primary font-semibold text-[20px]">Connect your wallet</h3>
             <div className="flex justify-center">
              <button
                className="text-[#000000] w-full px-4 py-2  bg-gray-200 rounded-lg flex items-center justify-center gap-3 font-normal font-primary text-[16px]"
                onClick={connectWallet} 
              >
                {loading ? <Loader /> : "Continue"}
              </button>
            </div>
            </div>
           
          </div>
        </div>
    </div>
  )
}