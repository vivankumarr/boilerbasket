"use client";

import Image from "next/image";

import { useRouter } from 'next/navigation'

const Navbar = () => {

  const router = useRouter();

  const handleLogin = () => {
    router.push('/login');
  }

  return (
    <div className="flex flex-row items-center justify-between w-full min-h-[60px] py-2 md:px-4">
      <div className="flex items-center">
        <Image
          className="ml-5"
          src="/boilerbasket-logo.png"
          alt="BoilerBasket Logo"
          width={50}
          height={50}
        />
        <span className="ml-2 md:ml-5 mt-1 font-bold text-lg md:text-xl text-gray-900">BoilerBasket</span>
      </div>
      <div className="flex items-center gap-8 mr-5">
        <a
          href="https://acefoodpantry.wixsite.com/website/contact-us"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="text-gray-800 font-bold cursor-pointer text-base hover:text-purple-700 transition duration-200">Contact</span>
        </a>
        <button onClick={() => handleLogin()}className="bg-purple-900 text-white cursor-pointer text-base font-bold px-3 py-1 rounded shadow-md hover:bg-purple-800 hover:scale-105 transition transform duration-200">
          Staff Login
        </button>
      </div>
    </div>
  );
};

export default Navbar;
