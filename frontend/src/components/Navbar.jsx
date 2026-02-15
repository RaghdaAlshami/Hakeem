import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { token, setToken, userData } = useContext(AppContext);
  const [showMenu, setShowMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?search=${searchQuery}`);
      window.scrollTo(0, 0);
      setSearchQuery("");
      setShowMenu(false);
    }
  };

  return (
    <nav
      dir="rtl"
      className="sticky top-0 z-50 bg-slate-50 border-b border-gray-100 shadow-md shadow-gray-200/60 py-2 px-5">
      <div className="max-w-7xl mx-auto flex items-center justify-between w-full">
        {/* 1. اليمين: الشعار */}
        <div className="flex-none">
          <img
            onClick={() => navigate("/")}
            className="w-28 md:w-52 lg:w-56 cursor-pointer mix-blend-multiply object-contain transition-all"
            src={assets.logo}
            alt="Logo"
          />
        </div>

        {/* 2. الوسط: الروابط والبحث (Desktop Only) */}
        <div className="hidden xl:flex flex-1 items-center justify-center gap-10">
          <ul className="flex items-center gap-8 text-gray-500 font-medium whitespace-nowrap">
            {["/", "/doctors", "/about", "/contact"].map((path, index) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  isActive
                    ? "text-teal-600 font-bold border-b-2 border-teal-600 pb-1"
                    : "hover:text-teal-500 transition-colors"
                }>
                {["الرئيسية", "الأطباء", "من نحن", "اتصل بنا"][index]}
              </NavLink>
            ))}
          </ul>

          <form onSubmit={handleSearch} className="relative w-48 lg:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث..."
              className="w-full bg-white border border-gray-200 rounded-full py-2 px-4 pr-10 text-xs focus:border-teal-300 outline-none transition-all shadow-sm"
            />
            <button
              type="submit"
              className="absolute left-3 top-1/2 -translate-y-1/2">
              <img
                src={assets.search_icon}
                className="w-3.5 opacity-40"
                alt="search"
              />
            </button>
          </form>
        </div>

        {/* 3. اليسار: الحساب والمنيو */}
        <div className="flex items-center gap-2 md:gap-5">
          {token && userData ? (
            <div className="group relative cursor-pointer">
              <img
                className="w-9 h-9 md:w-10 md:h-10 rounded-full border border-white shadow-sm object-cover"
                src={userData?.image || assets.profile_pic}
                alt="profile"
              />
              <div className="absolute top-full left-0 pt-2 hidden group-hover:block z-50">
                <div className="min-w-[160px] bg-white shadow-xl rounded-xl p-2 text-sm text-right border border-gray-100">
                  <p
                    onClick={() => navigate("/my-profile")}
                    className="p-2.5 hover:bg-slate-50 rounded-lg transition-colors">
                    ملفي الشخصي
                  </p>
                  <p
                    onClick={() => navigate("/my-appointments")}
                    className="p-2.5 hover:bg-slate-50 rounded-lg transition-colors">
                    مواعيدي
                  </p>
                  <hr className="my-1 border-gray-100" />
                  <p
                    onClick={() => {
                      setToken(false);
                      navigate("/login");
                    }}
                    className="p-2.5 hover:bg-red-50 text-red-500 rounded-lg font-bold">
                    خروج
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* --- تم تعديل الكلاسات هنا لإظهار الزر في كل الشاشات --- */
            <button
              onClick={() => navigate("/login")}
              className="bg-teal-700 text-white px-5 sm:px-10 py-2 sm:py-3 rounded-full text-[10px] sm:text-xs font-bold block hover:bg-teal-800 transition-all shadow-sm whitespace-nowrap">
              دخول
            </button>
          )}

          <button onClick={() => setShowMenu(true)} className="xl:hidden p-1">
            <img className="w-6 opacity-70" src={assets.menu_icon} alt="menu" />
          </button>
        </div>
      </div>

      {/* منيو الموبايل الجانبية */}
      <div
        className={`fixed inset-0 z-[60] bg-white transition-all duration-300 ${showMenu ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between p-6 border-b border-gray-50">
          <img
            className="w-36 mix-blend-multiply"
            src={assets.logo}
            alt="logo"
          />
          <img
            className="w-6 cursor-pointer"
            src={assets.cross_icon}
            onClick={() => setShowMenu(false)}
            alt="close"
          />
        </div>
        <div className="p-8 text-right">
          <ul className="flex flex-col gap-6 text-xl text-gray-700 font-medium">
            <NavLink onClick={() => setShowMenu(false)} to="/">
              الرئيسية
            </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/doctors">
              الأطباء
            </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/about">
              من نحن
            </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/contact">
              اتصل بنا
            </NavLink>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
