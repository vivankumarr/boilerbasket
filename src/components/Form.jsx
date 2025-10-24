"use client";

import { useState } from 'react'

const Form = () => {
    const [name, setName] = useState('');
    const [puid, setPuid] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');

  return (
    <>
        <div className="bg-white shadow-2xl h-150 w-100 p-5 mt-10 mb-10 rounded-2xl">
            <span className="text-2xl">Book Your Appointment</span>
            <div className="flex flex-col items-center">
            </div>
        </div>
    </>
  )
}

export default Form