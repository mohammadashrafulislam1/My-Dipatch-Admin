import { useEffect, useState } from "react";
import {
  BiSupport,
  BiWalletAlt,
} from "react-icons/bi";
import {
  BsArrowLeftSquareFill,
  BsCashCoin,
  BsChatLeftDots,
  BsCircleFill,
} from "react-icons/bs";
import {
  FiBell,
  FiMessageSquare,
  FiSettings,
  FiUsers,
} from "react-icons/fi";
import { GoTasklist } from "react-icons/go";
import {
  IoCarSportOutline,
  IoMenuOutline,
  IoCloseOutline,
} from "react-icons/io5";
import { MdEditDocument, MdOutlinePayments } from "react-icons/md";
import { RiRoadMapLine } from "react-icons/ri";
import { SlHome } from "react-icons/sl";
import { TfiAlignLeft } from "react-icons/tfi";
import { VscSignOut } from "react-icons/vsc";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import useAuth from "../../../Components/useAuth";
import { FaUsers } from "react-icons/fa6";
import { GrTransaction } from "react-icons/gr";
import MobileWarning from "../../../Components/MobileWarning";
import NotificationComp from "../../../Components/NotificationComp";
import { useNotifications } from "../../../Components/Notifications";


const Dashboard = () => {
  const location = useLocation();
  const {admin, logout} = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { notifications, unreadCount, markAsRead, deleteNotification } =useNotifications();
  const [notifCount, setNotifCount] = useState(0);
  
  useEffect(() => {
    setNotifCount(unreadCount);
  }, [notifications]);

  const pageTitles = {
    "/": "Dashboard",
    "/orders": "Order Lists",
    "/drivers": "Drivers",
    "/customers": "Customers",
    "/tasks": "Task Management",
    "/earnings": "Earnings",
    "/map": "Map",
    "/chat": "Chat",
    "/wallet": "Wallet",
    "/TermsPrivacyPolicy": "Terms & Privacy Policy",
    "/support": "Support",
  };
  const matchedPath = Object.keys(pageTitles)
    .sort((a, b) => b.length - a.length)
    .find((path) => location.pathname.startsWith(path));

  const currentTitle = pageTitles[matchedPath] || "Dashboard";

  const menuItems = [
    { path: "/", label: "Dashboard", icon: <SlHome /> },
    { path: "drivers", label: "Drivers", icon: <IoCarSportOutline /> },
    { path: "tasks", label: "Task Management", icon: <GoTasklist  /> },
    { path: "orders", label: "Orders", icon: <TfiAlignLeft /> },
    { path: "users", label: "Users", icon: <FaUsers /> },
    { path: "pricing", label: "Control Pricing", icon: <RiRoadMapLine /> },
    { path: "transaction", label: "Transaction", icon: <GrTransaction /> },
    { path: "paydriver", label: "Pay Driver", icon: <MdOutlinePayments /> },
    { path: "customers", label: "Customers", icon: <FiUsers /> },
    { path: "earnings", label: "Earnings", icon: <BsCashCoin /> },
    { path: "TermsPrivacyPolicy", label: "Terms & Privacy Policy", icon: <MdEditDocument /> },
    { path: "chat", label: "Chat", icon: <BsChatLeftDots /> },
    { path: "wallet", label: "Wallet", icon: <BiWalletAlt /> },
    { path: "support", label: "Support", icon: <BiSupport /> },
  ];

  return (
    <div className="flex w-full overflow-hidden text-black dark:text-black ">
  <MobileWarning/>
      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="absolute top-4 left-4 z-30 p-1 rounded-md bg-[#FDFDFD] text-gray-700 lg:hidden"
        aria-label="Open menu"
      >
        <IoMenuOutline size={24} />
      </button>
      {/* Sidebar */}
      {/* Desktop sidebar */}
      <div className="hidden lg:flex h-screen w-72 fixed bg-white shadow-[0_0_36.2px_rgba(0,0,0,0.05)] p-4 z-20 flex-col">
        <img
          src="https://i.ibb.co/TxC947Cw/thumbnail-Image-2025-07-09-at-2-10-AM-removebg-preview.png"
          alt="Logo"
          className="w-[150px] mx-auto mb-6"
        />
        <div className="flex flex-col gap-1 flex-1 overflow-y-auto">
          {menuItems.map(({ path, label, icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-md transition font-medium ${
                  isActive
                    ? "bg-[#006eff2a] text-[#006FFF]"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
              onClick={() => setSidebarOpen(false)} // close on click
            >
              <span className="text-[16px]">{icon}</span>
              {label}
            </NavLink>
          ))}
        </div>
        <div className="divider mt-6 mb-2" />
        <div
          className="flex items-center gap-2 text-gray-700 px-3 py-2 hover:bg-gray-100 rounded-md cursor-pointer"
          onClick={() => logout()}
        >
          <VscSignOut className="text-[16px]" />
          Sign Out
        </div>
        {/* <div onClick={() => setSidebarOpen(false)}>
          <BsArrowLeftSquareFill className="text-xl" />
        </div> */}
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          {/* Background overlay */}
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={() => setSidebarOpen(false)}
          ></div>

          {/* Sidebar */}
          <div className="relative bg-white w-64 p-4 flex flex-col overflow-y-auto shadow-lg">
            {/* Close button */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="mb-6 self-end text-gray-700 hover:text-gray-900"
              aria-label="Close menu"
            >
              <IoCloseOutline size={28} />
            </button>

            <img
              src="https://i.ibb.co/TxC947Cw/thumbnail-Image-2025-07-09-at-2-10-AM-removebg-preview.png"
              alt="Logo"
              className="w-[150px] mx-auto mb-6"
            />
            <div className="flex flex-col gap-1 flex-1">
              {menuItems.map(({ path, label, icon }) => (
                <NavLink
                  key={path}
                  to={path}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-2 rounded-md transition font-medium ${
                      isActive
                        ? "bg-[#006eff2a] text-[#006FFF]"
                        : "text-gray-700 hover:bg-gray-100"
                    }`
                  }
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="text-[16px]">{icon}</span>
                  {label}
                </NavLink>
              ))}
            </div>
            <div className="divider mt-6 mb-2" />
             <div
          className="flex items-center gap-2 text-gray-700 px-3 py-2 hover:bg-gray-100 rounded-md cursor-pointer"
          onClick={() => logout()}
        >
          <VscSignOut className="text-[16px]" />
          Sign Out
        </div>
          </div>
        </div>
      )}
{showNotifications && (
  <div className="absolute right-4 top-14 lg:w-[25%] md:w-[45%] w-[90%] bg-white shadow-xl rounded-xl z-50 border border-gray-200">
    <div className="px-4 py-3 border-b">
      <h3 className="text-base font-semibold text-gray-800">Notifications</h3>
    </div>

    <ul className="max-h-64 overflow-y-auto">
      <NotificationComp onCountChange={setNotifCount}/>
    </ul>

    <button
      onClick={() => {
        setShowNotifications(false);
        window.location.href = "/notifications";
      }}
      className="block w-full text-center text-sm text-blue-600 py-3 hover:bg-gray-100 transition"
    >
      See all notifications
    </button>
  </div>
)}

{showSettings && (
  <div className="absolute right-8 top-14 w-52 bg-white shadow-xl rounded-xl z-50 overflow-hidden">
    <ul className="text-sm text-gray-700">
      <li
        className="flex items-center gap-2 p-3 hover:bg-gray-100 cursor-pointer"
        onClick={() => window.location.href = "/profile"}
      >
        <FiUsers /> Profile
      </li>
      <li
        className="flex items-center gap-2 p-3 hover:bg-gray-100 cursor-pointer"
        onClick={() => window.location.href = "/settings"}
      >
        <FiSettings /> Settings
      </li>
      <li
        className="flex items-center gap-2 p-3 hover:bg-gray-100 cursor-pointer"
        onClick={() => window.location.href = "/earnings"}
      >
        <BiWalletAlt /> Earnings
      </li>
      <li
        className="flex items-center gap-2 p-3 hover:bg-gray-100 text-red-600 cursor-pointer"
        onClick={() => logout()}
      >
        <IoCloseOutline /> Sign Out
      </li>
    </ul>
  </div>
)}


      {/* Content Area */}
      <div className="flex-1 lg:ml-72 min-h-screen bg-[#FDFDFD] overflow-hidden">
        {/* Topbar */}
        <div className="absolute fixed md:bg-[#FDFDFD] top-6 md:top-0 left-0 right-0 h-14 
        flex flex-col-reverse md:flex-row md:items-center items-end justify-between lg:px-6 md:pr-3 md:pl-14 lg:pl-6 z-10 lg:left-72">
          <h1 className="text-xl font-semibold text-gray-800 md:mt-0 mt-2">{currentTitle}</h1>
          <div className="flex items-center md:gap-4 text-gray-600">
           <div className="flex gap-4">
           <div className="bg-[#006eff2a] w-[36px] h-[36px] flex items-center justify-center rounded-lg relative"
           onClick={() => {
            setShowNotifications(!showNotifications);
            setShowMessages(false);
            setShowSettings(false);
          }} >
              <FiBell className="text-xl cursor-pointer text-[#006FFF]" />
              <div className="bg-[#006FFF] text-white poppins-light text-[10px] px-1 rounded-full absolute top-[-7px] right-[-7px] border-[#fff] border-2">
                {notifCount}
              </div>
            </div>
            <div className="bg-[#006eff2a] w-[36px] h-[36px] flex items-center justify-center rounded-lg relative"
            onClick={() => {
              setShowMessages(!showMessages);
              setShowNotifications(false);
              setShowSettings(false);
            }}>
              <FiMessageSquare className="text-xl cursor-pointer text-[#006FFF]" />
              <div className="bg-[#006FFF] text-white poppins-light text-[10px] px-1 rounded-full absolute top-[-7px] right-[-7px] border-[#fff] border-2">
                0
              </div>
            </div>
            <div className="bg-[#ff04002a] w-[36px] h-[36px] flex items-center justify-center rounded-lg relative"
            onClick={() => {
              setShowSettings(!showSettings);
              setShowNotifications(false);
              setShowMessages(false);
            }}>
              <FiSettings className="text-xl cursor-pointer text-[#FF0500]" />
              <div className="bg-[#FF0500] text-white poppins-light text-[10px] px-1 rounded-full absolute top-[-7px] right-[-7px] border-[#fff] border-2">
                0
              </div>
            </div>
           </div>
            <div className="divider lg:divider-horizontal mx-0 my-0 block md:hidden"></div>
            <div className="md:flex items-center gap-2 hidden">
              <span className="text-sm font-medium">{admin?.firstName} {admin?.lastName}</span>
              <div className="avatar avatar-online w-10 h-10">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHCU3cirazvFQg3yJnqZbs5R93HQCVpwv3cA&s"
                  alt="avatar"
                  className="w-8 h-8 rounded-full "
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 md:hidden mt-10 pl-5">
              <span className="text-sm font-medium">{admin?.firstName} {admin?.lastName}</span>
              <div className="avatar avatar-online w-10 h-10">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHCU3cirazvFQg3yJnqZbs5R93HQCVpwv3cA&s"
                  alt="avatar"
                  className="w-8 h-8 rounded-full "
                />
              </div>
            </div>
      
        {/* Dynamic Page Content */}
        <main className="pt-3 md:pt-14 mt-0 md:mt-2 lg:mt-0 md:px-6 px-3 pb-6 min-h-screen bg-[#FDFDFD]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;