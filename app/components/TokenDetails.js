"use client"
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Header from './Header';
import images from '../constants/images';
import { useParams } from 'next/navigation';
import { supabase } from '../services/supabase.js';
import { Loader } from './Loader';
import Link from 'next/link';
import { formatAddress, formatNumber } from '../utils/helperFn';
import env from '../constants/env';


export function TokenDetails() {
  const { id } = useParams();
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pairData, setPairData] = useState(null);
  const [holdersData, setHoldersData] = useState(null);
  const [holdersAmount, setHoldersAmount] = useState(null);
  const [activeTab, setActiveTab] = useState("description");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const headers = { 'x-api-key': env.coinBaseApiKey };

        // Fetch token first
        const { data: token, error } = await supabase.from("token").select("*").eq("id", id).single();
        if (error) {
          throw new Error(`Error fetching token details: ${error.message}`);
        }
        setToken(token);
        console.log("Fetched Token:", token);

        if (!token) throw new Error("Token not found");

        // API Requests based on the fetched token
        const [pairResponse, holdersResponse, holdersAmountResponse] = await Promise.all([
          fetch(`https://api.dexscreener.com/latest/dex/pairs/base/${token?.tokenAddress || env.tempContract}`),
          fetch(`https://api.chainbase.online/v1/token/top-holders?chain_id=8453&contract_address=${token?.tokenAddress || env.tempContract}&limit=10`, { method: 'GET', headers }),
          fetch(`https://api.chainbase.online/v1/token/metadata?contract_address=${token?.tokenAddress || env.tempContract}&chain_id=8453`, { method: 'GET', headers })
        ]);

        // Check if any request failed
        if (!pairResponse.ok || !holdersResponse.ok || !holdersAmountResponse.ok) {
          throw new Error('One or more network requests failed');
        }

        // Parse responses concurrently
        const [pairData, holdersData, holdersAmountData] = await Promise.all([
          pairResponse.json(),
          holdersResponse.json(),
          holdersAmountResponse.json()
        ]);

        // Update state
        setPairData(pairData);
        setHoldersData(holdersData);
        setHoldersAmount(holdersAmountData?.data?.total_supply);

        console.log('Pair Data:', pairData);
        console.log('Holders Data:', holdersData.data);
        console.log('Holders Amount:', holdersAmountData?.data?.total_supply);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id])

  return (

    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="flex w-full p-6">
        {/* Left Section */}
        {loading ?
          <div className="flex w-[50%] items-center justify-center h-64">
            <Loader className="text-[#7C7C7C]" size="text-7xl" />
          </div>
          :
          <div className='flex w-full flex-col'>
            <div className='flex items-center px-4 gap-6'>
              <div className='flex gap-3'>
                <img className="w-[50px] h-[50px] rounded-full border-[1px] border-[#D5D5D5]" src={token?.image} alt='racc' />
                <p className="text-[#000000] font-primary font-semibold text-[36px]">{token?.name}</p>
              </div>
              <div className='flex items-end mt-3 gap-3'>
                <p className="text-[#7C7C7C] font-normal text-[12px]">{formatAddress(token?.tokenAddress || env.tempContract)}</p>
                <div className="flex gap-6 items-end ">
                  <div className="flex gap-2 justify-center items-center">
                    <Image style={{ color: "#7C7C7C" }} width={40} alt="Token" height={40} src={images.website} className="w-[10px] h-[10px] flex items-center justify-center text-[#C7C7C7]" />
                    <Link href={token?.website} target='_blank'>
                      <p className="text-[#7C7C7C] font-normal font-secondary text-[12px]">Website</p>
                    </Link>

                  </div>
                  <div className="flex gap-2 justify-center items-center">
                    <Image style={{ color: "#7C7C7C" }} width={40} alt="Token" height={40} src={images.twitter} className="w-[10px] h-[10px] flex items-center justify-center text-[#C7C7C7]" />
                    <Link href={token?.twitter} target='_blank'>
                      <p className="text-[#7C7C7C] font-normal font-secondary text-[12px]">Twitter</p>
                    </Link>

                  </div>
                  <div className="flex gap-2 justify-center items-center">
                    <Image style={{ color: "#7C7C7C" }} width={40} alt="Token" height={40} src={images.telegram} className="w-[10px] h-[10px] flex items-center justify-center text-[#C7C7C7]" />
                    <Link href={token?.telegram} target='_blank'>
                      <p className="text-[#7C7C7C] font-normal font-secondary text-[12px]">Telegram</p>
                    </Link>

                  </div>
                </div>
              </div>
            </div>
            <div className='flex flex-col px-4  w-full'>
              <div className="w-full rounded-lg  ">
                <iframe
                  className="w-full h-fit bg-gray-100 min-h-[64vh] mt-4 rounded-lg"
                  src={`https://www.geckoterminal.com/base/pools/${token?.tokenAddress || env.tempContract}?embed=1&info=0&swaps=0&chart=1`}
                  frameBorder="0"
                ></iframe>
              </div>
              <div className='border-[1px] mt-4 border-[#D5D5D5]'>
                <div className=" flex justify-start items-start border-b border-[#D5D5D5] ">

                  <div>
                    <button
                      className={`flex-1 w-fit py-2 text-left font-secondary  p-4  border-r border-[#D5D5D5] font-normal ${activeTab === "description"
                        ? "  text-[18px] text-[#000000]"
                        : "text-[#D5D5D5] text-[18px]"
                        }`}
                      onClick={() => setActiveTab("description")}
                    >
                      DESCRIPTION
                    </button>
                  </div>
                  <div>
                    <button
                      className={`flex-1 w-fit py-2 text-left font-secondary  p-4  border-r border-[#D5D5D5] font-normal ${activeTab === "holders"
                        ? "  text-[18px] text-[#000000]"
                        : "text-[#D5D5D5] text-[18px]"
                        }`}
                      onClick={() => setActiveTab("holders")}
                    >
                      HOLDER DITRIBUTION ({holdersData?.count})
                    </button>
                  </div>
                </div>


                <div className="">
                  {activeTab === "description" ? (
                    <p className="text-[#000000] p-4 mt-4 font-primary text-left font-normal text-[12px] w-full">
                      {token?.description}
                    </p>
                  ) : (
                    <div >

                        {holdersData?.data && holdersData?.data?.length ?
                          holdersData?.data.map((holder, index) => (
                          <div key={index} className='flex p-4 justify-between'>
                            <div>
                              <p className='w-full text-left font-secondary text-[#7C7C7C] text-[18px]'>{formatAddress(holder?.wallet_address)}</p>
                            </div>
                            <div>
                              <p className='w-full text-left font-secondary text-[#7C7C7C] text-[18px]'>{((holder.original_amount / holdersAmount) * 100).toFixed(2)}%</p>
                            </div>
                          </div>
                        )) :
                        (<div className="flex col-start-2 justify-center items-center w-full py-4">
                          <p className="text-[#000000] font-primary font-normal text-[13px]">No Holders Available</p>
                        </div>
                        )}


                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        }

        {/* Right Section */}
        {loading ?
          <div className="flex w-[50%] items-center justify-center h-64">
            <Loader className="text-[#7C7C7C]" size="text-7xl" />

          </div>
          :
          <div className='flex w-[50%] mt-10 flex-col'>
            <iframe
              src={`https://app.uniswap.org/#/swap?exactField=input&exactAmount=${token?.earthToken}&inputCurrency=${token?.tokenAddress || env.tempContract}&theme=light`}
              width="100%"
              style={{
                height: "500px"
              }}
            // style="
            //   border: 0;
            //   margin: 0 auto;
            //   margin-bottom: .5rem;
            //   display: block;
            //   border-radius: 10px;
            //   max-width: 960px;
            //   min-width: 300px;
            // "
            />
            {/* <div
              style={{ borderRadius: "5px", cursor: "pointer" }}
              className="border-[1px] mt-6 border-[#D5D5D5] text-center bg-white relative"
            >


              
              <div className=" px-4 text-center">


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
            </div> */}

            <div className='flex justify-between gap-0 mt-4  border-[1px] border-[#D5D5D5]'>
              <div className=' px-4 py-1 border-r-[1px]  '>
                <p className='w-full text-center font-secondary text-[#7C7C7C] text-[12px] ' >5M</p>
                <p className='w-full text-center font-secondary text-[#DD4425] text-[18px]'>{`${pairData?.pair?.priceChange?.m5 || 0}%`}</p>
              </div>
              <div className=' px-4 py-1 border-r-[1px]  '>
                <p className='w-full text-center font-secondary text-[#7C7C7C] text-[12px] ' >1H</p>
                <p className='w-full text-center font-secondary text-[#DD4425] text-[18px]'>{`${pairData?.pair?.priceChange?.h1 || 0}%`}</p>
              </div>
              <div className=' px-4 py-1 border-r-[1px]  '>
                <p className='w-full text-center font-secondary text-[#7C7C7C] text-[12px] ' >6H</p>
                <p className='w-full text-center font-secondary text-[#DD4425] text-[18px]'>{`${pairData?.pair?.priceChange?.h6 || 0}%`}</p>
              </div>
              <div className=' px-4 py-1 '>
                <p className='w-full text-center font-secondary text-[#7C7C7C] text-[12px] ' >24H</p>
                <p className='w-full text-center font-secondary text-[#DD4425] text-[18px]'>{`${pairData?.pair?.priceChange?.h24 || 0}%`}</p>
              </div>
              {/* <p className='w-full font-secondary text-[#7C7C7C] text-[12px] p-2 border-r-[1px]'>Basescan</p>
            <p className='w-full font-secondary text-[#7C7C7C] text-[12px] p-2 border-r-[1px]'>Dexscreener</p>
            <p className='w-full font-secondary text-[#7C7C7C] text-[12px] p-2 '>Uniswap</p> */}
            </div>

            <div className='flex flex-col p-2  mt-4  border-[1px] border-[#D5D5D5]'>
              <div className='flex items-center justify-between'>
                <div className=' px-4 py-1  '>
                  <p className='w-full text-center font-secondary text-[#7C7C7C] text-[12px] ' >24H VOL</p>
                  <p className='w-full text-center font-secondary text-[#000000] text-[18px]'>${formatNumber(pairData?.pair?.volume?.h24)}</p>
                </div>
                <div className=' px-4 py-1  '>
                  <p className='w-full text-center font-secondary text-[#7C7C7C] text-[12px] ' >LIQUITITY</p>
                  <p className='w-full text-center font-secondary text-[#000000] text-[18px]'>${formatNumber(pairData?.pair?.liquidity?.usd)}</p>
                </div>
                <div className=' px-4 py-1  '>
                  <p className='w-full text-center font-secondary text-[#7C7C7C] text-[12px] ' >HOLDERS</p>
                  <p className='w-full text-center font-secondary text-[#000000] text-[18px]'>{holdersData?.count }</p>
                </div>
              </div>

              <div className='flex items-center  justify-between'>
                <div className=' px-4 py-1  '>
                  <p className='w-full text-center font-secondary text-[#7C7C7C] text-[12px] ' >AGE</p>
                  <p className='w-full text-center font-secondary text-[#000000] text-[18px]'>{Math.floor((new Date() - new Date(pairData?.pair?.pairCreatedAt)) / (1000 * 60 * 60 * 24)) || 0}days</p>
                </div>
                <div className=' px-4 py-1  '>
                  <p className='w-full text-center font-secondary text-[#7C7C7C] text-[12px] ' >FDV</p>
                  <p className='w-full text-center font-secondary text-[#000000] text-[18px]'>${formatNumber(pairData?.pair?.fdv)}</p>
                </div>
                <div className=' px-4 py-1  '>
                  <p className='w-full text-center font-secondary text-[#7C7C7C] text-[12px] ' >MARKET CAP</p>
                  <p className='w-full text-center font-secondary text-[#000000] text-[18px]'>${formatNumber(pairData?.pair?.marketCap)}</p>
                </div>
              </div>


            </div>

            <div className='flex flex-col p-4 gap-4 mt-4 border-[1px] border-[#D5D5D5]'>
              <div>
                <p className='w-full text-left font-secondary text-[#7C7C7C] font-normal text-[12px] ' >HOLDER DITRIBUTION ({holdersData?.count})</p>
              </div>
              <div >

                {holdersData?.data && holdersData?.data?.length ?
                  holdersData?.data?.map((holder, index) => (
                    <div key={index} className='flex p-4 justify-between'>
                      <div>
                        <p className='w-full text-left font-secondary text-[#7C7C7C] text-[18px]'>{formatAddress(holder?.wallet_address)}</p>
                      </div>
                      <div>
                        <p className='w-full text-left font-secondary text-[#7C7C7C] text-[18px]'>{((holder.original_amount / holdersAmount) * 100).toFixed(2)}%</p>
                      </div>
                    </div>
                  )) :
                  (<div className="flex col-start-2 justify-center items-center w-full py-4">
                    <p className="text-[#000000] font-primary font-normal text-[13px]">No Holders Available</p>
                  </div>
                  )}
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  );
}