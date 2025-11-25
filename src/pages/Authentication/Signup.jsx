import { useState, useContext } from "react";
import { IoEyeOffSharp, IoEyeSharp } from "react-icons/io5";
import axios from "axios";
import useAuth from "../../Components/useAuth";

const Signup = () => {
  const { signup, login } = useAuth(); // ⬅️ FIXED

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const [firstName, ...rest] = formData.name.split(" ");
    const lastName = rest.join(" ");

    try {
      // 🔥 CREATE ADMIN USING ADMIN AUTHPROVIDER (Not axios)
      await signup({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });

      // 🔥 AUTO LOGIN
      await login({
        email: formData.email,
        password: formData.password,
      });

      window.location.href = "/";
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F9FF] px-4">
      <div className="w-full max-w-md bg-white md:p-8 p-4 rounded-2xl shadow-2xl">

        <img
          src="https://i.ibb.co/TxC947Cw/thumbnail-Image-2025-07-09-at-2-10-AM-removebg-preview.png"
          alt="Logo"
          className="w-[150px] mx-auto mb-6"
        />

        <h2 className="text-2xl font-bold text-center text-[#006FFF] mb-6">
          Sign Up As Admin
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />

          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />

          {/* PASSWORD */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              className="w-full px-4 py-2 border rounded-lg"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <div
              className="absolute top-2.5 right-4 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <IoEyeOffSharp /> : <IoEyeSharp />}
            </div>
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              className="w-full px-4 py-2 border rounded-lg"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <div
              className="absolute top-2.5 right-4 cursor-pointer"
              onClick={() => setShowConfirm(!showConfirm)}
            >
              {showConfirm ? <IoEyeOffSharp /> : <IoEyeSharp />}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#008000] text-white py-2 rounded-full font-semibold"
          >
            Sign Up
          </button>
        </form>

      </div>
    </div>
  );
};

export default Signup;
