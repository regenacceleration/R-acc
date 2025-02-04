"use client";
import { useState } from "react";
import Header from "./Header";
import Link from "next/link";
import Image from "next/image";
import images from "../constants/images";
import { supabase } from "../services/supabase.js";
import useImgApi from "../hooks/useImgApi";
import { BtnLoader } from "./Loader";
import { abi, contractAddress } from "./constants";
import { ethers } from "ethers";

export function CreateTokenModal() {
  const [formData, setFormData] = useState({
    name: "",
    ticker: "",
    description: "",
    image: "",
    address: "0x1C4C...F463A3",
    telegram: "",
    twitter: "",
    website: "",
    percentage: "",
    // // name: "",
    // tokenSymbol: "",
    // // percentage: "",
    // fee: "",
    // salt: "",
    // pairedToken: "",
    // fid: "",
    // // image: "",
    // castHash: "",
    // // tick: "",
    // devBuyFee: "",
    // allowed: false,
    // tokenIn: "",
    // tokenOut: "",
    // recipient: "",
    // deadline: "300",
    // amountIn: "0.01",
    // amountOutMin: "0.001",
    // newOwner: "",
    // newLocker: "",
  });
  const [debugInfo, setDebugInfo] = useState("");
  const [status, setStatus] = useState("");
  const { apiFn } = useImgApi();
  const [loading, setLoading] = useState(false);

  const addDebugInfo = (info) => {
    const timestamp = new Date().toISOString();
    setDebugInfo((prev) => `${timestamp}: ${info}\n${prev}`);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) setFormData((data) => ({ ...data, image: file }));
  };

  const [errors, setErrors] = useState({
    name: "",
    ticker: "",
    description: "",
    image: "",
    telegram: "",
    twitter: "",
    website: "",
    percentage: "",

    // // name: "",
    // tokenSymbol: "",
    // // percentage: "",
    // fee: "",
    // salt: "",
    // pairedToken: "",
    // fid: "",
    // // image: "",
    // castHash: "",
    // // tick: "",
    // devBuyFee: "",
    // allowed: false,
    // tokenIn: "",
    // tokenOut: "",
    // recipient: "",
    // deadline: "300",
    // amountIn: "0.01",
    // amountOutMin: "0.001",
    // newOwner: "",
    // newLocker: "",
  });

  const validateForm = () => {
    const newErrors = {};
    console.log(formData.image);

    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.ticker) newErrors.ticker = "Ticker is required";
    if (!formData.description)
      newErrors.description = "Description is required";
    if (!formData.image) newErrors.image = "Image is required";
    if (!formData.telegram) newErrors.telegram = "Telegram is required";
    if (!formData.twitter) newErrors.twitter = "Twitter is required";
    if (!formData.website) newErrors.website = "Website URL is required";
    if (!formData.percentage) newErrors.percentage = "Percentage is required";
    if (formData.percentage && isNaN(Number(formData.percentage))) {
      newErrors.percentage = "Percentage must be a number";
    }
    console.log(newErrors);

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // const deployToken = async () => {
  //   const provider = new ethers.providers.BrowserProvider(window.ethereum); // Updated to BrowserProvider
  //   const signer = await provider.getSigner();
  //   const contract = new ethers.Contract(contractAddress, abi);

  //   if (!signer) {
  //     setStatus("Please connect wallet first");
  //     return;
  //   }

  //   try {
  //     setLoading(true);
  //     setStatus("Validating deployment parameters...");

  //     const { name, tokenSymbol, percentage, fee, salt, pairedToken, fid, image, castHash, ticker, devBuyFee } =
  //       formData;

  //     // Enhanced input validation
  //     if (!name?.trim()) {
  //       setStatus("Token name is required");
  //       return;
  //     }
  //     if (!tokenSymbol?.trim()) {
  //       setStatus("Token symbol is required");
  //       return;
  //     }
  //     if (!ticker?.trim()) {
  //       setStatus("Ticker is required");
  //       return;
  //     }
  //     if (!percentage || Number(percentage) <= 0) {
  //       setStatus("Valid token supply is required");
  //       return;
  //     }
  //     if (!fee || Number(fee) <= 0) {
  //       setStatus("Valid fee is required");
  //       return;
  //     }
  //     if (!salt?.trim()) {
  //       setStatus("Salt is required");
  //       return;
  //     }
  //     if (!pairedToken?.trim() || !ethers.isAddress(pairedToken)) {
  //       setStatus("Valid paired token address is required");
  //       return;
  //     }

  //     // Format parameters
  //     const parsedSupply = BigInt(percentage);
  //     const parsedFee = Number(fee);
  //     const hashedSalt = ethers.encodeBytes32String(salt);
  //     const pairedAddress = ethers.getAddress(pairedToken);

  //     // Check if we want to attach ETH
  //     const attachEth = form.attachEth || false; // Add this to your form state
  //     let valueToSend = 0n;

      

  //     if (attachEth) {
  //       try {
  //         // Check if paired token is allowed
  //         const isAllowed = await contract.allowedPairedTokens(pairedAddress);
  //         if (!isAllowed) {
  //           setStatus("Paired token is not allowed for ETH attachment");
  //           return;
  //         }

  //         // Get WETH address from contract
  //         const wethAddress = await contract.weth();

  //         // Verify swap router is set
  //         const swapRouter = await contract.swapRouter();
  //         if (!swapRouter) {
  //           setStatus("Swap router not configured");
  //           return;
  //         }

         
  //         valueToSend = ethers.parseEther("0.1"); 
  //         addDebugInfo(`Attaching ${ethers.formatEther(valueToSend)} ETH to deployment`);
  //       } catch (error) {
  //         setStatus(`ETH attachment check failed: ${error.message}`);
  //         return;
  //       }
  //     }

  //     // Prepare deployment parameters
  //     const deploymentParams = {
  //       name,
  //       tokenSymbol,
  //       parsedSupply,
  //       parsedFee,
  //       hashedSalt,
  //       account,
  //       fid,
  //       image,
  //       castHash,
  //       poolConfig: {
  //         ticker: Number(ticker),
  //         pairedToken: pairedAddress,
  //         devBuyFee: Number(devBuyFee),
  //       },
  //     };

  //     addDebugInfo(
  //       `Deploying token with parameters: ${JSON.stringify(
  //         deploymentParams,
  //         (_, v) => (typeof v === "bigint" ? v.toString() : v),
  //         2
  //       )}`
  //     );

  //     // Execute deployment
  //     setStatus("Deploying token...");
  //     const tx = await contract.deployToken(
  //       name,
  //       tokenSymbol,
  //       parsedSupply,
  //       parsedFee,
  //       hashedSalt,
  //       account,
  //       fid,
  //       image,
  //       castHash,
  //       {
  //         ticker: Number(ticker),
  //         pairedToken: pairedAddress,
  //         devBuyFee: Number(devBuyFee),
  //       },
  //       valueToSend > 0n ? { value: valueToSend } : {}
  //     );

  //     addDebugInfo(`Deployment transaction sent: ${tx.hash}`);
  //     setStatus("Waiting for deployment confirmation...");

  //     const receipt = await tx.wait();

  //     // Enhanced event parsing
  //     const tokenCreatedEvent = receipt.logs
  //       .map((log) => {
  //         try {
  //           return contract.interface.parseLog(log);
  //         } catch (e) {
  //           return null;
  //         }
  //       })
  //       .find((event) => event?.name === "TokenCreated");

  //     if (tokenCreatedEvent) {
  //       const [tokenAddress, positionId, deployer, fidValue, name, symbol, supply, lockerAddress, castHashValue] =
  //         tokenCreatedEvent.args;

  //       setStatus(`Token deployed successfully!`);
  //       addDebugInfo(
  //         `Deployment details:\n` +
  //         `- Token Address: ${tokenAddress}\n` +
  //         `- Position ID: ${positionId}\n` +
  //         `- Deployer: ${deployer}\n` +
  //         `- Locker Address: ${lockerAddress}`
  //       );
  //       console.log(debugInfo)
  //       console.log(status)

  //     } else {

  //       setStatus("Token deployed but event not found in logs");
  //     }
  //   } catch (error) {
  //     console.error("Deployment error:", error);
  //     let errorMessage = error.message;

  //     // Check for specific error types
  //     if (error.message.includes("NotAllowedPairedToken")) {
  //       errorMessage = "The selected paired token is not allowed";
  //     } else if (error.message.includes("Invalid ticker")) {
  //       errorMessage = "Invalid ticker value for the selected fee tier";
  //     } else if (error.message.includes("insufficient funds")) {
  //       errorMessage = "Insufficient ETH for deployment";
  //     }

  //     setStatus(`Deployment failed: ${errorMessage}`);
  //     addDebugInfo(`Deployment error: ${error.message}\n${error.stack}`);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(formData.image);

      // const deploy = await deployToken();
      // console.log(deploy)

      if (validateForm() && formData?.image) {
        setLoading(true);
        const { response, error: Error } = await apiFn({
          file: formData?.image,
        });
        if (Error) {
          console.log(Error);
          setLoading(false);
          setErrors((errors) => ({ ...errors, image: Error }));
          return;
        }
        const { data, error } = await supabase.from("token").insert([
          {
            ...formData,
            image: response,
          },
        ]);
        console.log(data);
        if (error) throw new Errors(error);
        setLoading(false);
        setFormData({
          name: "",
          ticker: "",
          description: "",
          image: "",
          telegram: "",
          twitter: "",
          website: "",
          percentage: "",
        });
      }
    } catch (error) {
      console.error("Error inserting data:", error);
    }
  };

  return (
    <div className='min-h- pb-6 bg-gray-50 '>
      <Header />
      <div className='flex w-full justify-center mt-5 items-center'>
        <form onSubmit={handleSubmit} className='space-y-4 text-black'>
          <div className='w-full'>
            <label className=' font-normal font-primary text-[13px]  text-[#000000]'>
              NAME
            </label>
            <input
              type='text'
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className='w-full bg-gray-50 outline-none font-primary border-[#D5D5D5]  border-b-[1px]    '
            />
            {errors.name && (
              <p className='text-red-500 text-sm '>{errors.name}</p>
            )}
          </div>

          <div>
            <label className=' font-normal font-primary text-[13px] text-[#000000]'>
              TICKER
            </label>
            <input
              type='text'
              value={formData.ticker}
              onChange={(e) =>
                setFormData({ ...formData, ticker: e.target.value })
              }
              className='  w-full  outline-none font-primary border-b-[1px] px-2 bg-gray-50 border-[#D5D5D5]  '
            />
            {errors.ticker && (
              <p className='text-red-500 text-sm '>{errors.ticker}</p>
            )}
          </div>

          <div>
            <label className=' font-normal font-primary text-[13px] text-[#000000]'>
              DESCRIPTION
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className='outline-none font-primary px-2  w-full  resize-none  border-[1px] bg-gray-50 border-[#D5D5D5]  '
              rows={3}
            />
            {errors.description && (
              <p className='text-red-500 text-sm '>{errors.description}</p>
            )}
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
          <div>
            <label className=' font-normal font-primary text-[13px] text-[#000000]'>
              IMAGE
            </label>
            <div className='relative flex flex-col  w-full   border-b-[1px] px-2 bg-gray-50 border-[#D5D5D5]'>
              {/* {selectedImage ? (
                <img src={selectedImage} alt="Uploaded Preview" className="w-full h-40 object-cover rounded-md" />
              ) : (
                <p className="text-gray-600">IMAGE</p>
              )} */}
              {formData?.image && (
                <div className='absolute bottom-2 flex items-center justify-between w-[90%]'>
                  <p className=' text-black font-primary text-xs min-w-[90%] whitespace-nowrap text-ellipsis overflow-hidden'>
                    {formData?.image?.name}
                  </p>
                  <Image
                    className='w-5 h-5 '
                    width={40}
                    height={40}
                    alt='upload'
                    src={URL.createObjectURL(formData?.image)}
                  />
                </div>
              )}

              <label
                htmlFor='upload'
                type='button'
                className='absolute right-2 cursor-pointer bottom-2  transition'
              >
                <Image
                  className='w-[22px] h-[22px]'
                  width={40}
                  height={40}
                  alt='upload'
                  src={images.upload}
                />
              </label>
              <input
                id='upload'
                type='file'
                accept='image/*'
                className='opacity-0 cursor-pointer'
                onChange={handleImageChange}
              />
            </div>
            {errors.image && (
              <p className='text-red-500 text-sm '>{errors.image}</p>
            )}
          </div>

          <div>
            <label className=' font-normal font-primary text-[13px] text-[#000000]'>
              TELEGRAM
            </label>
            <input
              type='text'
              value={formData.telegram}
              onChange={(e) =>
                setFormData({ ...formData, telegram: e.target.value })
              }
              className='  w-full outline-none font-primary  border-b-[1px] px-2 bg-gray-50 border-[#D5D5D5]  '
            />
            {errors.telegram && (
              <p className='text-red-500 text-sm '>{errors.telegram}</p>
            )}
          </div>

          <div>
            <label className=' font-normal font-primary text-[13px] text-[#000000]'>
              TWITTER
            </label>
            <input
              type='text'
              value={formData.twitter}
              onChange={(e) =>
                setFormData({ ...formData, twitter: e.target.value })
              }
              className='  w-full outline-none font-primary  border-b-[1px] px-2 bg-gray-50 border-[#D5D5D5]  '
            />
            {errors.twitter && (
              <p className='text-red-500 text-sm '>{errors.twitter}</p>
            )}
          </div>

          <div>
            <label className=' font-normal font-primary text-[13px] text-[#000000]'>
              WEBSITE
            </label>
            <input
              type='text'
              value={formData.website}
              onChange={(e) =>
                setFormData({ ...formData, website: e.target.value })
              }
              className='  w-full outline-none font-primary   border-b-[1px] px-2 bg-gray-50 border-[#D5D5D5]  '
            />
            {errors.website && (
              <p className='text-red-500 text-sm '>{errors.website}</p>
            )}
          </div>

          <div>
            <label className=' font-normal font-primary text-[13px] text-[#000000]'>
              % OF SUPPLY YOU WANT TO RETAIN
            </label>
            <input
              type='text'
              value={formData.percentage}
              onChange={(e) =>
                setFormData({ ...formData, percentage: e.target.value })
              }
              className='  w-full outline-none font-primary  border-b-[1px] px-2 bg-gray-50 border-[#D5D5D5]  '
            />
            {errors.percentage && (
              <p className='text-red-500 text-sm '>{errors.percentage}</p>
            )}
          </div>
          <div className='flex w-full py-4  gap-8 justify-center items-center'>
            <Link href='/'>
              <button className='text-[#000000] font-normal font-primary text-[13px]'>
                GO BACK
              </button>
            </Link>
            <button
              type='submit'
              disabled={loading}
              className='text-[#FF0000] flex items-center justify-center gap-3 font-normal font-primary text-[13px]'
            >
              CREATE TOKEN {loading ? <BtnLoader /> : null}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
