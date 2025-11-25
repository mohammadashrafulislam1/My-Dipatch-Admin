import { useContext } from "react";
import { AdminAuthContext } from "../Router/AuthProvider";


const useAuth = () => useContext(AdminAuthContext);
export default useAuth;
