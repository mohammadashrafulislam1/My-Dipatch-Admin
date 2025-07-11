import { createBrowserRouter } from "react-router-dom";
import Dashboard from "../pages/Admin/Dashboard/Dashboard";
import Order from "../pages/Admin/Dashboard/Orders";
import Customers from "../pages/Admin/Dashboard/Customers";
import Analytics from "../pages/Admin/Dashboard/Analytics";
import Earnings from "../pages/Admin/Dashboard/Earnings";
import Chat from "../pages/Admin/Dashboard/Chat";
import Wallet from "../pages/Admin/Dashboard/Wallet";
import Default from "../pages/Admin/Dashboard/Default";
import Login from "../pages/Authentication/Login";
import Signup from "../pages/Authentication/Signup";
import Profile from "../pages/Admin/Profile/Profile";
import Settings from "../pages/Admin/Profile/Setting";
import Notification from "../pages/Admin/Profile/Notification";
import Tasks from "../pages/Admin/Dashboard/Tasks";
import Pricing from "../pages/Admin/Dashboard/Pricing";
import Support from "../pages/Admin/Dashboard/Support";
import Drivers from "../pages/Admin/Dashboard/Drivers";
import TermsPrivacyPolicy from "../pages/Admin/Dashboard/Terms & Privacy Policy";

export const router = createBrowserRouter([
    {
        path:'/',
        element:<Dashboard/>,
        errorElement:<h1>err</h1>,
        children:[
            {
                path:'',
                element:<Default/>
            },
            {
                path:'orders',
                element:<Order/>
            },
            {
                path:'customers',
                element:<Customers/>
            },
            {
                path:'analytics',
                element:<Analytics/>
            },
            {
                path:'tasks',
                element:<Tasks/>
            },
            {
                path:'earnings',
                element:<Earnings/>
            },
            {
                path:'pricing',
                element:<Pricing/>
            },
            {
                path:'chat',
                element:<Chat/>
            },
            {
                path:'support',
                element:<Support/>
            },
            {
                path:'drivers',
                element:<Drivers/>
            },
            {
                path:'TermsPrivacyPolicy',
                element:<TermsPrivacyPolicy/>
            },
            {
                path:'wallet',
                element:<Wallet/>
            },
            {
                path:'profile',
                element:<Profile/>
            },
            {
                path:'settings',
                element:<Settings/>
            },
            {
                path:'notifications',
                element:<Notification/>
            },
        ]
    },
    {
        path:'/login',
        element:<Login/>,
        errorElement:<h1>err</h1>
    },
    {
        path:'/signup',
        element:<Signup/>,
        errorElement:<h1>err</h1>
    },
])