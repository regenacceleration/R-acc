"use client"
import Header from "@/app/components/Header";
import { Loader } from "@/app/components/Loader";
import images from "@/app/constants/images";
import { supabase } from "@/app/services/supabase.js";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";


export default function Home() {
  const router = useRouter();
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchToken = async () => {
      setLoading(true)
      const { data, error } = await supabase.from('token').select('*');
      if (error) console.error('Error fetching data:', error);
      else 
      setLoading(false)
      setTokens(data);
    };
    
    fetchToken();
  }, []);

  // const tokens = [
  //   {
  //     id: 1,
  //     name: "$SOIL",
  //     marketCap: "12.36 M",
  //     hodlers: "106,964",
  //     address: "0x1C4C...F463A3",
  //     description:
  //       "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus velit diam, Nullam rhoncus laoreet.",
  //       telegram : images.telegram ,
  //       twitter : images.twitter,
  //       website :images.website,
  //       coverPic : images.coverPic,
  //   },
  //   {
  //     id: 2,
  //     name: "$FIYAH",
  //     marketCap: "12.36 M",
  //     hodlers: "106,964",
  //     address: "0x1C4C...F463A3",
  //     description:
  //       "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus velit diam, Nullam rhoncus laoreet.",
  //       telegram : images.telegram ,
  //       twitter : images.twitter,
  //       website :images.website,
  //       coverPic : images.coverPic,
  //   },
  //   {
  //     id: 3,
  //     name: "$GEARTH",
  //     marketCap: "12.36 M",
  //     hodlers: "106,964",
  //     address: "0x1C4C...F463A3",
  //     description: "We got Girth ;)",
  //     telegram : images.telegram ,
  //       twitter : images.twitter,
  //       website :images.website,
  //       coverPic : images.coverPic,
  //   },
  // ];

  return (
    <div className="min-h-screen bg-gray-50 ">
      {/* Header */}
      <Header />
      {/* <header className="flex items-center w-full justify-between px-8 py-4">
        <button className="text-[#000000] font-normal text-[13px]">HOW IT WORKS?</button>
        <div className="flex gap-10">
         <Link href="/form">
         <button className="text-[#FF0000] font-normal text-[13px]">CREATE TOKEN</button>
         </Link>
          <button className="text-[#000000] font-normal text-[13px]">CONNECT WALLET</button>
        </div>
      </header> */}

      <div className="flex flex-col mt-[1rem] justify-center items-center">
        <h1 className="text-[#000000] font-primary font-black text-[68px]">r/acc</h1>
        <p className="text-[#7F7F7F] font-normal text-[17px] font-primary ">degen to regen pipeline</p>
        <div className="flex justify-center mt-[2rem] gap-3 w-full items-end">
          <input
            type="text"
            className="border-b-[1px]  w-[28%] bg-gray-50 border-[#D5D5D5] rounded px-4 py-2"
          />
          <button className="text-[#000000] font-normal font-primary text-[13px]">SEARCH</button>
        </div>

      </div>


      {/* Navigation */}
      <div className="flex mt-[3rem]  mb-10 justify-center items-center">
        <nav className="flex justify-center items-center w-[95%] border-y-[1px] border-gray-300 px-8 py-4">
          <button className="text-[#FF0000] font-normal font-primary text-[13px] px-4">FEATURED</button>
          <button className="text-[#000000] font-normal font-primary text-[13px] px-4">MARKET CAP</button>
          <button className="text-[#000000] font-normal font-primary text-[13px] px-4">HODLERS</button>
          <button className="text-[#000000] font-normal font-primary text-[13px] px-4">DATE</button>
          <button className="text-[#000000] font-normal font-primary text-[13px] px-4">TRENDING</button>
        </nav>
      </div>


      {/* Token Cards */}
      {loading ?
        <div className="flex items-center justify-center h-64">
          <Loader className="text-[#7C7C7C]" size="text-6xl" />
        </div>
        :
        <div className="grid grid-cols-1 md:grid-cols-3 p-8 gap-4">

          {tokens.length > 0 ?
            tokens.map((token) => (
              <div
                key={token.id}
                style={{ borderRadius: "5px", cursor: "pointer" }}
                className="border-[1px] border-[#D5D5D5] p-4 text-center bg-white relative"
                onClick={() => router.push(`/token/${token.id}`)}
              >
                <div className="flex justify-between items-center text-center">
                  {/* Market Cap */}
                  <div className="flex flex-col justify-start items-start">
                    <p className="text-[#000000] font-secondary font-normal text-[13px]">12.36 M</p>
                    <p className="text-[#7C7C7C] font-secondary font-normal text-[13px]">Market Cap</p>
                  </div>

                  {/* Image and Main Info */}
                  <div className="flex">
                    <img
                      className="w-[80px] h-[80px] top-[-2.5rem] rounded-full border-[1px] border-[#D5D5D5] mb-4 absolute top-0 left-1/2 transform -translate-x-1/2"
                      src={token.image} />
                    {/* <Image
                  width={40}
                  height={40}
                  src={token.coverPic}
                  alt="Token"
                  className="w-[80px] h-[80px] top-[-2.5rem] rounded-full border-[1px] border-[#D5D5D5] mb-4 absolute top-0 left-1/2 transform -translate-x-1/2"
                /> */}

                  </div>

                  {/* Hodlers */}
                  <div className="flex flex-col justify-start items-start">
                    <p className="text-[#000000] font-secondary font-normal text-[13px]">106,964</p>
                    <p className="text-[#7C7C7C] font-secondary font-normal text-[13px]">Hodlers</p>
                  </div>
                </div>

                {/* Description */}
                <div className="mt-2 text-center">
                  <h2 className="text-[#000000] font-primary font-semibold text-[24px]">{token.name}</h2>
                  <p className="text-[#7C7C7C] font-secondary font-normal text-[13px]">{token.address}</p>
                  {/* Action Icons */}
                  <div className="flex gap-4 mt-2 items-center justify-center ">
                    <Image width={40} alt="Token" height={40} src={images.website} className="w-[12px] h-[12px] flex items-center justify-center text-[#C7C7C7]" />

                    <Image width={40} alt="Token" height={40} src={images.twitter} className="w-[12px] h-[12px] flex items-center justify-center text-[#C7C7C7]" />

                    <Image width={40} alt="Token" height={40} src={images.telegram} className="w-[12px] h-[12px] flex items-center justify-center text-[#C7C7C7]" />


                  </div>
                  <p className="text-[#000000] font-primary mt-4 px-4 font-normal text-[13px] w-full">
                    {token.description}
                  </p>
                </div>

              </div>
            )) :
            (<div className="text-center py-4">
              No Tokens Available
            </div>
            )}
        </div>
      }
    </div>
  );
}
