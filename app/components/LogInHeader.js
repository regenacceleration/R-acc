"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, LogOut } from "lucide-react";
import { supabase } from "../services/supabase";



export default function LogInHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const logOut = async() => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Logout error:", error.message);
  router.push("/login");
  }
  return (
    <div>
      {/* Header */}
      <header >
        {pathname === "/login" ? (
          <Link href='/'>
            <div style={{cursor:"pointer"}} className='flex items-center w-full justify-between px-8 py-4'>
              <Home className="text-black" />
            </div>
          </Link>

        ) : (
          <div className="flex items-center w-full justify-between px-8 py-4" >
            <Link href='/'>
              <div style={{cursor:"pointer"}} className='flex' >
                <Home className="text-black" />
              </div>
            </Link>
            <div style={{cursor:"pointer"}} className='flex '>
              <LogOut className="hover:text-[#FF0000] text-black" onClick={logOut} />
            </div>
          </div>
        )}




      </header>

    </div>
  );
}
