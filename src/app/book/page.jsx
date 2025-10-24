"use client";

import React from 'react'
import Navbar from '../../components/Navbar.jsx';
import Form from '../../components/Form.jsx';

const page = () => {
  return (
    <>
      <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-purple-50 via-purple-100 to-[#fff9c4]">
        <Navbar />
        <span className="text-black font-medium text-5xl mt-10 text-center">
          Schedule your visit to<br />
          <span className="font-bold text-purple-900">ACE Campus Food Pantry</span>
        </span>
        <a
          href="https://acefoodpantry.wixsite.com/website"
          target="_blank"
          rel="noopener noreferrer"
        >
          <button className="btn mt-10 text-xl border p-2 rounded-2">
            Learn More
          </button>
        </a>
        <Form />
      </div>
    </>
  )
}

export default page;
