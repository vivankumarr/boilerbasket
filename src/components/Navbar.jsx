"useclient";

import React from 'react'

const Navbar = () => {
  return (
    <>
        <div className="flex flex-row items-center justify-center bg-lightprimary w-full h-15">
            <div className="flex h-full w-full justify-start items-center p-2">
                <span className="ml-10">BoilerBasket</span>
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