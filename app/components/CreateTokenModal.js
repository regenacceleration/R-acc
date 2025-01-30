"use client"
import React, { useState } from 'react';
import Header from './Header';
import Link from 'next/link';
import Image from 'next/image';
import images from '../constants/images';
import { supabase } from '../services/supabaseClient.js';

export function CreateTokenModal() {

  const [formData, setFormData] = useState({
    name: '',
    ticker: '',
    description: '',
    image:"",
    telegram: '',
    twitter: '',
    website: '',
    percentage: '',
  });
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  const [errors, setErrors] = useState({});

  // const handleImageUpload = (e) => {
  //   setFormData({ ...formData, image: URL.createObjectURL(e.target.files[0]) });
  // };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.ticker) newErrors.ticker = 'Ticker is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.image) newErrors.image = 'Image URL is required';
    if (!formData.telegram) newErrors.telegram = 'Telegram is required';
    if (!formData.twitter) newErrors.twitter = 'Twitter is required';
    if (!formData.website) newErrors.website = 'Website URL is required';
    if (formData.percentage && isNaN(Number(formData.percentage))) {
      newErrors.percentage = 'Percentage must be a number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (validateForm()) {
        console.log(formData)
        const { data, error } = await supabase
          .from('token-details') // Table name
          .insert([{ 
            ...formData,
          }]);
        console.log(data)
        if (error) throw error;
      }

      setFormData({
        name: '',
        ticker: '',
        description: '',
        image: '',
        telegram: '',
        twitter: '',
        website: '',
        percentage: '',
      })
    } catch (error) {
      console.error('Error inserting data:', error);
    }
  };


  return (
    <div className="min-h- pb-6 bg-gray-50">
      <Header />
      <div className='flex w-full justify-center mt-5 items-center'>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className='w-full'>
            <label className=" font-normal font-primary text-[13px]  text-[#000000]">NAME</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="  w-full bg-gray-50 border-[#D5D5D5]  border-b-[1px]   "
            />
            {errors.name && <p className="text-red-500 text-sm ">{errors.name}</p>}
          </div>

          <div>
            <label className=" font-normal font-primary text-[13px] text-[#000000]">TICKER</label>
            <input
              type="text"
              value={formData.ticker}
              onChange={(e) => setFormData({ ...formData, ticker: e.target.value })}
              className="  w-full   border-b-[1px] bg-gray-50 border-[#D5D5D5]  "
            />
            {errors.ticker && <p className="text-red-500 text-sm ">{errors.ticker}</p>}
          </div>

          <div>
            <label className=" font-normal font-primary text-[13px] text-[#000000]">DESCRIPTION</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="  w-full   border-[1px] bg-gray-50 border-[#D5D5D5]  "
              rows={3}
            />
            {errors.description && <p className="text-red-500 text-sm ">{errors.description}</p>}
          </div>

          {/* <div>
            <label className=" font-normal font-primary text-[13px] text-[#000000]">IMAGE</label>
            <input
              type="text"
              value={formData.ticker}
              onChange={(e) => setFormData({ ...formData, ticker: e.target.value })}
              className="  w-full   border-b-[1px] bg-gray-50 border-[#D5D5D5]  "
            />
            
            {errors.ticker && <p className="text-red-500 text-sm ">{errors.ticker}</p>}
          </div> */}

          {/* <div>
            <input type="file" onChange={handleImageUpload} />
            {errors.image && <p className="text-red-500 text-sm ">{errors.image}</p>}
          </div> */}
          <div>
            <label className=" font-normal font-primary text-[13px] text-[#000000]">IMAGE</label>
            <div className="relative flex flex-col items-center justify-center w-full  p-4 border-b-[1px] bg-gray-50 border-[#D5D5D5]">
              {/* {selectedImage ? (
                <img src={selectedImage} alt="Uploaded Preview" className="w-full h-40 object-cover rounded-md" />
              ) : (
                <p className="text-gray-600">IMAGE</p>
              )} */}
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleImageChange}
              />


              <button className="absolute right-2  p-2  transition">
                <Image
                  className="w-[22px] h-[22px]"
                  width={40} height={40} alt='upload' src={images.upload} />
              </button>




            </div>
          </div>

          <div>
            <label className=" font-normal font-primary text-[13px] text-[#000000]">TELEGRAM</label>
            <input
              type="text"
              value={formData.telegram}
              onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
              className="  w-full   border-b-[1px] bg-gray-50 border-[#D5D5D5]  "
            />
          </div>

          <div>
            <label className=" font-normal font-primary text-[13px] text-[#000000]">TWITTER</label>
            <input
              type="text"
              value={formData.twitter}
              onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
              className="  w-full   border-b-[1px] bg-gray-50 border-[#D5D5D5]  "
            />
          </div>

          <div>
            <label className=" font-normal font-primary text-[13px] text-[#000000]">WEBSITE</label>
            <input
              type="text"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              className="  w-full   border-b-[1px] bg-gray-50 border-[#D5D5D5]  "
            />
          </div>

          <div>
            <label className=" font-normal font-primary text-[13px] text-[#000000]">% OF SUPPLY YOU WANT TO RETAIN</label>
            <input
              type="text"
              value={formData.percentage}
              onChange={(e) => setFormData({ ...formData, percentage: e.target.value })}
              className="  w-full   border-b-[1px] bg-gray-50 border-[#D5D5D5]  "
            />
            {errors.percentage && <p className="text-red-500 text-sm ">{errors.percentage}</p>}
          </div>
          <div className='flex w-full py-4  gap-8 justify-center items-center'>
            <Link href="/">
              <button className="text-[#000000] font-normal font-primary text-[13px]">GO BACK</button>
            </Link>
            <button
              type="submit"

              className='text-[#FF0000] font-normal font-primary text-[13px]'
            >
              CREATE TOKEN
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}