import React from 'react'
import { assets } from '../assets/assets'
import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <div dir="rtl" className="md:mx-10">
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
        {/* القسم الأيمن: الشعار والوصف */}
        <div className="flex flex-col items-start">
          <img className=" w-52" src={assets.logo} alt="شعار حكيم" />
          <p className="w-full md:w-2/3 text-gray-600 leading-7 text-right">
            منصة حكيم هي وجهتك الأولى للوصول إلى نخبة الأطباء الموثوقين. نحن
            نسعى لتسهيل عملية الرعاية الصحية من خلال توفير حلول حجز مواعيد ذكية
            وفعالة تضمن لك الراحة والسرعة.
          </p>
        </div>

        {/* القسم الأوسط: روابط سريعة */}
        <div>
          <p className="text-xl font-medium mb-5 text-hakeem-dark">الشركة</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <NavLink
              to={"/"}
              onClick={() => window.scrollTo(0, 0)}
              className="relative group">
              <li className="py-1 hover:text-teal-800 transition-all">
                الرئيسية
              </li>
            </NavLink>
            <NavLink
              to={"/about"}
              onClick={() => window.scrollTo(0, 0)}
              className="relative group">
              <li className="py-1 hover:text-teal-800 transition-all">
                من نحن؟
              </li>
            </NavLink>
            <NavLink
              to={"/contact"}
              onClick={() => window.scrollTo(0, 0)}
              className="relative group">
              <li className="py-1 hover:text-teal-800 transition-all">
                اتصل بنا
              </li>
            </NavLink>
            <li className="hover:text-primary cursor-pointer transition-all">
              سياسة الخصوصية
            </li>
          </ul>
        </div>

        {/* القسم الأيسر: اتصل بنا */}
        <div>
          <p className="text-xl font-medium mb-5 text-hakeem-dark">
            تواصل معنا
          </p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li
              dir="ltr"
              className="text-right hover:text-primary cursor-pointer transition-all">
              +963 930 111 222
            </li>
            <li className="hover:text-primary cursor-pointer transition-all">
              info@hakeem-syria.com
            </li>
          </ul>
        </div>
      </div>

      {/* القسم السفلي: حقوق النشر */}
      <div>
        <hr className="border-gray-300" />
        <p className="py-5 text-sm text-center text-gray-500 font-medium">
          حقوق الطبع والنشر © 2026 حكيم - جميع الحقوق محفوظة.
        </p>
      </div>
    </div>
  );
}

export default Footer