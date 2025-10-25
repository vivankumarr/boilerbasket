"use client";

import Image from "next/image";

import { useRouter } from 'next/navigation'

const Navbar = () => {

  const router = useRouter();

  const handleLogin = () => {
    router.push('/login');
  }

  return (
    <div className="flex flex-row items-center justify-between bg-yellow-50 w-full h-15 px-4">
      <div className="flex items-center">
        <Image
          className="ml-5"
          src="/boilerbasket-logo.png"
          alt=""
          width={40}
          height={40}
        />
        <span className="ml-5 font-bold text-lg">BoilerBasket</span>
      </div>
      <div className="flex items-center gap-4 mr-5">
        <span className="text-gray-800 font-bold cursor-pointer text-sm">About</span>
        <span className="text-gray-800 font-bold cursor-pointer text-sm">Contact</span>
        <button className="bg-purple-900 text-white text-sm font-bold px-3 py-1 rounded">
          Staff Login
        </button>
      </div>
    </div>
  );
};

export default Navbar;
