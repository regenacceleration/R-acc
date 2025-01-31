"use client";
import  { useState } from "react";
import Header from "./Header";
import Link from "next/link";
import Image from "next/image";
import images from "../constants/images";
import { supabase } from "../services/supabase.js";
import useImgApi from "../hooks/useImgApi";
import { BtnLoader } from "./Loader";

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
  });
  const { apiFn } = useImgApi();
  const [loading, setLoading] = useState(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(formData.image);

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
        if (error) throw new Error(error);
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
