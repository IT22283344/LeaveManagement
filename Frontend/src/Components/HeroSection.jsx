import { AOS } from 'aos';
import React from 'react';
import { Link } from 'react-router-dom';
import 'aos/dist/aos.css';

const HeroSection = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between p-28 bg-white">
      {/* Left Side - Text */}
      <div className="md:w-1/2 space-y-6" data-aos="fade-up">
        <h2 className="text-lg font-semibold font-sans">
          This is the <span className="text-indigo-600">NEW</span> HostelNest.
        </h2>
        <h1 className="text-4xl font-bold font-sans">
          Helping you <span className="text-indigo-600">connect with students.</span> Even <span className="text-indigo-600">before</span> you get to your hostel.
        </h1>
        
        {/* Button */}
        <div>
          <Link to='/category'>
          <button className="bg-black hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg inline-flex items-center">
            Check what's new
          </button>
          </Link>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="mt-6 md:mt-0 md:w-1/2 flex justify-end" data-aos="slide-left">
      
        <img
          src="/img/hostel.png" // You can replace with the actual image URL
          alt="Travellers in Tuk-Tuk"
          className="rounded-xl shadow-lg"
        />
      </div>
      
    </div>
  );
};

export default HeroSection;
