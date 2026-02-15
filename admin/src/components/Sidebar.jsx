import React, { useContext } from "react";
import { AdminContext } from "../context/AdminContext";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { DoctorContext } from "../context/DoctorContext";

const Sidebar = () => {
  const { aToken } = useContext(AdminContext);
  const { dToken } = useContext(DoctorContext);


  return (
    <div className="min-h-screen bg-white  " dir="rtl">
      {aToken && (
        <ul className="text-[#515151] mt-5">
          {/* رابط لوحة التحكم */}
          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? "bg-[#F2F3FF] border-l-4  border-cyan-600 text-hakeem-dark font-bold" : ""}`
            }
            to={"/admin-dashboard"}>
            <img className="w-5" src={assets.home_icon} alt="" />
            <p className="hidden md:block">لوحة التحكم</p>
          </NavLink>

          {/* رابط المواعيد */}
          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? "bg-[#F2F3FF] border-l-4 border-cyan-600 text-hakeem-dark font-bold" : ""}`
            }
            to={"/all-appointments"}>
            <img className="w-5" src={assets.appointment_icon} alt="" />
            <p className="hidden md:block">المواعيد</p>
          </NavLink>

          {/* رابط إضافة طبيب */}
          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? "bg-[#F2F3FF] border-l-4  border-cyan-600 text-hakeem-dark font-bold" : ""}`
            }
            to={"/add-doctor"}>
            <img className="w-5" src={assets.add_icon} alt="" />
            <p className="hidden md:block">إضافة طبيب</p>
          </NavLink>

          {/* رابط قائمة الأطباء */}
          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? "bg-[#F2F3FF] border-l-4  border-cyan-600 text-hakeem-dark font-bold" : ""}`
            }
            to={"/doctors-list"}>
            <img className="w-5" src={assets.people_icon} alt="" />
            <p className="hidden md:block">قائمة الأطباء</p>
          </NavLink>

          {/* رابط قائمة الأطباء */}
          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? "bg-[#F2F3FF] border-l-4  border-cyan-600 text-hakeem-dark font-bold" : ""}`
            }
            to={"/users-list"}>
            <img className="w-5" src={assets.people_icon} alt="" />
            <p className="hidden md:block">قائمة المستخدمين</p>
          </NavLink>
        </ul>
      )}

      {dToken && (
        <ul className="text-[#515151] mt-5">
          {/* رابط لوحة التحكم للطبيب */}
          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? "bg-[#F2F3FF] border-l-4 border-cyan-600 text-hakeem-dark font-bold" : ""}`
            }
            to={"/doctor-dashboard"}>
            <img className="w-5" src={assets.home_icon} alt="" />
            <p className="hidden md:block">لوحة التحكم</p>
          </NavLink>

          {/* رابط مواعيد الطبيب */}
          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? "bg-[#F2F3FF] border-l-4 border-cyan-600 text-hakeem-dark font-bold" : ""}`
            }
            to={"/doctor-appointments"}>
            <img className="w-5" src={assets.appointment_icon} alt="" />
            <p className="hidden md:block">المواعيد</p>
          </NavLink>

          {/* رابط الملف الشخصي للطبيب - تم تعديل المسمى هنا */}
          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? "bg-[#F2F3FF] border-l-4 border-cyan-600 text-hakeem-dark font-bold" : ""}`
            }
            to={"/doctor-profile"}>
            <img className="w-5" src={assets.people_icon} alt="" />{" "}
            {/* جربي استخدام people_icon للملف الشخصي */}
            <p className="hidden md:block">الملف الشخصي</p>
          </NavLink>
        </ul>
      )}
    </div>
  );
};

export default Sidebar;
