"use client";
import { useEffect, useState } from "react";
import Header from "./Header";
import Link from "next/link";
import Image from "next/image";
import images from "../constants/images";
import { supabase, supabaseTable } from "../services/supabase.js";
import useImgApi from "../hooks/useImgApi";
import { BtnLoader } from "./Loader";
import { abi, chain, contractAddress, pairedTokenAddress } from "./constants";
import { ethers } from "ethers";
import { getAddress, validateUrl, VerifyNetwork } from "../utils/helperFn";
import { useRouter } from "next/navigation";
import { useNotification } from "../hooks/useNotification";
import { createToken } from "../action";

export function CreateTokenModal() {
  const [address, setAddress] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    ticker: "-138000",
    description: "",
    image: "",
    address,
    telegram: "",
    twitter: "",
    website: "",
    totalSupply: "",

    tokenSymbol: "",
    fee: "10000",
    salt: "morerandomSalt",
    pairedToken: pairedTokenAddress,
    fid: "125",
    castHash: "hash",
    earthToken: "0",
    devBuyFee: "12000",
    allowed: false,
  });
  const { apiFn, loading: imgLoading } = useImgApi();
  const [loading, setLoading] = useState(false);
  const [img, setImg] = useState("");
  const router = useRouter();
  const { showMessage } = useNotification();

  const [errors, setErrors] = useState({
    name: "",
    ticker: "",
    description: "",
    image: "",
    telegram: "",
    twitter: "",
    website: "",
    totalSupply: "",
    // name: "",
    tokenSymbol: "",
    // percentage: "",
    fee: "",
    salt: "",
    pairedToken: "",
    fid: "",
    // image: "",
    castHash: "",
    ticker: "",
    earthToken: "",
    // devBuyFee: "",
  });

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.ticker) newErrors.ticker = "Ticker is required";
    if (!formData.description) newErrors.description = "Description is required";
    if (!formData.image) newErrors.image = "Image is required";
    if (!formData.telegram) newErrors.telegram = "Telegram is required";
    if (!formData.twitter) newErrors.twitter = "Twitter is required";
    if (!formData.earthToken) newErrors.earthToken = "Earth Token is required";
    if (!formData.tokenSymbol) newErrors.tokenSymbol = "Dev Buy Fee is required";
    if (!formData.website) newErrors.website = "Website URL is required";
    if (!formData.totalSupply) newErrors.totalSupply = "totalSupply is required";
    if (formData.telegram && !validateUrl(formData.telegram)) newErrors.telegram = "Invalid Url";
    if (formData.twitter && !validateUrl(formData.twitter)) newErrors.twitter = "Invalid Url";
    if (formData.website && !validateUrl(formData.website)) newErrors.website = "Invalid Url";

    // if (formData.totalSupply && isNaN(Number(formData.totalSupply))) {
    //   newErrors.totalSupply = "totalSupply must be a number";
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const ERC20_ABI = [
    "function decimals() view returns (uint8)",
    "function symbol() view returns (string)",
    "function balanceOf(address) view returns (uint256)",
    "function approve(address spender, uint256 amount) returns (bool)",
    "function allowance(address owner, address spender) view returns (uint256)",
  ];

  useEffect(() => {
    setAddress(getAddress());
  }, []);

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

  const deployToken = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum); // Updated to BrowserProvider
    const signer =  provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);


    if (!signer) {
      setLoading(false);
      return;
    }

    try {
      console.log("Validating deployment parameters...");

      const { name, tokenSymbol, totalSupply, fee, salt, pairedToken, fid, image, castHash, ticker, devBuyFee, earthToken } = formData;

      // Enhanced input validation
      if (!name?.trim()) {
        console.log("Token name is required");

        setLoading(false);

        return;
      }
      if (!tokenSymbol?.trim()) {
        console.log("Token symbol is required");
        setLoading(false);

        return;
      }
      if (!totalSupply || Number(totalSupply) < 0) {
        console.log("Valid token supply is required");
        setLoading(false);

        return;
      }
      if (!fee || Number(fee) <= 0) {
        console.log("Valid fee is required");
        setLoading(false);

        return;
      }
      if (!salt?.trim()) {
        console.log("Salt is required");
        setLoading(false);

        return;
      }
      if (!pairedToken?.trim() || !ethers.utils.isAddress(pairedToken)) {
        console.log("Valid paired token address is required");
        setLoading(false);

        return;
      }
      if (!earthToken?.trim()) {
        console.log("Earth Token Amount is required");
        setLoading(false);

        return;
      }


      // Format parameters
      const parsedSupply = BigInt(totalSupply);
      // const parsedSupply = ethers.utils.parseUnits(totalSupply.toString(), 18);
      const parsedFee = Number(fee);
      const hashedSalt = ethers.utils.formatBytes32String(salt);
      const pairedAddress = ethers.utils.getAddress(pairedToken);
      const parsedEarth = ethers.utils.parseUnits(earthToken, 18);
      const parsedFid = Number(fid);

      // Prepare deployment parameters
      const deploymentParams = {
        name,
        tokenSymbol,
        parsedSupply,
        parsedFee,
        hashedSalt,
        fid: parsedFid,
        image,
        castHash,
        poolConfig: {
          ticker: Number(ticker),
          pairedToken: pairedAddress,
          devBuyFee: Number(devBuyFee),
        },
        parsedEarth,
      };

      // Execute deployment

      const tx = await contract.deployToken(
        name,
        tokenSymbol,
        parsedSupply,
        parsedFee,
        hashedSalt,
        parsedFid,
        image,
        castHash,
        {
          tick: Number(ticker),
          pairedToken: pairedAddress,
          devBuyFee: Number(devBuyFee),
        },
        parsedEarth
      );

      console.log(tx);

      console.log("Waiting for deployment confirmation...");

      const receipt = await tx.wait();

      // Enhanced event parsing
      const tokenCreatedEvent = receipt.logs
        .map((log) => {
          try {
            return contract.interface.parseLog(log);
          } catch (e) {
            setLoading(false);
            return null;
          }
        })
        .find((event) => event?.name === "TokenCreated");

      if (tokenCreatedEvent) {
        const [tokenAddress, positionId, deployer, fidValue, name, symbol, supply, lockerAddress, castHashValue] = tokenCreatedEvent.args;

        console.log(`Token deployed successfully!`);

        // Store deployment info in state if needed
        console.log({
          tokenAddress,
          positionId: positionId.toString(),
          lockerAddress,
        });
        return {
          tokenAddress,
          positionId: positionId.toString(),
          lockerAddress,
        };
      } else {
        console.log("Token deployed but event not found in logs");
      }
    } catch (error) {
      console.error("Deployment error:", error);
      let errorMessage = error.message;

      // Check for specific error types
      if (error.message.includes("NotAllowedPairedToken")) {
        errorMessage = "The selected paired token is not allowed";
      } else if (error.message.includes("Invalid tick")) {
        errorMessage = "Invalid tick value for the selected fee tier";
      } else if (error.message.includes("insufficient funds")) {
        errorMessage = "Insufficient ETH for deployment";
      }

      console.log(`Deployment failed: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!address) {
        return;
      }
      const network = await VerifyNetwork(chain);
      if (!network) {
        return;
      }
      if (!validateForm()) return;

      setLoading(true);
      const { data: fetchData, fetchDataError } = await supabase.from(supabaseTable.token).select("*").eq("name", formData?.name);
      if (fetchDataError) {
        setErrors((errors) => ({
          ...errors,
          name: "Error verifying the token name",
        }));
        setLoading(false);
        return;
      }
      if (fetchData.length) {
        setLoading(false);
        setErrors((errors) => ({
          ...errors,
          name: "Token Name should be unique",
        }));
        return;
      }

      const deploy = await deployToken();

      if (!deploy) {
        setLoading(false);
        return;
      }
      const { data, error } = await createToken({
          name: formData?.name,
          ticker: formData?.ticker,
          description: formData?.description,
          image: formData?.image,
          address,
          telegram: formData?.telegram,
          twitter: formData?.twitter,
          website: formData?.website,
          totalSupply: formData?.totalSupply,
          earthToken: formData?.earthToken,
          tokenSymbol:formData?.tokenSymbol,
          // devBuyFee: formData?.devBuyFee,
          ...deploy,
      });
      if (error) throw new Error(error);
      setLoading(false);

      showMessage({
        type: "success",
        value: "Token Deployed Successfully",
      });
      setFormData({
        name: "",
        ticker: "",
        description: "",
        image: "",
        telegram: "",
        twitter: "",
        website: "",
        totalSupply: "",
        earthToken: "",
        tokenSymbol:"",
        devBuyFee: "",
      });
      router.push("/");
    } catch (error) {
      console.log("Error inserting data:", error);
    }
  };

  return (
    <div className="min-h- pb-6 bg-gray-50 ">
      <Header />
      <div className="flex w-full justify-center mt-5 items-center">
        <form onSubmit={handleSubmit} className="space-y-4 flex flex-col justify-center items-center w-[80%] md:w-[35%] text-black">
          <div className="w-full">
            <label className=" font-normal font-primary text-[13px]  text-[#000000]">NAME</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-gray-50 outline-none font-primary border-[#D5D5D5]  border-b-[1px]    "
            />
            {errors.name && <p className="text-red-500 text-sm ">{errors.name}</p>}
          </div>

          <div className="w-full">
            <label className=" font-normal font-primary text-[13px] text-[#000000]">Symbol</label>
            <input
              type="text"
              value={formData.tokenSymbol}
              onChange={(e) => setFormData({ ...formData, tokenSymbol: e.target.value })}
              className="  w-full  outline-none font-primary border-b-[1px] px-2 bg-gray-50 border-[#D5D5D5]  "
            />
            {errors.tokenSymbol && <p className="text-red-500 text-sm ">{errors.tokenSymbol}</p>}
          </div>

          {/* <div>
            <label className=' font-normal font-primary text-[13px] text-[#000000]'>
              TICKER (eg: 300)
            </label>
            <input
              type='number'
              value={formData.ticker}
              onChange={(e) =>
                setFormData({ ...formData, ticker: e.target.value })
              }
              className='  w-full  outline-none font-primary border-b-[1px] px-2 bg-gray-50 border-[#D5D5D5]  '
            />
            {errors.ticker && (
              <p className='text-red-500 text-sm '>{errors.ticker}</p>
            )}
          </div> */}

          <div className="w-full">
            <label className=" font-normal font-primary text-[13px] text-[#000000]">DESCRIPTION</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="outline-none font-primary px-2  w-full  resize-none  border-[1px] bg-gray-50 border-[#D5D5D5]  "
              rows={3}
            />
            {errors.description && <p className="text-red-500 text-sm ">{errors.description}</p>}
          </div>

          {/* <div>
            <label className=" font-normal font-primary text-[13px] text-[#000000]">IMAGE</label>
            <input
              type="text"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="  w-full   border-b-[1px] px-2 bg-gray-50 border-[#D5D5D5]  "
            />
            
            {errors.image && <p className="text-red-500 text-sm ">{errors.image}</p>}
          </div> */}

          {/* <div>
            <input type="file" onChange={handleImageUpload} />
            {errors.image && <p className="text-red-500 text-sm ">{errors.image}</p>}
          </div> */}
          <div className="w-full">
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

         
          {/* 
          <div>
            <label className=' font-normal font-primary text-[13px] text-[#000000]'>
              Earth Token (eg: 0)
            </label>
            <input
              type='number'
              value={formData.earthToken}
              onChange={(e) =>
                setFormData({ ...formData, earthToken: e.target.value })
              }
              className='  w-full  outline-none font-primary border-b-[1px] px-2 bg-gray-50 border-[#D5D5D5]  '
            />
            {errors.earthToken && (
              <p className='text-red-500 text-sm '>{errors.earthToken}</p>
            )}
          </div> */}

          <div className="w-full">
            <label className=" font-normal font-primary text-[13px] text-[#000000]">TELEGRAM</label>
            <input
              type="text"
              value={formData.telegram}
              onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
              className="  w-full outline-none font-primary  border-b-[1px] px-2 bg-gray-50 border-[#D5D5D5]  "
            />
            {errors.telegram && <p className="text-red-500 text-sm ">{errors.telegram}</p>}
          </div>

          <div className="w-full">
            <label className=" font-normal font-primary text-[13px] text-[#000000]">TWITTER</label>
            <input
              type="text"
              value={formData.twitter}
              onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
              className="  w-full outline-none font-primary  border-b-[1px] px-2 bg-gray-50 border-[#D5D5D5]  "
            />
            {errors.twitter && <p className="text-red-500 text-sm ">{errors.twitter}</p>}
          </div>

          <div className="w-full">
            <label className=" font-normal font-primary text-[13px] text-[#000000]">WEBSITE</label>
            <input
              type="text"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              className="  w-full outline-none font-primary   border-b-[1px] px-2 bg-gray-50 border-[#D5D5D5]  "
            />
            {errors.website && <p className="text-red-500 text-sm ">{errors.website}</p>}
          </div>

          <div className="w-full">
            <label className=" font-normal font-primary text-[13px] text-[#000000]">Total Supply you want to create</label>
            <input
              type="number"
              value={formData.totalSupply}
              onChange={(e) => setFormData({ ...formData, totalSupply: e.target.value })}
              className="  w-full outline-none font-primary  border-b-[1px] px-2 bg-gray-50 border-[#D5D5D5]  "
            />
            {errors.totalSupply && <p className="text-red-500 text-sm ">{errors.totalSupply}</p>}
          </div>
          <div className="flex w-full py-4  gap-8 justify-center items-center">
            <Link href="/">
              <button className="text-[#000000] font-normal font-primary text-[13px]">GO BACK</button>
            </Link>
            <button type="submit" disabled={loading} className="text-[#FF0000] flex items-center justify-center gap-3 font-normal font-primary text-[13px]">
              CREATE TOKEN {loading ? <BtnLoader /> : null}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
