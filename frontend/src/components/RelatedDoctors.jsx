import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { specialityTranslation } from "../assets/assets";

const RelatedDoctors = ({ speciality, docId }) => {
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);
  const [relDocs, setRelDocs] = useState([]);

  useEffect(() => {
    if (doctors.length > 0 && speciality) {
      const doctorsData = doctors.filter(
        (doc) => doc.speciality === speciality && doc._id !== docId,
      );
      setRelDocs(doctorsData);
    }
  }, [doctors, speciality, docId]);

  return (
    <div
      dir="rtl"
      className="flex flex-col items-center gap-4 my-16 text-gray-900 px-6 md:px-12 font-cairo">
      <h1 className="text-xl md:text-3xl font-bold text-center text-slate-800">
        أطباء ذوو صلة
      </h1>
      <p className="sm:w-1/2 text-center text-gray-500 text-sm mb-6">
        تصفح قائمة الأطباء الآخرين في تخصص{" "}
        <span className="text-teal-600 font-semibold">
          {specialityTranslation[speciality]}
        </span>
      </p>

      {/* تحسين الشبكة لتكون البطاقات أصغر (5 أعمدة في الشاشات الكبيرة) */}
      <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pt-2 justify-items-center">
        {relDocs.slice(0, 5).map((item, index) => (
          <div
            key={index}
            onClick={() => {
              navigate(`/appointment/${item._id}`);
              window.scrollTo(0, 0);
            }}
            // تقليل الحد الأقصى للعرض لتصغير البطاقة
            className="max-w-[190px] md:max-w-[210px] w-full border border-slate-100 rounded-2xl overflow-hidden cursor-pointer hover:-translate-y-2 transition-all duration-500 bg-white shadow-sm hover:shadow-md group flex flex-col text-center">
            {/* زيادة ارتفاع الصورة لإعطاء مظهر طولي (h-60 للموبايل و h-64 للشاشات الأكبر) */}
            <div className="bg-slate-50 overflow-hidden relative h-56 md:h-64">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover object-top group-hover:scale-110 transition-all duration-700"
              />
            </div>

            <div className="p-3 flex flex-col flex-grow items-center">
              <div
                className={`flex items-center gap-1.5 text-[10px] mb-1.5 ${
                  item.available ? "text-green-500" : "text-gray-400"
                }`}>
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    item.available
                      ? "bg-green-500 animate-pulse"
                      : "bg-gray-400"
                  }`}></span>
                <p>{item.available ? "متاح" : "غير متاح"}</p>
              </div>

              <h3 className="text-sm font-bold text-gray-800 mb-1 truncate w-full px-1">
                {item.name}
              </h3>

              <p className="text-teal-600 text-[11px] font-medium mb-1.5">
                {specialityTranslation[item.speciality]}
              </p>

              {/* إظهار العنوان بشكل أنيق في المنتصف */}
              <div className="flex items-center justify-center gap-1 text-gray-500 text-[10px] mb-3 w-full px-1">
                <span className="text-teal-500 text-xs">📍</span>
                <p className="truncate font-light">
                  {item.address?.city}{" "}
                  {item.address?.line1 && `- ${item.address.line1}`}
                </p>
              </div>

              {/* النجوم السفلية */}
              <div className="mt-auto pt-2 border-t border-slate-50 w-full flex flex-col items-center">
                <div className="flex text-yellow-400 text-sm">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={
                        star <= Math.round(item.rating)
                          ? "text-yellow-400"
                          : "text-gray-200"
                      }>
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-[9px] text-gray-400 font-medium">
                  ({item.numReviews || 0} تقييم)
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => {
          navigate("/doctors");
          window.scrollTo(0, 0);
        }}
        className="bg-teal-50 text-teal-700 px-12 py-3 rounded-full mt-8 hover:bg-teal-600 hover:text-white transition-all duration-300 border border-teal-100 font-bold text-sm shadow-sm">
        اكتشف المزيد من الأطباء
      </button>
    </div>
  );
};

export default RelatedDoctors;
