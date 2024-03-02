"use client";

import Link from "next/link";
import React, { FC, useEffect, useState } from "react";
import NavItems from "./NavItems";
import ThemeSwitcher from "../utils/ThemeSwitcher";
import { HiOutlineMenuAlt3, HiOutlineUserCircle } from "react-icons/hi";
import CustomModal from "./CustomModal";
import Login from "./Auth/Login";
import Signup from "./Auth/Signup";
import Verification from "./Auth/Verification";
import { useSelector } from "react-redux";
import Image from "next/image";
import avatar from "../../public/assets/avatar.png";
import { useSession } from "next-auth/react";
import { useLogOutQuery, useSocialAuthMutation } from "@/redux/features/auth/authApi";
import toast from "react-hot-toast";

type Props = {
  open: boolean;
  setOpen: (opem: boolean) => void;
  activeItem: number;
  setActiveItem: (activeItem: number) => void;
  route: string;
  setRoute:(route: string)=>void
};

const Header: FC<Props> = ({ activeItem, setOpen,open, route,setRoute }) => {
  const [active, setActive] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(false);
  const {user}=useSelector((state:any)=>state.auth);
  const {data} = useSession();
  const [socialAuth,{isSuccess,isError}] =useSocialAuthMutation();
  const [logout,setLogout]= useState(false);
    const {}= useLogOutQuery(undefined,{
        skip:!logout ?true:false,
    });
  useEffect(()=>{
    if(!user){
      if(data){
         socialAuth({email:data.user?.email,name: data.user?.name,avatar:data.user?.image})
      }      
    }
    if(data !== null && isSuccess ){
      toast.success("Login succesfull");
    }
    if(data===null){
      // setLogout(true);
    }
  },[data,user])
  if (typeof window !== "undefined") {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 80) {
        setActive(true);
      } else {
        setActive(false);
      }
    });
  }
  // console.log(user)

  const handleClose = () => {
    setOpenSidebar(!openSidebar);
  };

  return (
    <div className="w-full relative ">
      <div
        className={`${
          active
            ? "dark:bg-opacity-50 dark:bg-gradient-to-b dark:from-gray-900 dark:to-black fixed top-0 left-0 w-full h-[80px] z-[80] border-b dark:border-[#ffffff1c] shadow-xl transition duration-500"
            : "w-full border-b dark:border-[#ffffff1c] h-[80px] z-[80] shadow"
        }`}
      >
        <div className="w-[95%] 800px:w-[92%] mx-auto py-2 h-full ">
          <div className="w-full h-[80px] flex items-center justify-between p-3">
            <div>
              <Link
                href={"/"}
                className={`text-[25px] font-Poppins font-[500] text-black dark:text-white`}
              >
                <h1>SoMedia</h1>
              </Link>
            </div>
            <div className="flex items-center">
              <NavItems activeItem={activeItem} isMobile={false} />
              <ThemeSwitcher />
              {/* for mobile */}
              <div className="800px:hidden">
                <HiOutlineMenuAlt3
                  size={25}
                  className="cursor-pointer dark:text-white text-black"
                  onClick={() => setOpenSidebar(!openSidebar)}
                />
              </div>
              {user?
              (
                <>
                <Link href={"/profile"}>
                <Image
                src={user.avatar? user.avatar:avatar}
                alt="user profile"
                className="w-[30px] h-[30px] rounded-full cursor-pointer"
                />
                </Link>
                </>
              )
              :(
                <HiOutlineUserCircle
                size={25}
                className="hidden 800px:block cursor-pointer  dark:text-white text-black"
                onClick={() => setOpen(true)}
              />
              )              
            }
              
            </div>
          </div>
        </div>
        {/* mobile sidebar here handleClose fun diff 45.16*/}
        {openSidebar && (
          <div
            className="fixed w-full h-screen top-0 left-0 z-[99999] dark:bg-[unset] bg-[#00000024]"
            onClick={handleClose}
            id="screen"
          >
            <div className="w-[70%] fixed z-[99999999] h-screen bg-white dark:bg-slate-900 dark:bg-opacity-90 top-0 right-0">
              <NavItems activeItem={activeItem} isMobile={true} />
              {user?
              (
                <>
                <Link href={"/profile"}>
                <Image
                src={user.avatar? user.avatar:avatar}
                alt="user profile"
                className="w-[30px] h-[30px] rounded-full cursor-pointer"
                />
                </Link>
                </>
              )
              :(
              <HiOutlineUserCircle
                size={25}
                className="cursor-pointer ml-5 my-2  dark:text-white text-black"
                onClick={() => setOpen(true)}
              />
              )
}
              <br />
              <br />
              <div>
              <p className="text-[16px] px-2 pl-5 text-black dark:text-white">
              Copyright 2024
              </p>
              </div>
              
            </div>
          </div>
        )}
      </div>
      {
        route === "Login" && (
          <>
          {open && (
            <CustomModal 
              open={open}
              setOpen={setOpen}
              setRoute={setRoute}
              activeItem={activeItem}
              component={Login}
              />
        )}
          </>
        )
      }
      {
        route === "Signup" && (
          <>
          {open && (
            <CustomModal 
              open={open}
              setOpen={setOpen}
              setRoute={setRoute}
              activeItem={activeItem}
              component={Signup}
              />
        )}
          </>
        )
      }
      {
        route === "Verification" && (
          <>
          {open && (
            <CustomModal 
              open={open}
              setOpen={setOpen}
              setRoute={setRoute}
              activeItem={activeItem}
              component={Verification}
              />
        )}
          </>
        )
      }
    </div>
  );
};

export default Header;
