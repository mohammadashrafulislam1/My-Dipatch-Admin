import { MapPinIcon, PlusIcon } from "lucide-react";
import React, { useState } from "react";
import { GrUserWorker } from "react-icons/gr";
import { IoWifi } from "react-icons/io5";
import { LuClock3 } from "react-icons/lu";
import { BiWalletAlt } from "react-icons/bi";
import { BsCashCoin, BsChatLeftDots } from "react-icons/bs";
import { FaCar, FaMapMarkerAlt } from "react-icons/fa";
import { FiUsers } from "react-icons/fi";
import { IoCarSportOutline } from "react-icons/io5";
import { MdOutlineReviews } from "react-icons/md";
import { RiMenu2Line, RiRoadMapLine } from "react-icons/ri";
import { SlHome } from "react-icons/sl";
import { TbBrandGoogleAnalytics } from "react-icons/tb";
import { TfiAlignLeft } from "react-icons/tfi";
import { VscSignOut } from "react-icons/vsc";
import { NavLink } from "react-router-dom";

const Admin = () => {
  const [midwayStops, setMidwayStops] = useState([""]);

  const handleAddStop = () => {
    setMidwayStops([...midwayStops, ""]);
  };

  const handleStopChange = (index, value) => {
    const updatedStops = [...midwayStops];
    updatedStops[index] = value;
    setMidwayStops(updatedStops);
  };
  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden">
     
           {/* Nav Icon - Left */}
           <div className="drawer absolute top-4 left-4 lg:left-16 z-50 w-fit">
  <input id="my-drawer" type="checkbox" className="drawer-toggle" />
  <div className="drawer-content">
    {/* Page content here */}
    <label htmlFor="my-drawer" className="cursor-pointer">
        <div className="text-2xl text-black absolute w-fit h-fit">
          <RiMenu2Line />
        </div></label>
  </div>
  <div className="drawer-side">
    <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
    <ul className="menu bg-white text-base-content min-h-full w-72 p-4 overflow-y-auto">
      {/* Sidebar content here */}
      <img
        src="https://i.ibb.co/6R7N010X/Logo-transparent.png"
        alt=""
        className="w-[150px] mx-auto mb-5"
      />

      <NavLink
        to="/dashboard"
        className={({ isActive }) =>
          `menu-items poppins-regular flex gap-2 items-center mb-[2px] ${
            isActive ? 'bg-[#006eff2a] text-[#006FFF]' : ''
          }`
        }
      >
        <SlHome className="text-[16px]" />
        Dashboard
      </NavLink>

      <NavLink
        to="/"
        className={({ isActive }) =>
          `menu-items poppins-regular flex gap-2 items-center mb-[2px] ${
            isActive ? 'bg-[#006eff2a] text-[#006FFF]' : ''
          }`
        }
      >
        <IoCarSportOutline className="text-[16px]" />
        Start Working
      </NavLink>

      <NavLink
        to="/dashboard/orders"
        className={({ isActive }) =>
          `menu-items poppins-regular flex gap-2 items-center mb-[2px] ${
            isActive ? 'bg-[#006eff2a] text-[#006FFF]' : ''
          }`
        }
      >
        <TfiAlignLeft className="text-[16px]" />
        Order Lists
      </NavLink>

      <NavLink
        to="/dashboard/customers"
        className={({ isActive }) =>
          `menu-items poppins-regular flex gap-2 items-center mb-[2px] ${
            isActive ? 'bg-[#006eff2a] text-[#006FFF]' : ''
          }`
        }
      >
        <FiUsers className="text-[16px]" />
        Customers
      </NavLink>

      <NavLink
        to="/dashboard/analytics"
        className={({ isActive }) =>
          `menu-items poppins-regular flex gap-2 items-center mb-[2px] ${
            isActive ? 'bg-[#006eff2a] text-[#006FFF]' : ''
          }`
        }
      >
        <TbBrandGoogleAnalytics className="text-[16px]" />
        Analytics
      </NavLink>

      <NavLink
        to="/dashboard/reviews"
        className={({ isActive }) =>
          `menu-items poppins-regular flex gap-2 items-center mb-[2px] ${
            isActive ? 'bg-[#006eff2a] text-[#006FFF]' : ''
          }`
        }
      >
        <MdOutlineReviews className="text-[16px]" />
        Reviews
      </NavLink>

      <NavLink
        to="/dashboard/earnings"
        className={({ isActive }) =>
          `menu-items poppins-regular flex gap-2 items-center mb-[2px] ${
            isActive ? 'bg-[#006eff2a] text-[#006FFF]' : ''
          }`
        }
      >
        <BsCashCoin className="text-[16px]" />
        Earnings
      </NavLink>

      <NavLink
        to="/dashboard/pricing"
        className={({ isActive }) =>
          `menu-items poppins-regular flex gap-2 items-center mb-[2px] ${
            isActive ? 'bg-[#006eff2a] text-[#006FFF]' : ''
          }`
        }
      >
        <RiRoadMapLine className="text-[16px]" />
        Pricing
      </NavLink>

      <NavLink
        to="/dashboard/chat"
        className={({ isActive }) =>
          `menu-items poppins-regular flex gap-2 items-center mb-[2px] ${
            isActive ? 'bg-[#006eff2a] text-[#006FFF]' : ''
          }`
        }
      >
        <BsChatLeftDots className="text-[16px]" />
        Chat
      </NavLink>

      <NavLink
        to="/dashboard/wallet"
        className={({ isActive }) =>
          `menu-items poppins-regular flex gap-2 items-center mb-[2px] ${
            isActive ? 'bg-[#006eff2a] text-[#006FFF]' : ''
          }`
        }
      >
        <BiWalletAlt className="text-[16px]" />
        Wallet
      </NavLink>
      <div className="divider mt-[20px] mb-0"></div>
      <NavLink
        to="/logout"
        className="pl-[12px] pt-[6px] poppins-regular flex gap-2 items-center"
      >
        <VscSignOut className="text-[16px]" />
        Sign Out
      </NavLink>
    </ul>
  </div>
</div>
      {/* Top section */}
      <div className="bg-[#f8f8f8] mx-auto w-full md:flex items-center lg:px-16 px-4 py-4 lg:py-12 relative ">
        <div className="bg-[#f8f8f8] overflow-hidden md:h-[504px]">
          {/* === Background Shapes Behind the Form === */}
  <img
    src="https://i.ibb.co/0yDtbMGz/Chat-GPT-Image-Jul-4-2025-11-46-42-PM.png" // abstract blob
    alt="abstract blob"
    className="absolute right-[-140px] top-[-280px] w-[76%] opacity-25"
  />
  <img
    src="https://i.ibb.co/6JBWTb0w/Chat-GPT-Image-Jul-4-2025-11-46-22-PM.png" // grid/map style
    alt="grid background"
    className="absolute right-[-6px] opacity-75 top-[-30px] w-[50%]"
  />
       </div>
  {/* Left Column */}
  <div className="lg:w-[40%] w-full md:mt-0 mt-10 md:mb-0 mb-10 !z-10">
          <h1 className="text-4xl md:text-3xl lg:text-7xl poppins-semibold text-blue-900 leading-tight mb-4">
            Book Errands <br /> Instantly
          </h1>
          <p className="text-2xl poppins-medium text-black mb-6">
            Pickup • Drop-off • Midway Stops <br />
            — On-Demand
          </p>
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl text-lg font-semibold">
            Book Now
          </button>

        </div>
        {/* middle graphic */}
        <div className="absolute md:left-[35%] left-[50%] w-[28%] md:top-[15%] top-[30%]">
          <img src="https://i.ibb.co/ZRs9bh01/Chat-GPT-Image-Jul-3-2025-12-16-56-PM-removebg-preview.png" alt="" 
          className="w-full"/>
        </div>
        {/* Right Column (Form) */}
        <div className="bg-white w-full rounded-2xl shadow-md p-6 md:p-8 ml-auto md:w-[40%] mb-[-150px] !z-10">
      <h2 className="text-4xl font-bold poppins-semibold text-blue-900 mb-6">Book an Errand</h2>

      <form className="space-y-4">
        {/* Pickup Location */}
        <div className="relative">
          <MapPinIcon className="w-5 h-5 text-orange-500 absolute left-3 top-3.5" />
          <input
            type="text"
            placeholder="Pickup Location"
            className="w-full border border-gray-300 rounded-md pl-10 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Drop-off Location */}
        <div className="relative">
          <MapPinIcon className="w-5 h-5 text-blue-600 absolute left-3 top-3.5" />
          <input
            type="text"
            placeholder="Drop-off Location"
            className="w-full border border-gray-300 rounded-md pl-10 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Midway Stops */}
        {midwayStops.map((stop, index) => (
          <input
            key={index}
            type="text"
            value={stop}
            onChange={(e) => handleStopChange(index, e.target.value)}
            placeholder={`Midway Stop ${index + 1}`}
            className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        ))}

        {/* Add Midway Stop */}
        <button
          type="button"
          onClick={handleAddStop}
          className="flex items-center hover:underline text-md text-gray-500 poppins-regular"
        >
          <PlusIcon className="w-5 h-5 mr-1 text-blue-600 text-xl font-bold" />
          Add Midway Stop
        </button>

        {/* Message Box */}
        <textarea
          placeholder="Message/Instructions"
          className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="3"
        ></textarea>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl text-lg font-semibold"
        >
          Get Instant Quote
        </button>
      </form>
    </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="bg-white lg:py-12 md:mt-0 mt-44">
        <div className="lg:px-24 !px-14 mx-auto text-start">
          <h3 className="text-2xl text-gray-800 mb-10 poppins-semibold">Why Choose Us?</h3>
          <div className="grid md:grid-cols-2 grid-cols-1 lg:grid-cols-4 lg:gap-6 gap-3 text-sm font-medium text-gray-800">
            
          <div className="flex flex-row items-center gap-3">
              <LuClock3 className="lg:text-6xl text-6xl md:text-3xl text-blue-800"/>
              <span className="text-xl poppins-regular">Fast Delivery</span>
            </div>
            <div className="flex flex-row items-center gap-3">
              <GrUserWorker className="lg:text-6xl text-6xl md:text-3xl text-orange-500"/>
              <span className="text-xl poppins-regular">Trusted Drivers</span>
            </div>
            <div className="flex flex-row items-center gap-3">
              <IoWifi className="lg:text-6xl text-6xl md:text-3xl text-blue-800"/>
              <span className="text-xl poppins-regular">Real-Time Updates</span>
            </div>
            <div className="flex flex-col md:items-end items-center justify-center">
            <span className="text-xl poppins-regular">Contact/Support</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
