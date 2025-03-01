"use client"
import { supabase } from "../../services/supabase";
import Header from "../../components/Header";
import { Loader } from "../../components/Loader";
import TokenCard from "../../components/TokenCard";
import React, { useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";



export default function Home() {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalDataCount, setTotalDataCount] = useState(null);
  // const containerRef = useRef(null);
  // const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const rowsPerPage = 3

  const fetchToken = async (page, search = "") => {
    try {
      if (tokens.length === 0) setLoading(true);
      const start = (page - 1) * rowsPerPage;
      const end = start + rowsPerPage - 1;

      let query = supabase
        .from("token")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(start, end);

      if (search.trim() !== "") {
        query = query.ilike("name", `%${search}%`); // Case-insensitive search
      }

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
        setTokens((prevTokens) => (page === 1 ? data : [...prevTokens, ...data]));
      }

      setLoading(false);
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setSearchQuery(newValue);
    setTokens([]); // Clear previous tokens
    setCurrentPage(1); // Reset pagination
    fetchToken(1, newValue);
  };

  useEffect(() => {
    fetchToken(currentPage, searchQuery);
  }, [currentPage, searchQuery]);

  const fetchMoreToken = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  // const fetchToken = async () => {
  //   if (loading || !hasMore) return;
  //   setLoading(true);

  //   let query = supabase.from('token')
  //     .select('*')
  //     // .range(page * POSTS_PER_PAGE, (page + 1) * POSTS_PER_PAGE - 1)
  //     .order('created_at', { ascending: false });

  //   if (searchQuery) {
  //     query = query.ilike('name', `%${searchQuery}%`);
  //   }

  //   const { data, error } = await query;

  //   if (error) console.error('Error fetching data:', error);

  //   if (!data || data.length < POSTS_PER_PAGE) {
  //     setHasMore(false);
  //   }

  //   if (page === 0) {
  //     setTokens(data || []);
  //   } else {
  //     setTokens(prev => [...prev, ...(data || [])]);
  //   }

  //   setPage(prev => prev + 1);
  //   setLoading(false);
  // };

  // const handleInputChange = (e) => {
  //   const newValue = e.target.value;
  //   setSearchQuery(newValue);
  //   if (newValue === "") {
  //     fetchToken(); // If input is cleared, fetch all data
  //   }
  // };

  // useEffect(() => {
  //   setPage(0);
  //   setHasMore(true);
  //   setTokens([]);
  //   fetchToken();
  // }, [searchQuery]);

  // useEffect(() => {
  //   const container = containerRef.current;
  //   if (!container) return;

  //   const observer = new IntersectionObserver(
  //     entries => {
  //       const target = entries[0];
  //       if (target.isIntersecting && hasMore && !loading) {
  //         fetchToken();
  //       }
  //     },
  //     {
  //       root: null,
  //       rootMargin: '20px',
  //       threshold: 0.1,
  //     }
  //   );

  //   observer.observe(container);

  //   return () => observer.disconnect();
  // }, [hasMore, loading, page]);





  return (
    <div className="min-h-screen bg-gray-50 ">
      <Header />
      <div className="flex flex-col mt-[1rem] justify-center items-center">
        <h1 className="text-[#000000] font-primary font-black text-[68px]">r/acc</h1>
        <p className="text-[#7F7F7F] font-normal text-[17px] font-primary ">degen to regen pipeline</p>
        <div className="flex justify-center mt-[2rem] gap-3 w-full items-end">
          {/* <input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            className="border-b-[1px] outline-none text-black font-primary w-[28%] bg-gray-50 border-[#D5D5D5] rounded px-4 py-2"
          />
          <button className="text-[#000000] font-normal font-primary text-[13px]">SEARCH</button> */}
        </div>

      </div>


      {/* Navigation */}
      {/* <div className="flex mt-[3rem]  mb-10 justify-center items-center">
        <nav className="flex justify-center items-center w-[95%] border-y-[1px] border-gray-300 px-8 py-4">
          <button className="text-[#FF0000] font-normal font-primary text-[13px] px-4">FEATURED</button>
          <button className="text-[#000000] font-normal font-primary text-[13px] px-4">MARKET CAP</button>
          <button className="text-[#000000] font-normal font-primary text-[13px] px-4">HODLERS</button>
          <button className="text-[#000000] font-normal font-primary text-[13px] px-4">DATE</button>
          <button className="text-[#000000] font-normal font-primary text-[13px] px-4">TRENDING</button>
        </nav>
      </div> */}


      {/* Token Cards */}
      {/* {loading ?
        <div className="flex items-center justify-center h-64">
          <Loader className="text-[#7C7C7C]" size="text-6xl" />
        </div>
        :
        <InfiniteScroll
        dataLength={tokens.length}
        next={fetchToken}
        hasMore={hasMore}
        loader={loading}
        endMessage={<p>No more Tokens to load</p>}
      >
        
       <p></p>
        </InfiniteScroll>
      } */}


      <InfiniteScroll
        dataLength={tokens.length}
        next={fetchMoreToken}
        hasMore={tokens.length < totalDataCount}
        scrollableTarget='scrollableDiv'
      >
        <div
          className="h-full mt-5 flex items-center justify-center"
        >
          {loading ?
            <div className="flex items-center justify-center h-64">
              <Loader className="text-[#7C7C7C]" size="text-6xl" />
            </div>
            :
            <TokenCard tokens={tokens} />
          }

        </div>
      </InfiniteScroll>


    </div>
  );
}
