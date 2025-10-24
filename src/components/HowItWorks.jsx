import React from 'react'

const Navbar = () => {
    const steps = [
        {
            title: "Fill out some basic info",
            desc: "Provide your name, role, email, and PUID in the appointment form above.",
            num: 1,
        },
        {
            title: "Choose your time slot",
            desc: "Select a date and a 30-minute time window from the available appointment times.",
            num: 2,
        },
        {
            title: "Receive a confirmation email",
            desc: "Get an instant email confirming your appointment details and instructions.",
            num: 3,
        },
        {
            title: "Visit the pantry",
            desc: "Come at your scheduled time for a smooth check-in and pickup!",
            num: 4,
        },
    ];

    return (
        <section aria-labelledby="how-it-works-heading" className="w-full bg-purple-100 py-16 px-6 md:px-12 lg:px-24">
            <div className="max-w-6xl mx-auto text-center">
                <h2 id="how-it-works-heading" className="text-3xl md:text-4xl font-extrabold text-gray-900">
                    How It Works
                </h2>
            <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
                Simple steps to schedule your next visit
            </p>

            <ol className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {steps.map((s) => (
                    <li key={s.num} className="flex flex-col items-center text-center">
                        <div aria-hidden="true" className={`flex items-center justify-center w-20 h-20 rounded-full shadow-md text-white font-bold text-xl ${
                            s.num === 4 ? "bg-yellow-500 text-gray-900" : "bg-purple-600 dark:bg-purple-500"
                        }`}>
                            {s.num}
                        </div>

                        <h3 className="mt-4 font-semibold text-lg text-gray-900">{s.title}</h3>
                        <p className="mt-2 text-sm text-gray-600 max-w-xs">{s.desc}</p>
                    </li>
                ))}
            </ol>
            </div>
        </section>
    )
}

export default Navbar