"use client";
import { useEffect, useState } from "react";
import Header from "./Header";
import Link from "next/link";
import Image from "next/image";
import images from "../constants/images";
import { supabase } from "../services/supabase.js";
import useImgApi from "../hooks/useImgApi";
import { BtnLoader } from "./Loader";
import { abi, chain, contractAddress } from "./constants";
import { ethers } from "ethers";
import { getAddress, VerifyNetwork } from "../utils/helperFn";
import { useRouter } from "next/navigation";
import { useNotification } from "../hooks/useNotification";

export function CreateTokenModal() {
  const [address, setAddress] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    ticker: "",
    description: "",
    image: "",
    address,
    telegram: "",
    twitter: "",
    website: "",
    percentage: "",

    tokenSymbol: "T",
    fee: "3000",
    salt: "randomSalt",
    pairedToken: "0xF5561b9cE91092f60323a54Dd21Dd66F8f0A9279",
    fid: 122,
    castHash: "hash",
    earthToken: "",
    devBuyFee: "",
    allowed: false,

    tokenIn: "",
    tokenOut: "",
    recipient: "",
    deadline: "300",
    amountIn: "0.01",
    amountOutMin: "0.001",
    newOwner: "1",
    newLocker: "1",
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
    percentage: "",
    percentage: "",
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
    devBuyFee: "",
    allowed: false,
    tokenIn: "",
    tokenOut: "",
    recipient: "",
    deadline: "",
    amountIn: "",
    amountOutMin: "",
    newOwner: "",
    newLocker: "",
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
    if (!formData.earthToken) newErrors.earthToken = "Earth Token is required";
    if (!formData.devBuyFee) newErrors.devBuyFee = "Dev Buy Fee is required";
    if (!formData.website) newErrors.website = "Website URL is required";
    if (!formData.percentage) newErrors.percentage = "Percentage is required";
    if (formData.percentage && isNaN(Number(formData.percentage))) {
      newErrors.percentage = "Percentage must be a number";
    }
    console.log(newErrors);

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

    setImg({ file });
    const { response, error: Error } = await apiFn({
      file: file,
    });
    setFormData((data) => ({ ...data, image: response }));
    console.log(formData?.image);
    if (Error) {
      console.log(Error);
      setLoading(false);
      setErrors((errors) => ({ ...errors, image: Error }));
      return;
    }
  };

  const approveDeployToken = async () => {
    const { pairedToken } = formData;
    const pairedAddress = ethers.getAddress(pairedToken);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum); // Updated to BrowserProvider
      const signer = await provider.getSigner();
      const earthTokenAdd = new ethers.Contract(
        pairedAddress,
        ERC20_ABI,
        signer
      );
      console.log(
        `Approved Earth Token successfully to account: ${contractAddress}`
      );
      return await earthTokenAdd.approve(
        contractAddress,
        ethers.parseEther("1000")
      );
    } catch (error) {
      console.log(`Failed to approve Earth Token: ${error.message}`);
    }
  };

  const deployToken = async () => {
    const approveToken = await approveDeployToken();

    if (!approveToken) {
      setLoading(false);
      return;
    }
    console.log(approveToken);

    const provider = new ethers.BrowserProvider(window.ethereum); // Updated to BrowserProvider
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);

    console.log(signer);

    if (!signer) {
      console.log("Please connect wallet first");
      setLoading(false);
      return;
    }

    try {
      console.log("Validating deployment parameters...");

      const {
        name,
        tokenSymbol,
        percentage,
        fee,
        salt,
        pairedToken,
        fid,
        image,
        castHash,
        ticker,
        devBuyFee,
        earthToken,
      } = formData;

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
      if (!percentage || Number(percentage) <= 0) {
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
      if (!pairedToken?.trim() || !ethers.isAddress(pairedToken)) {
        console.log("Valid paired token address is required");
        setLoading(false);

        return;
      }
      if (!earthToken?.trim()) {
        console.log("Earth Token Amount is required");
        setLoading(false);

        return;
      }

      console.log(signer);

      // Format parameters
      const parsedSupply = BigInt(percentage);
      const parsedFee = Number(fee);
      const hashedSalt = ethers.encodeBytes32String(salt);
      const pairedAddress = ethers.getAddress(pairedToken);
      const parsedEarth = ethers.parseUnits(earthToken, 18);
      console.log(pairedAddress);

      // Prepare deployment parameters
      const deploymentParams = {
        name,
        tokenSymbol,
        parsedSupply,
        parsedFee,
        hashedSalt,
        fid,
        image,
        castHash,
        poolConfig: {
          ticker: Number(ticker),
          pairedToken: pairedAddress,
          devBuyFee: Number(devBuyFee),
        },
        parsedEarth,
      };
      console.log(deploymentParams);

      // Execute deployment
      console.log("Deploying token...");
      console.log(contract);

      const tx = await contract.deployToken(
        name,
        tokenSymbol,
        parsedSupply,
        parsedFee,
        hashedSalt,
        fid,
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
        const [
          tokenAddress,
          positionId,
          deployer,
          fidValue,
          name,
          symbol,
          supply,
          lockerAddress,
          castHashValue,
        ] = tokenCreatedEvent.args;

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
      if (!address)
      {
        return
      }
      const network=await VerifyNetwork(chain)
      if (!network) {
        return
      }
      if (!validateForm()) return

      setLoading(true);
      const { data: fetchData, fetchDataError } = await supabase
        .from("token")
        .select("*")
        .eq("name", formData?.name);
      console.log(fetchData);
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
      console.log(deploy);
      const { data, error } = await supabase.from("token").insert([
        {
          name: formData?.name,
          ticker: formData?.ticker,
          description: formData?.description,
          image: formData?.image,
          address,
          telegram: formData?.telegram,
          twitter: formData?.twitter,
          website: formData?.website,
          percentage: formData?.percentage,
          earthToken: formData?.earthToken,
          devBuyFee: formData?.devBuyFee,
        },
      ]);
      console.log(data);
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
        percentage: "",
        earthToken: "",
        devBuyFee: "",
      });
      router.push("/");
    } catch (error) {
      console.log("Error inserting data:", error);
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
              TICKER (eg: 300)
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
              <div className='absolute bottom-2 flex items-center justify-between w-[90%]'>
                <p className=' text-black font-primary text-xs min-w-[90%] whitespace-nowrap text-ellipsis overflow-hidden'>
                  {formData?.image ? img?.name : ""}
                </p>
                {imgLoading ? (
                  <BtnLoader />
                ) : (
                  formData?.image && (
                    <Image
                      className='w-5 h-5 '
                      width={40}
                      height={40}
                      alt='upload'
                      src={formData?.image}
                    />
                  )
                )}
              </div>

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
              Buy Dev Fee (eg: 300)
            </label>
            <input
              type='text'
              value={formData.devBuyFee}
              onChange={(e) =>
                setFormData({ ...formData, devBuyFee: e.target.value })
              }
              className='  w-full  outline-none font-primary border-b-[1px] px-2 bg-gray-50 border-[#D5D5D5]  '
            />
            {errors.devBuyFee && (
              <p className='text-red-500 text-sm '>{errors.devBuyFee}</p>
            )}
          </div>

          <div>
            <label className=' font-normal font-primary text-[13px] text-[#000000]'>
              Earth Token (eg: 0)
            </label>
            <input
              type='text'
              value={formData.earthToken}
              onChange={(e) =>
                setFormData({ ...formData, earthToken: e.target.value })
              }
              className='  w-full  outline-none font-primary border-b-[1px] px-2 bg-gray-50 border-[#D5D5D5]  '
            />
            {errors.earthToken && (
              <p className='text-red-500 text-sm '>{errors.earthToken}</p>
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
