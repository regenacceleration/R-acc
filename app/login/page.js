'use client'
import { LogIn } from "../components/LogIn";
import { useEffect } from "react";
import { supabase } from "../services/supabase";
import { useRouter } from "next/navigation";


export default function LogInPage() {

  const router = useRouter()
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser()
      if (data?.user) {
        router.push('/form-details')
      }
    })()
  }, [])
  return (
  <div>
    <LogIn />
    </div>
    )
}
