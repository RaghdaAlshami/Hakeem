import React from "react";
import { assets } from "../assets/assets";

const Header = () => {
  return (
    <div
      dir="rtl"
      // shadow-2xl shadow-black/50: إضافة الظل السفلي المطلوب للحافة
      className="relative overflow-hidden min-h-[75vh] md:min-h-187 flex items-center bg-[#02161e] shadow-2xl shadow-black/50"
      style={{
        backgroundImage: `url(${assets.hero_img})`,
        backgroundSize: "cover",
        backgroundPosition: "55% center",
        backgroundRepeat: "no-repeat",
      }}>
      {/* التعديل المعتمد للتعتيم */}
      <div
        className="absolute inset-0 
        bg-gradient-to-t from-[#02161e] via-[#02161e]/80 to-[#02161e]/40 
        md:bg-gradient-to-l md:from-[#000000] md:via-[#02161e]/40 md:to-transparent"></div>

      {/* محتوى الهيدر */}
      <div className="relative z-10 w-full px-6 mr-0 md:mr-20 max-w-2xl animate-fadeIn">
        {/* الخط الزخرفي العلوي مع توهج */}
        <div className="w-16 md:w-20 h-1.5 bg-teal-500 mb-6 md:mb-10 rounded-full shadow-[0_0_20px_rgba(20,184,166,0.8)]"></div>

        <h1 className="text-3xl sm:text-4xl md:text-6xl text-white font-black leading-tight mb-6 drop-shadow-2xl">
          احجز موعدك الآن <br />
          <span className="text-teal-400">مع نخبة الأطباء</span>
        </h1>

        <p className="text-white/90 text-base md:text-xl leading-relaxed mb-10 font-medium max-w-xl">
          وصول مباشر لأفضل الكفاءات الطبية، بجدول دقيق <br></br> وتجربة حجز عصرية وسريعة.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 md:gap-6 mt-2">
          <a
            href="#speciality"
            className="group relative flex justify-center items-center gap-4 
               bg-white/10 backdrop-blur-md border border-white/20 
               text-white px-8 md:px-12 py-4 md:py-5 rounded-full 
               text-lg md:text-xl font-semibold transition-all duration-500 
               hover:bg-teal-600 hover:border-teal-500 hover:scale-105
               active:scale-95 shadow-xl overflow-hidden">
            {/* تأثير اللمعان المتحرك */}
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>

            <span className="relative z-10">احجز موعدك الآن</span>

            <img
              className="relative z-10 w-4 md:w-5 rotate-180 transition-all duration-300 group-hover:translate-x-2"
              src={assets.arrow_icon}
              alt="arrow"
            />
          </a>
        </div>

        {/* بطاقة الأطباء المتوفرين */}
        <div className="mt-12 md:mt-16 flex items-center gap-4 bg-black/40 backdrop-blur-md w-full sm:w-fit p-3 pr-5 rounded-2xl md:rounded-full border border-white/10 shadow-2xl">
          <div className="flex -space-x-3 md:-space-x-4 space-x-reverse">
            {[assets.doc1, assets.doc2, assets.doc3].map((img, i) => (
              <img
                key={i}
                src={img}
                className="w-10 h-10 md:w-14 md:h-14 rounded-full border-2 border-teal-500 object-cover"
                alt="doctor"
              />
            ))}
          </div>
          <div className="flex flex-col">
            <p className="text-white text-xs md:text-sm font-bold">
              100+ طبيب متخصص
            </p>
            <p className="text-teal-400 text-[10px] md:text-xs">
              متاحون الآن لحجزك
            </p>
          </div>
        </div>
      </div>

      {/* خط ظلي سفلي إضافي لزيادة العمق (اختياري) */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
    </div>
  );
};

export default Header;
