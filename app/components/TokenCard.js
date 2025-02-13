"use client"
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import images from "../constants/images";
import { useEffect, useState } from "react";

export default function TokenCard({ tokens }) {
    const router = useRouter();
    const [pairData, setPairData] = useState(null);
    const [count, setCount] = useState(null);

    const formatNumber = (value) => {
        if (value === undefined || value === null || isNaN(value)) {
            return "0"; // Default fallback for undefined, null, or NaN values
        }

        if (value >= 1_000_000_000) {
            return (value / 1_000_000_000).toFixed(2) + "B"; // Convert to Billions
        } else if (value >= 1_000_000) {
            return (value / 1_000_000).toFixed(2) + "M"; // Convert to Millions
        } else if (value >= 1_000) {
            return (value / 1_000).toFixed(2) + "K"; // Convert to Thousands
        } else {
            return value.toFixed(2); // Show exact value for smaller numbers
        }
    };

    console.log(formatNumber(5454))


    useEffect(() => {
        const fetchPairData = async () => {
            if (tokens) {
                console.log(tokens?.tokenAddress)
                try {
                    const response = await fetch(
                        `https://api.dexscreener.com/latest/dex/pairs/base/0x98730ea1372cac37d593bdd1067fda983f1c7138`
                    );
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    const data = await response.json();
                    setPairData(data);
                    console.log(data)
                } catch (err) {
                    console.log(err.message);
                }
            }
        };

        fetchPairData();
    }, [tokens]);

    useEffect(() => {
        const fetchDataHolders = async () => {
            try {
                const response = await fetch('https://api.chainbase.online/v1/token/top-holders?chain_id=8453&contract_address=0x98730ea1372cac37d593bdd1067fda983f1c7138&limit=10', {
                    method: 'GET',
                    headers: {
                        'x-api-key': '2syikWKlAOSUjNJQpqYCvaqLUlj'
                    }
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setCount(data.count)
                console.log(data.count)
            } catch (error) {
                console.error('There was a problem with the fetch operation:', error);
            }
        };

        fetchDataHolders()
    }, [tokens]);

    return (
        <div
            className="grid grid-cols-1 md:grid-cols-3 p-8 gap-x-4 gap-y-16">

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
                                <p className="text-[#000000] font-secondary font-normal text-[13px]">{formatNumber(pairData?.pair?.marketCap)}</p>
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
                                <p className="text-[#000000] font-secondary font-normal text-[13px]">{count}</p>
                                <p className="text-[#7C7C7C] font-secondary font-normal text-[13px]">Hodlers</p>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mt-2 text-center">
                            <h2 className="text-[#000000] font-primary font-semibold text-[24px]">{token.name}</h2>
                            <p className="text-[#7C7C7C] font-secondary font-normal text-[13px]">{token.address}</p>
                            {/* Action Icons */}
                            <div className="flex gap-4 mt-2 items-center justify-center ">
                                <Link href={token.website} target='_blank'>
                                    <Image width={40} alt="Token" height={40} src={images.website} className="w-[12px] h-[12px] flex items-center justify-center text-[#C7C7C7]" />
                                </Link>

                                <Link href={token.twitter} target='_blank'>
                                    <Image width={40} alt="Token" height={40} src={images.twitter} className="w-[12px] h-[12px] flex items-center justify-center text-[#C7C7C7]" />
                                </Link>

                                <Link href={token.telegram} target='_blank'>
                                    <Image width={40} alt="Token" height={40} src={images.telegram} className="w-[12px] h-[12px] flex items-center justify-center text-[#C7C7C7]" />
                                </Link>
                            </div>
                            <p className="text-[#000000] font-primary mt-4 px-4 font-normal text-[13px] w-full">
                                {token.description}
                            </p>
                        </div>

                    </div>
                )) :
                (<div className="flex col-start-2 justify-center items-center w-full py-4">
                    <p className="text-[#000000] font-primary font-normal text-[13px]">No Tokens Available</p>
                </div>
                )}
        </div>
    )
}