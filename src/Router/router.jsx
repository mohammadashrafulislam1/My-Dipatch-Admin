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
import PrivateRoute from "./PrivateRouter";

export const router = createBrowserRouter([
    {
        path:'/',
        element:<Dashboard/>,
        errorElement:<h1>err</h1>,
        children:[
            {
                path:'',
                element:<PrivateRoute><Default/></PrivateRoute>
            },
            {
                path:'orders',
                element:<PrivateRoute><Order/></PrivateRoute>
            },
            {
                path:'customers',
                element:<PrivateRoute><Customers/></PrivateRoute>
            },
            {
                path:'analytics',
                element:<PrivateRoute><Analytics/></PrivateRoute>
            },
            {
                path:'tasks',
                element:<PrivateRoute><Tasks/></PrivateRoute>
            },
            {
                path:'earnings',
                element:<PrivateRoute><Earnings/></PrivateRoute>
            },
            {
                path:'pricing',
                element:<PrivateRoute><Pricing/></PrivateRoute>
            },
            {
                path:'chat',
                element:<PrivateRoute><Chat/></PrivateRoute>
            },
            {
                path:'support',
                element:<PrivateRoute><Support/></PrivateRoute>
            },
            {
                path:'drivers',
                element:<PrivateRoute><Drivers/></PrivateRoute>
            },
            {
                path:'TermsPrivacyPolicy',
                element:<PrivateRoute><TermsPrivacyPolicy/></PrivateRoute>
            },
            {
                path:'wallet',
                element:<PrivateRoute><Wallet/></PrivateRoute>
            },
            {
                path:'profile',
                element:<PrivateRoute><Profile/></PrivateRoute>
            },
            {
                path:'settings',
                element:<PrivateRoute><Settings/></PrivateRoute>
            },
            {
                path:'notifications',
                element:<PrivateRoute><Notification/></PrivateRoute>
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
        element:<PrivateRoute><Signup/></PrivateRoute>,
        errorElement:<h1>err</h1>
    },
])