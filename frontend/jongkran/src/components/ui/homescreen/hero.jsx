import React from 'react'
import { Link } from 'react-router-dom'
const Hero = () => {
  return (
        <div className="min-h-[520px] bg-white/70 flex items-center">
            <div className="mx-[25px] max-w-2xl">
              <h1 className="page-title ">
                What recipe is waiting in your kitchen today?
              </h1>

              <p className="mt-5 text-base md:text-xl">
                JongKran helps users discover recipes based on ingredients they
                already have.
              </p>

              <Link
                to="/input-ingredients"
                className="inline-block mt-8 bg-[#468432] hover:bg-[#1A5C05] text-white px-10 py-3 rounded-md font-semibold"
              >
                Start Cooking
              </Link>
            </div>
          </div>
  )
}

export default Hero
