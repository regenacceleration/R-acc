"use client"
import React, { useState } from 'react';
import { X, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import Header from './Header';
import images from '../constants/images';

export function TokenDetails() {
  const [token, setToken] = [{
    id: 1,
    name: "$SOIL",
    marketCap: "12.36 M",
    hodlers: "106,964",
    address: "0x1C4C...F463A3",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus velit diam, Nullam rhoncus laoreet.",
    telegram: images.telegram,
    twitter: images.twitter,
    website: images.website,
    coverPic: images.coverPic,
  }];
  return (

    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="flex w-full p-6">
        {/* Left Section */}
        <div className='flex w-[50%] flex-col'>
          <div
            key={token.id}
            style={{ borderRadius: "5px", cursor: "pointer" }}
            className="border-[1px] mt-6 border-[#D5D5D5] text-center bg-white relative"
            onClick={() => router.push(`/token/${token.id}`)}
          >
            <div className="flex justify-center items-center text-center">
              {/* Image and Main Info */}
              <div className="flex">
                <Image
                  width={40}
                  height={40}
                  src={token.coverPic}
                  alt="Token"
                  className="w-[80px] h-[80px] top-[-2.5rem] rounded-full border-[1px] border-[#D5D5D5] mb-4 absolute top-0 left-1/2 transform -translate-x-1/2"
                />
              </div>
            </div>

            {/* Description */}
            <div className="mt-12 px-4 text-center">
              <h2 className="text-[#000000] font-primary font-semibold text-[24px]">{token.name}</h2>
              <p className="text-[#7C7C7C] font-normal text-[12px]">{token.address}</p>
              {/* Action Icons */}
              <div className="flex gap-6 mt-4 items-center justify-center ">
                <div className="flex gap-2 justify-center items-center">
                  <Image style={{ color: "#7C7C7C" }} width={40} alt="Token" height={40} src={token.website} className="w-[10px] h-[10px] flex items-center justify-center text-[#C7C7C7]" />
                  <p className="text-[#7C7C7C] font-normal font-secondary text-[12px]">Website</p>
                </div>
                <div className="flex gap-2 justify-center items-center">
                  <Image style={{ color: "#7C7C7C" }} width={40} alt="Token" height={40} src={token.twitter} className="w-[10px] h-[10px] flex items-center justify-center text-[#C7C7C7]" />
                  <p className="text-[#7C7C7C] font-normal font-secondary text-[12px]">Twitter</p>
                </div>
                <div className="flex gap-2 justify-center items-center">
                  <Image style={{ color: "#7C7C7C" }} width={40} alt="Token" height={40} src={token.telegram} className="w-[10px] h-[10px] flex items-center justify-center text-[#C7C7C7]" />
                  <p className="text-[#7C7C7C] font-normal font-secondary text-[12px]">Telegram</p>
                </div>
              </div>
              <p className="text-[#000000] mt-4 px-8 font-primary font-normal text-[12px] w-full">
                {token.description}
              </p>
            </div>
            <div className="flex px-4 gap-3">
              <button style={{ borderRadius: "4px" }} className="w-full text-[#FFFFFF] mt-4 px-8 py-2 font-bold font-primary text-[14px] bg-[#39B906] ">BUY</button>
              <button style={{ borderRadius: "4px" }} className="w-full text-[#D5D5D5] mt-4 px-8 py-2 font-bold font-primary text-[14px] border-[1px] border-[#D5D5D5] ">SELL</button>

            </div>
            <div className='flex px-4 mt-4 justify-between items-center'>
              <p className='text-[#7C7C7C] font-normal font-secondary text-[12px]'>switch to $GEARTH</p>
              <p className='text-[#7C7C7C] font-normal font-secondary text-[12px]'>set max slippage</p>
            </div>
            <div className='px-4 mt-4'>
              <div className='flex px-4 py-2 border-[1px] border-[#D5D5D5]'>
                <input
                  type="text"
                  className=" w-full text-[14px] placeholder:font-secondary placeholder:text-[#7C7C7C]"
                  placeholder='0.00'
                />
                <div className='flex justify-center items-center gap-2'>
                  <p className='text-[#000000] font-primary text-[14px] font-bold'>$EARTH</p>
                  <Image
                    className="w-[20px] h-[20px]"
                    src={images.earthcoin} alt='coin' width={40} height={40} />
                </div>
              </div>
              <button style={{ borderRadius: "4px" }} className="w-full text-[#FFFFFF] mt-4 px-8 py-2 font-bold font-primary text-[14px] bg-[#39B906] ">PLACE TRADE</button>
            </div>

            <div className='px-4 flex flex-col gap-2 justify-center items-center mt-4'>
              <p className='text-[#000000] font-primary font-bold text-[13px]'>You will receive 0 $GEARTH</p>
              <p className='text-[#7C7C7C] font-secondary font-normal text-[12px]'>~0.00% of supply</p>
            </div>
            <div className='flex items-center px-4 mt-4  border-t-[1px] border-[#D5D5D5] justify-between'>
              <p className='w-full font-secondary text-[#7C7C7C] text-[12px] py-2 border-r-[1px]'>Basescan</p>
              <p className='w-full font-secondary text-[#7C7C7C] text-[12px] py-2 border-r-[1px]'>Dexscreener</p>
              <p className='w-full font-secondary text-[#7C7C7C] text-[12px] py-2 '>Uniswap</p>
            </div>
          </div>

          <div className='flex justify-between gap-0 mt-4  border-[1px] border-[#D5D5D5]'>
            <div className=' px-4 py-1 border-r-[1px]  '>
              <p className='w-full text-center font-secondary text-[#7C7C7C] text-[12px] ' >5M</p>
              <p className='w-full text-center font-secondary text-[#DD4425] text-[18px]'>8.48%</p>
            </div>
            <div className=' px-4 py-1 border-r-[1px]  '>
              <p className='w-full text-center font-secondary text-[#7C7C7C] text-[12px] ' >5M</p>
              <p className='w-full text-center font-secondary text-[#DD4425] text-[18px]'>8.48%</p>
            </div>
            <div className=' px-4 py-1 border-r-[1px]  '>
              <p className='w-full text-center font-secondary text-[#7C7C7C] text-[12px] ' >5M</p>
              <p className='w-full text-center font-secondary text-[#DD4425] text-[18px]'>8.48%</p>
            </div>
            <div className=' px-4 py-1 '>
              <p className='w-full text-center font-secondary text-[#7C7C7C] text-[12px] ' >5M</p>
              <p className='w-full text-center font-secondary text-[#DD4425] text-[18px]'>8.48%</p>
            </div>
            {/* <p className='w-full font-secondary text-[#7C7C7C] text-[12px] p-2 border-r-[1px]'>Basescan</p>
            <p className='w-full font-secondary text-[#7C7C7C] text-[12px] p-2 border-r-[1px]'>Dexscreener</p>
            <p className='w-full font-secondary text-[#7C7C7C] text-[12px] p-2 '>Uniswap</p> */}
          </div>

          <div className='flex flex-col p-2  mt-4  border-[1px] border-[#D5D5D5]'>
            <div className='flex justify-between'>
              <div className=' px-4 py-1  '>
                <p className='w-full text-center font-secondary text-[#7C7C7C] text-[12px] ' >24H VOL</p>
                <p className='w-full text-center font-secondary text-[#000000] text-[18px]'>$127.38M</p>
              </div>
              <div className=' px-4 py-1  '>
                <p className='w-full text-center font-secondary text-[#7C7C7C] text-[12px] ' >LIQUITITY</p>
                <p className='w-full text-center font-secondary text-[#000000] text-[18px]'>8.48%</p>
              </div>
              <div className=' px-4 py-1  '>
                <p className='w-full text-center font-secondary text-[#7C7C7C] text-[12px] ' >HOLDERS</p>
                <p className='w-full text-center font-secondary text-[#000000] text-[18px]'>$127.38M</p>
              </div>
            </div>

            <div className='flex  justify-between'>
              <div className=' px-4 py-1  '>
                <p className='w-full text-center font-secondary text-[#7C7C7C] text-[12px] ' >24H VOL</p>
                <p className='w-full text-center font-secondary text-[#000000] text-[18px]'>$127.38M</p>
              </div>
              <div className=' px-4 py-1  '>
                <p className='w-full text-center font-secondary text-[#7C7C7C] text-[12px] ' >LIQUITITY</p>
                <p className='w-full text-center font-secondary text-[#000000] text-[18px]'>8.48%</p>
              </div>
              <div className=' px-4 py-1  '>
                <p className='w-full text-center font-secondary text-[#7C7C7C] text-[12px] ' >HOLDERS</p>
                <p className='w-full text-center font-secondary text-[#000000] text-[18px]'>$127.38M</p>
              </div>
            </div>


          </div>
        </div>

        {/* Right Section */}
        <div className='flex flex-col p-4  w-full'>
          <div className="w-full rounded-lg  ">
            <iframe
              className="w-full h-fit bg-white min-h-[64vh] mt-4 rounded-lg"
              src="https://www.geckoterminal.com/base/pools/0xc68d5282c006bb9a174023dde84b8e22ea2e0f29?embed=1&info=0&swaps=0&chart=1"
              frameBorder="0"
            ></iframe>
          </div>
          <div className='flex flex-col p-4 gap-4 mt-4 border-[1px] border-[#D5D5D5]'>
            <div>
              <p className='w-full text-left font-secondary text-[#000000] text-[18px] ' >HOLDER DITRIBUTION</p>
            </div>
            <div className='flex justify-between'>

              <div className='  '>

                <p className='w-full text-left font-secondary text-[#7C7C7C] text-[18px] ' >Cb2rttt</p>
                <p className='w-full text-left font-secondary text-[#7C7C7C] text-[18px] ' >73dggy</p>
                <p className='w-full text-left font-secondary text-[#7C7C7C] text-[18px] ' >9332BH7UNN (dev)</p>
                <p className='w-full text-left font-secondary text-[#7C7C7C] text-[18px] ' >Cb2rttt</p>
                <p className='w-full text-left font-secondary text-[#7C7C7C] text-[18px] ' >73dggy</p>
                <p className='w-full text-left font-secondary text-[#7C7C7C] text-[18px] ' >9332BH7UNN (dev)</p>
              </div>
              <div className='  '>
                <p className='w-full text-left font-secondary text-[#7C7C7C] text-[18px] ' >5.12%</p>
                <p className='w-full text-left font-secondary text-[#7C7C7C] text-[18px] ' >5.12%</p>
                <p className='w-full text-left font-secondary text-[#7C7C7C] text-[18px] ' >5.12%</p>
                <p className='w-full text-left font-secondary text-[#7C7C7C] text-[18px] ' >5.12%</p>
                <p className='w-full text-left font-secondary text-[#7C7C7C] text-[18px] ' >5.12%</p>
                <p className='w-full text-left font-secondary text-[#7C7C7C] text-[18px] ' >5.12%</p>

              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}