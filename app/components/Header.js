import Link from "next/link";
import { usePathname } from "next/navigation";
export default function Header() {
  const pathname = usePathname();
  return (
    <div>
      {/* Header */}
      <header className="flex items-center w-full justify-between px-8 py-4">
        {pathname === "/" ?
          
        <button className="text-[#000000] font-primary font-normal text-[12px]">HOW IT WORKS?</button>
        : 
        <div className="flex justify-center items-center gap-5">
        <Link href="/">
        <button className="text-[#000000] font-normal font-primary text-[12px]">GO BACK</button>
        </Link>
         <button className="text-[#000000] font-normal font-primary text-[12px]">HOW IT WORKS?</button>
       </div> 
        }
        
        <div className="flex gap-10">
       
          <Link href="/form">
            <button className="text-[#FF0000] font-normal font-primary text-[12px]">CREATE TOKEN</button>
          </Link>
          <button className="text-[#000000] font-normal font-primary text-[12px]">CONNECT WALLET</button>
        </div>
      </header>
    </div>
  )
}