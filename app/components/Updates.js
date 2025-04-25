"use client";
import InfiniteScroll from "react-infinite-scroll-component";
import { BtnLoader, Loader } from "./Loader";
import { supabase, supabaseTable } from "../services/supabase";
import { useEffect, useState } from "react";
import { getAddress } from "../utils/helperFn";

export default function Updates({ token }) {
  const [comment, setComment] = useState("");
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalDataCount, setTotalDataCount] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const rowsPerPage = 10;
  const [errors, setErrors] = useState();
  const [submit,setSubmit]=useState(false)

  const fetchUpdates = async (page, search = "") => {
    try {
      if (updates.length === 0) setLoading(true);
      const start = (page - 1) * rowsPerPage;
      const end = start + rowsPerPage - 1;

      let query = supabase
        .from(supabaseTable.update)
        .select("*", { count: "exact" })
        .eq("tokenAddress", token?.tokenAddress) // Filter by tokenAddress
        .order("created_at", { ascending: false })
        .range(start, end);

      const { data, error, count } = await query;
      if (error) {
        console.log("Error fetching data:", error);
        setLoading(false);
        return;
      }
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
      setSubmit(true);
      const { data, error } = await supabase
        .from(supabaseTable.update) // Ensure "update" is your actual table name
        .insert([{ update: comment, tokenAddress: token?.tokenAddress }]);

      if (error) {
        throw error; // Properly throw the error
      }


      // const updateObj = {
      //     tokenAddress:token?.tokenAddress,
      //     description: [
      //         {
      //             content: comment,
      //             updateAt: new Date(),
      //             id: new Date()
      //         }
      //     ]
      // }


      // const { data, error } = await supabase
      //     .from("updates")
      //     .upsert(
      //         updateObj,
      //         { onConflict: ["tokenAddress"] }
      //     )
      //     .select();

      // if (!error && data.length > 0) {
      // If the row already exists, update description by appending new data
      // const { error: updateError } = await supabase.rpc("append", {
      //         p_tokenaddress: token?.tokenAddress,
      //         p_new_value: updateObj.description[0]
      //     })

      //     if (updateError) {
      //         console.error("Error updating description:", updateError);
      //     } else {
      //         console.log("Description updated successfully");
      //     }
      // } else if (error) {
      //     console.error("Error inserting/updating:", error);
      // }
      setCurrentPage(1); // Reset to first page
      fetchUpdates(1, searchQuery);
      setComment(""); // Clear input after success
    } catch (error) {
      setErrors(error.message); // Store error message
      console.error("Error inserting data:", error);
    } finally {
      setSubmit(false); // Ensure loading is stopped
    }
  };

  return (
    <div >
        {getAddress() !== token?.address ? (
          <div className="flex flex-col md:flex-row mt-4 items-center gap-3 justify-between rounded-lg w-full">
            <div className="flex flex-col w-full flex-1">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add an update..."
                className="flex-1 placeholder:text-[14px] md:placeholder:text-[18px] text-black bg-gray-200 w-full px-3 py-2 rounded-lg outline-none mb-0 resize-none"
              />
              {errors && <p className="text-red-500 text-sm">{errors}</p>}
            </div>
           
            <div className="w-full md:w-fit  h-10">
              <button
                className="w-full px-4 py-2 bg-black text-white rounded-lg flex items-center justify-center gap-3 font-normal font-primary text-[14px] md:text-[16px]"
                type="button"
                onClick={handleSubmit}
              >
                {submit ? (
                  <BtnLoader className="text-white" />
                ) : (
                  <span className="inline-block w-[60px] text-center">Submit</span>
                )}
              </button>
            </div>
            </div>
          
        ) : null}
      <InfiniteScroll
        dataLength={updates.length}
        next={fetchMoreUpdate}
        hasMore={updates.length < totalDataCount}
        // scrollThreshold={"50%"}
        height={'40vh'}
       
      >
        {loading ?
          <div className="flex items-center w-[100%] justify-center h-64">
            <Loader className="text-[#7C7C7C]" size="text-6xl" />
          </div>
          :
          <div >
            {updates && updates.length ? updates.map((update, index) => (
              <div key={index} className='w-[90%] py-4'>
                <div className='flex flex-col items-start gap-3'>
                  {/* <p className="font-bold text-[#000000] font-primary text-[14px]">{update.name}</p> */}
                  <p className='text-[#000000] font-primary font-normal text-[12px] md:text-[16px]'>
                    {update.update}
                  </p>
                  <p className='text-[#000000] font-primary font-normal text-[12px]'>
                    Date: {new Date(update.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )) : updates && !updates.length && <div className="flex items-center w-[100%] justify-center h-64">
                <p className='text-[#000000] font-primary font-normal text-[16px]'>No Updates</p>
            </div>}
          </div>

        }
      </InfiniteScroll>
    </div>
  );
}
