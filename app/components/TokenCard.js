"use client"
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import images from "../constants/images";
import { useEffect, useState } from "react";
import env from "../constants/env";
import { explorer, formatAddress, formatNumber, validateAndFormatUrl } from "../utils/helperFn";

export default function TokenCard({ tokens }) {
    return (
        <div
            className="grid w-full grid-cols-1 md:grid-cols-3 p-8 gap-x-4 gap-y-16 mt-10">
            {tokens && tokens.length  ?
                tokens.map((token) => (
                    <IndToken token={token} key={token?.id}  />
                )) :
                (<div className="flex col-start-2 justify-center items-center w-full py-4">
                    <p className="text-[#000000] font-primary font-normal text-[13px]">No Tokens Available</p>
                </div>
                )}
        </div>
    )
}


function IndToken({token})
{
    const [pairData, setPairData] = useState(null);
    const [count, setCount] = useState(null);
    const router = useRouter();

    const urlObj = {
        twitter: validateAndFormatUrl(token?.twitter),
        telegram: validateAndFormatUrl(token?.telegram),
        website: validateAndFormatUrl(token?.website),
    }

   
    useEffect(() => {
        const fetchData = async () => {
            try {
                const headers = { 'x-api-key': env.coinBaseApiKey };

                const [holdersResponse, pairResponse] = await Promise.all([
                    fetch(`https://api.chainbase.online/v1/token/top-holders?chain_id=8453&contract_address=${token.tokenAddress || env.tempContract}&limit=10`, { method: 'GET', headers }),
                    fetch(`https://api.dexscreener.com/tokens/v1/base/${token.tokenAddress || env.tempContract}`)
                ]);

                if (!holdersResponse.ok || !pairResponse.ok) {
                    throw new Error('One or both network requests failed');
                }

                const [holdersData, pairData] = await Promise.all([
                    holdersResponse.json(),
                    pairResponse.json()
                ]);

                setCount(holdersData.count);
                setPairData(pairData);

                console.log('Holders count:', holdersData.count);
                console.log('Pair data:', pairData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [token.id]);

    return (
        
    <div
       style={{ borderRadius: "5px", cursor: "pointer" }}
                        className="border-[1px] border-[#D5D5D5] p-4 text-center bg-white relative"
            onClick={() => window.open(`/token/${token?.id}`,'_blank')}
        
    >
        
        <div className="flex justify-between items-center text-center">
            {/* Market Cap */}
            <div className="flex flex-col justify-start items-start">
                    <p className="text-[#000000] font-secondary font-normal text-[13px]">{ pairData?.marketCap ? "$" + pairData?.marketCap : "N/A"}</p>
                <p className="text-[#7C7C7C] font-secondary font-normal text-[13px]">Market Cap</p>
            </div>

            {/* Image and Main Info */}
            <div className="flex">
                <img
                    className="w-[80px] h-[80px]  rounded-full border-[1px] border-[#D5D5D5] mb-4 absolute -top-10 left-1/2 transform -translate-x-1/2"
                    src={token?.image} />
            </div>

            {/* Holders */}
            <div className="flex flex-col justify-start items-start">
                <p className="text-[#000000]   font-secondary font-normal text-[13px]">{count || 0}</p>
                <p className="text-[#7C7C7C] font-secondary font-normal text-[13px]">Holders</p>
            </div>
        </div>

        {/* Description */}
        <div className="mt-6 text-center">
            <h2 className="text-[#000000] font-primary font-semibold text-[24px]">{token?.name}</h2>
            <Link href={explorer(token.tokenAddress)} target="_blank" className="text-[#7C7C7C] font-secondary font-normal text-[13px] hover:text-black">{formatAddress(token.tokenAddress || env.tempContract)}</Link>
            {/* Action Icons */}
            <div className="flex gap-4 mt-2 items-center justify-center ">
               {urlObj.website? <Link href={urlObj.website} target='_blank'>
                    <Image width={40} alt="Token" height={40} src={images.website} className="w-[12px] h-[12px] flex items-center justify-center text-[#C7C7C7]" />
                </Link>:null}

                {urlObj.twitter?<Link href={urlObj?.twitter} target='_blank'>
                    <Image width={40} alt="Token" height={40} src={images.twitter} className="w-[12px] h-[12px] flex items-center justify-center text-[#C7C7C7]" />
                </Link>:null}

                {urlObj.telegram?<Link href={urlObj?.telegram} target='_blank'>
                    <Image width={40} alt="Token" height={40} src={images.telegram} className="w-[12px] h-[12px] flex items-center justify-center text-[#C7C7C7]" />
                </Link>:null}
            </div>
            <p className="text-[#000000] font-primary mt-4 px-4 font-normal text-[13px] w-full">
                {token?.description}
            </p>
        </div>

    </div>
    )
}