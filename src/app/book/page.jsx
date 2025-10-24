"use client";

import React from 'react'
import Navbar from '../../components/Navbar.jsx';
import Form from '../../components/Form.jsx';

const page = () => {
  return (
    <>
        <div className="min-h-screen flex flex-col items-center bg-linear-to-bl from-primary to-secondary">
            <Navbar></Navbar>
            <span className="text-black font-medium text-4xl mt-10">Schedule your visit to ACE Campus Food Pantry</span>
            <button className="btn mt-10 text-2xl border p-2 rounded-2">Learn More</button>
            <Form></Form>
        </div>
    </>
  )
}

export default page