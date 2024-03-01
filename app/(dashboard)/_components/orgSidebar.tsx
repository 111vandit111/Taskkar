"use client";

import Link from "next/link";
import Image from "next/image";
import { Poppins } from "next/font/google";
import { OrganizationSwitcher } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Star } from "lucide-react";
import { useSearchParams } from "next/navigation";

const poppins = Poppins({ subsets: ["latin"], weight: ["600"] });

const OrganizationSidebar = () => {
  const searchParams = useSearchParams();
  const favourites = searchParams.get("favourites");

  return (
    <div className="hidden h-full md:flex flex-col gap-4 p-3 px-8 bg-[#f7eaf7] bg-opacity-65 backdrop-filter backdrop-blur">
      <Link href={"/"}>
        <div className="flex items-center gap-2">
          <Image src={"/taskkar.png"} alt="logo" width={35} height={35} />
          <p className={`${poppins.className} text-black text-xl`}>Taskkar</p>
        </div>
      </Link>

      <OrganizationSwitcher
        hidePersonal
        appearance={{
          elements: {
            rootBox: {
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            },
            organizationSwitcherTrigger: {
              width: "100%",
              padding: "10px",
              borderRadius: "10px",
              border: "1px solid #e6e6e6",
              display: "flex",
              justifyContent: "space-between",
              backgroundColor: "#f7f7f7",
            },
          },
        }}
      />

      <div className="space-y-3 w-full">
        <Link href={"/"}>
          <Button
            size={"lg"}
            className="justify-start px-2 w-full gap-2 font-semibold mb-3"
            variant={favourites ? "ghost" : "default"}
          >
            <LayoutDashboard /> Team Pojects
          </Button>
        </Link>

        <Link href={{
          pathname:"/",
          query: {favourites: true}
        }} >
          <Button
            size={"lg"}
            className="justify-start px-2 w-full gap-2 font-semibold"
            variant={favourites ? "default" : "ghost"}
          >
            <Star /> Favourites
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default OrganizationSidebar;
