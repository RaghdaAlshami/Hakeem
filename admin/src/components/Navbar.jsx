import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { AdminContext } from "../context/AdminContext";
import { useNavigate } from "react-router-dom";
import { DoctorContext } from "../context/DoctorContext";

const Navbar = () => {
  const { aToken, setAToken } = useContext(AdminContext);
  const { dToken, setDToken } = useContext(DoctorContext);

  const navigate = useNavigate();

  const logout = () => {
    navigate("/");
    aToken && setAToken("");
    aToken && localStorage.removeItem("aToken");

    dToken && setDToken("");
    dToken && localStorage.removeItem("dToken");
  };

  return (
    <div
      className="flex justify-between items-center px-4 sm:px-10 py-3 border-b border-gray-200 bg-white sticky top-0 z-20"
      dir="rtl">
      {/* الجزء الأيمن: الشعار والوصف */}
      <div className="flex items-center gap-2 sm:gap-3">
        <img
          onClick={() => navigate("/")}
          className="w-28 sm:w-40 cursor-pointer"
          src={assets.logo}
          alt="شعار حكيم"
        />
        <p className="border px-2 py-0.5 rounded-full border-gray-500 text-gray-600 text-[10px] sm:text-xs">
          {aToken ? "مدير النظام" : "طبيب"}
        </p>
      </div>

      {/* الجزء الأيسر: زر تسجيل الخروج */}
      <button
        onClick={logout}
        className="bg-hakeem-dark text-white text-xs sm:text-sm px-5 sm:px-10 py-2 rounded-full hover: hover:bg-white hover:text-red-600 transition-all transform active:scale-95">
        تسجيل الخروج
      </button>
    </div>
  );
};

export default Navbar;
