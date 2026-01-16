import Image from "next/image";
import Link from "next/link";
import Menu from "../components/Menu";
import Navbar from "../components/Navbar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen flex">
      {/*Left*/}
      <div className="w-[15%] md:w-[8%] lg:w-[16%] xl:w-[14%] bg-white p-4 overflow-y-auto ">
        <Link href="/" className="flex items-center justify-center gap-2 ">
          <Image src="/logo.png" alt="logo" width={32} height={32} />
          <span className="hidden md:block text-black">LotusSoft</span>
        </Link>
        <Menu />
      </div>
      {/*Right*/}
      <div className="w-[86%] md:w-[92%] bg-[#F2F0EF] overflow-scroll">
        <Navbar />
        {children}
      </div>
    </div>
  );
}
