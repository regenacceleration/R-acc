"use client";
import { useEffect, useState } from "react";
import Header from "./Header";
import Link from "next/link";
import { supabase } from "../services/supabase.js";
import { BtnLoader } from "./Loader";
import { useRouter } from "next/navigation";
import { useNotification } from "../hooks/useNotification";
import { networks } from "../constants/networks";
import { createToken } from "../action";
import LogInHeader from "./LogInHeader";
import useImgApi from "../hooks/useImgApi";
import images from "../constants/images";
import Image from "next/image";
import { validateUrl } from "../utils/helperFn";


export function CreateTokenDetails() {
  const [formData, setFormData] = useState({
    tokenAddress: "",
    address: "",
    network: "",
    name: "",
    ticker: "",
    description: "",
    image: "",
    telegram: "",
    twitter: "",
    website: "",
    totalSupply: "",
    tokenSymbol: "",
    positionId: "",
    lockerAddress: "",
    earthToken: "",
    imported:"",
    poolAddress:""
  });
  const { apiFn, loading: imgLoading } = useImgApi();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { showMessage } = useNotification();
  const [img, setImg] = useState("");

  const [errors, setErrors] = useState({
    tokenAddress: "",
    address: "",
    network: "",
    name: "",
    ticker: "",
    description: "",
    image: "",
    telegram: "",
    twitter: "",
    website: "",
    totalSupply: "",
    tokenSymbol: "",
    positionId: "",
    lockerAddress: "",
    earthToken: "",
    imported:"",
    poolAddress:""
  });


  const validateForm = () => {
    const newErrors = {};

    // if (!formData.walletAddress) newErrors.walletAddress = "WalletAddress is required";
    if (!formData.tokenAddress) newErrors.tokenAddress = "TokenAddress is required";
    if (!formData.network) newErrors.network = "Network is required";
    if (!formData.poolAddress) newErrors.poolAddress = "PoolAddress is required";
        if (formData.telegram && !validateUrl(formData.telegram)) newErrors.telegram = "Invalid Url";
        if (formData.twitter && !validateUrl(formData.twitter)) newErrors.twitter = "Invalid Url";
        if (formData.website && !validateUrl(formData.website)) newErrors.website = "Invalid Url";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];

    setImg(file);
    const { response, error: Error } = await apiFn({
      file: file,
    });
    setFormData((data) => ({ ...data, image: response }));
    if (Error) {
      console.log(Error);
      setLoading(false);
      setErrors((errors) => ({ ...errors, image: Error }));
      return;
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!validateForm()) return;
      
      setLoading(true);
      const networkFilter = networks.find(network => network.displayName === formData?.network);
      
      const dexScreenerUrl = `https://api.dexscreener.com/tokens/v1/${networkFilter?.chainName}/${formData?.tokenAddress}`
      const response = await fetch(dexScreenerUrl);
      const userData = await response.json();
      

      if (userData && !userData.length)
      {
        showMessage({
          type: "error",
          value: "Token Data Not found",
        });
        setLoading(false);
        return
      }

      const { data, error } = await createToken({
        tokenAddress: formData?.tokenAddress,
        poolAddress:formData?.poolAddress,
        imported: true,
        address: userData[0]?.baseToken?.address,
        network: userData[0]?.chainId,
        name: userData[0]?.baseToken?.name,
        ticker: null,
        description: formData.description,
        image: userData[0]?.info?.imageUrl || formData?.image,
        telegram: userData[0]?.info?.socials[1]?.url || formData?.telegram,
        twitter: userData[0]?.info?.socials[0]?.url || formData?.twitter,
        website: userData[0]?.info?.websites[0]?.url || formData.website,
        totalSupply: userData[0]?.marketCap,
        tokenSymbol: userData[0]?.baseToken?.symbol,
        positionId: null,
        lockerAddress: null,
        earthToken: null,
      });
      if (error) {
        console.log(error);
        showMessage({
          type: "error",
          value: error?.message,
        });
        return
      };
      
      showMessage({
        type: "success",
        value: "Token Deployed Successfully",
      });
      setFormData({
        tokenAddress: "",
        address: "",
        poolAddress:"",
        network: "",
        // name: "",
        // ticker: "",
        // description: "",
        // image: "",
        // telegram: "",
        // twitter: "",
        // website: "",
        // totalSupply: "",
        // tokenSymbol: "",
        // positionId: "",
        // lockerAddress: "",
        // earthToken: "",
      });
      router.push("/");
    } catch (error) {
      showMessage({
        type: "error",
        value: "Error occurred",
      });
      console.log("Error inserting data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full  bg-gray-50">
      <LogInHeader />
      <div className="flex flex-col h-full items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="space-y-6 px-8 md:px-0 w-full md:w-[450px] text-black">


          <div>
            <label className=" font-normal font-primary text-[13px] text-[#000000]">TOKEN ADDRESS</label>
            <input
              type="text"
              value={formData.tokenAddress}
              onChange={(e) => setFormData({ ...formData, tokenAddress: e.target.value })}
              className="  w-full  outline-none font-primary border-b-[1px] px-2 bg-gray-50 border-[#D5D5D5]  "
            />
            {errors.tokenAddress && <p className="text-red-500 text-sm ">{errors.tokenAddress}</p>}
          </div>

          <div>
            <label className=" font-normal font-primary text-[13px] text-[#000000]">POOL ADDRESS</label>
            <input
              type="text"
              value={formData.poolAddress}
              onChange={(e) => setFormData({ ...formData, poolAddress: e.target.value })}
              className="  w-full  outline-none font-primary border-b-[1px] px-2 bg-gray-50 border-[#D5D5D5]  "
            />
            {errors.poolAddress && <p className="text-red-500 text-sm ">{errors.poolAddress}</p>}
          </div>

          <div className="w-full">
            <label className=" font-normal font-primary text-[13px]  text-[#000000]">WALLET ADDRESS</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full bg-gray-50 outline-none font-primary border-[#D5D5D5]  border-b-[1px]    "
            />
            {errors.address && <p className="text-red-500 text-sm ">{errors.address}</p>}
          </div>
                    <div>
                      <label className=" font-normal font-primary text-[13px] text-[#000000]">IMAGE</label>
                      <div className="relative flex flex-col  w-full   border-b-[1px] px-2 bg-gray-50 border-[#D5D5D5]">
                        {/* {selectedImage ? (
                          <img src={selectedImage} alt="Uploaded Preview" className="w-full h-40 object-cover rounded-md" />
                        ) : (
                          <p className="text-gray-600">IMAGE</p>
                        )} */}
                        <div className="absolute bottom-2 flex items-center justify-between w-[90%]">
                          <p className=" text-black font-primary text-xs min-w-[90%] whitespace-nowrap text-ellipsis overflow-hidden">{formData?.image ? img?.name : ""}</p>
                          {imgLoading ? <BtnLoader /> : formData?.image && <Image className="w-5 h-5 " width={40} height={40} alt="upload" src={formData?.image} />}
                        </div>
          
                        <label htmlFor="upload" type="button" className="absolute right-2 cursor-pointer bottom-2  transition">
                          <Image className="w-[22px] h-[22px]" width={40} height={40} alt="upload" src={images.upload} />
                        </label>
                        <input id="upload" type="file" accept="image/*" className="opacity-0 cursor-pointer" onChange={handleImageChange} />
                      </div>
                      {errors.image && <p className="text-red-500 text-sm ">{errors.image}</p>}
          </div>
          
          <div className="w-full">
            <label className=" font-normal font-primary text-[13px]  text-[#000000]">DESCRIPTION</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="outline-none font-primary px-2  w-full  resize-none  border-[1px] bg-gray-50 border-[#D5D5D5]  "
              rows={3}
            />
            {errors.description && <p className="text-red-500 text-sm ">{errors.description}</p>}
          </div>
          <div className="flex flex-col gap-2">
            <label className=" font-normal font-primary text-[13px] text-[#000000]">NETWORK</label>
            <select
              className="w-[100%] mx-auto p-2 bg-white-200 rounded-2xl pl-6 placeholder:text-black text-sm sm:text-sm text-left border border-[#787070] opacity-70 focus:opacity-100"
              name="network"
              id="network"
              value={formData?.network}
              onChange={(e) => setFormData({ ...formData, network: e.target.value })}
            >
              <option value="">-- Select Network type--</option>
              {networks.map((option, index) => (
                <option key={index} value={option.displayName}>{option.displayName}</option>
              ))}
            </select>
            {errors.network && <p className="text-red-500 text-sm ">{errors.network}</p>}
          </div>
          
          <div>
            <label className=" font-normal font-primary text-[13px] text-[#000000]">TELEGRAM</label>
            <input
              type="text"
              value={formData.telegram}
              onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
              className="  w-full outline-none font-primary  border-b-[1px] px-2 bg-gray-50 border-[#D5D5D5]  "
            />
            {errors.telegram && <p className="text-red-500 text-sm ">{errors.telegram}</p>}
          </div>

          <div>
            <label className=" font-normal font-primary text-[13px] text-[#000000]">TWITTER</label>
            <input
              type="text"
              value={formData.twitter}
              onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
              className="  w-full outline-none font-primary  border-b-[1px] px-2 bg-gray-50 border-[#D5D5D5]  "
            />
            {errors.twitter && <p className="text-red-500 text-sm ">{errors.twitter}</p>}
          </div>

          <div>
            <label className=" font-normal font-primary text-[13px] text-[#000000]">WEBSITE</label>
            <input
              type="text"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              className="  w-full outline-none font-primary   border-b-[1px] px-2 bg-gray-50 border-[#D5D5D5]  "
            />
            {errors.website && <p className="text-red-500 text-sm ">{errors.website}</p>}
          </div>

          <div className="flex w-full py-4  gap-8 justify-center items-center">
            <button type="submit" disabled={loading} className="text-[#FF0000] flex items-center justify-center gap-3 font-normal font-primary text-[13px]">
              SUBMIT {loading ? <BtnLoader /> : null}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
