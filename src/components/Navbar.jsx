"useclient";

import Image from "next/image";

const Navbar = () => {
  return (
    <>
        <div className="flex flex-row items-center justify-center bg-lightprimary w-full h-15">
            <div className="flex h-full w-full justify-start items-center p-2">
                <Image className="ml-5"src="/boilerbasket-logo.png" alt="" width={40} height={40}></Image>
                <span className="ml-5">BoilerBasket</span>
            </div>
            <div className="flex h-full w-full justify-end items-center p-2">
                <button className="btn mr-10">About</button>
                <button className="btn mr-10">Contact</button>
                <button className="btn mr-5">Staff Login</button>
            </div>
        </div>
    </>
  )
}

export default Navbar