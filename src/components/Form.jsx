"use client";

import { useState, useEffect } from 'react'

const Form = () => {
    const [name, setName] = useState('');
    const [puid, setPuid] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');

    //debugging
    useEffect(() => {
      console.log(name);
      console.log(role);
      console.log(puid);
      console.log(email);
    }, [name, role, puid, email]);

  return (
    <>
        <div className="bg-white shadow-2xl h-150 w-100 p-5 mt-10 mb-10 rounded-2xl">
            <span className="text-2xl">Book Your Appointment</span>
            <div className="flex flex-col items-center">
              <div className="grid grid-cols-2 grid-rows-2 gap-4 mt-4">
                  <div>
                    <span>Full Name</span>
                    <input onChange={(e) => {setName(e.target.value)}} className="border" type="text" />
                  </div>
                  <div>
                    <span>Role</span>
                    <select onChange={(e) => {setRole(e.target.value)}} className="border h-6.5 w-45" name="roles" id="">
                      <option value="default"></option>
                      <option value="student">Student</option>
                      <option value="staff">Staff</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <span>Email Address</span>
                    <input onChange={(e) => {setEmail(e.target.value)}} className="border"type="text" />
                  </div>
                  <div>
                    <span>PUID</span>
                    <input onChange={(e) => {setPuid(e.target.value)}}className="border" type="text" />
                  </div>
              </div>

              <div className="mt-5">
                <span>Select Date</span>
                <div id="Dates" className="w-full h-30">

                </div>
              </div>

              <div className="mt-5">
                <span>Select Time</span>
                <div id="times" className="w-full h-30">

                </div>
              </div>

              <button className="btn bg-secondary pt-2 pb-2 pr-1 pl-1 rounded-sm w-50 text-white">Confirm Booking</button>

            </div>
        </div>
    </>
  )
}

export default Form