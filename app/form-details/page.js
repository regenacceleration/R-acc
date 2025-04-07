'use client'
import { useEffect } from "react";
import { CreateTokenDetails } from "../components/CreateTokenDetails";
import { supabase } from "../services/supabase";
import { useRouter } from "next/navigation";

export default function FormPageDetails() {

  const router=useRouter()
 
  useEffect(() => {
    (async() => {
      const { data, error } = await supabase.auth.getUser()
      if (error || !data?.user) {
        router.push('/login')
      }
    })()
  }, [])
  
  return (
  <div>
    <CreateTokenDetails />
    </div>
    )
}
