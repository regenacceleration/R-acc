"use client";
import InfiniteScroll from "react-infinite-scroll-component";
import { BtnLoader, Loader } from "./Loader";
import { supabase } from "../services/supabase";
import { useEffect, useState } from "react";
import { getAddress } from "../utils/helperFn";

export default function Updates({token}) {
  const [comment, setComment] = useState("");
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalDataCount, setTotalDataCount] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
    const rowsPerPage = 3;
  const [errors, setErrors] = useState();

  const fetchUpdates = async (page, search = "") => {
    try {
      if (updates.length === 0) setLoading(true);
      const start = (page - 1) * rowsPerPage;
      const end = start + rowsPerPage - 1;

      let query = supabase
        .from("update")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(start, end);

      const { data, error, count } = await query;
      if (error) {
        console.log("Error fetching data:", error);
        setLoading(false);
        return;
      }
      console.log(data);
      setTotalDataCount(count);
      if (data.length === 0) {
        setHasMore(false);
      } else {
        setUpdates((prevTokens) =>
          page === 1 ? data : [...prevTokens, ...data]
        );
      }

      setLoading(false);
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  useEffect(() => {
    fetchUpdates(currentPage, searchQuery);
  }, [currentPage, searchQuery]);

  const fetchMoreUpdate = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment === "") return; // Check if comment is empty and return if true

    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("update") // Ensure "update" is your actual table name
        .insert([{ update: comment }]);

      if (error) {
        throw error; // Properly throw the error
      }

      console.log("Inserted data:", data);

      setComment(""); // Clear input after success
    } catch (error) {
      setErrors(error.message); // Store error message
      console.error("Error inserting data:", error);
    } finally {
      setLoading(false); // Ensure loading is stopped
    }
  };

  return (
    <div>
      <InfiniteScroll
        dataLength={updates.length}
        next={fetchMoreUpdate}
        hasMore={updates.length < totalDataCount}
              scrollThreshold={"50%"}
              height={"62vh"}
      >
        {/* {loading ?
                                     <div className="flex items-center w-[50%] justify-center h-64">
                                       <Loader className="text-[#7C7C7C]" size="text-6xl" />
                                     </div>
                                     : */}
                  {updates && updates.length ?updates.map((update, index) => (
            <div key={index} className='w-[90%] py-4'>
              <div className='flex flex-col items-start gap-3'>
                {/* <p className="font-bold text-[#000000] font-primary text-[14px]">{update.name}</p> */}
                <p className='text-[#000000] font-primary font-normal text-[16px]'>
                  {update.update}
                </p>
                <p className='text-[#000000] font-primary font-normal text-[12px]'>
                  Date: {new Date(update.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          )):null}

        {/* } */}
      </InfiniteScroll>

      {getAddress()!==token?.address?<div className='flex mt-4 items-center gap-3 justify-between  rounded-lg w-full'>
        <div className='flex flex-col h-10 w-full'>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder='Add a update...'
            className='flex-1 text-black  bg-gray-200 w-full px-3 py-2 rounded-lg outline-none mb-0 resize-none'
          />
          {errors && <p className='text-red-500 text-sm '>{errors}</p>}
        </div>
        <div className=''>
          <button
            className='w-full px-4 py-2 bg-black text-white rounded-lg flex items-center justify-center gap-3 font-normal font-primary text-[16px]'
            type='button'
            onClick={handleSubmit}
          >
            {loading ? <BtnLoader /> : "Submit"}
          </button>
        </div>
      </div>:null}
    </div>
  );
}
