import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { specialityTranslation } from "../assets/assets";

const TopDoctors = () => {
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);
  const [topRatedDocs, setTopRatedDocs] = useState([]);

  useEffect(() => {
    if (doctors.length > 0) {
      const sortedDocs = [...doctors].sort((a, b) => b.rating - a.rating);
      setTopRatedDocs(sortedDocs.slice(0, 10));
    }
  }, [doctors]);

  return (
    <div
      dir="rtl"
      className="flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-20 font-cairo">
      <h1 className="text-2xl md:text-3xl font-bold text-center text-slate-800">
        نخبة الأطباء الأعلى تقييماً
      </h1>
      <p className="sm:w-1/2 text-center text-gray-500 text-sm mb-6">
        احجز موعدك مع أمهر الأطباء الحاصلين على أفضل التقييمات.
      </p>

      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pt-5 px-5 sm:px-0 justify-items-center">
        {topRatedDocs.map((item, index) => (
          <div
            key={index}
            onClick={() => {
              navigate(`/appointment/${item._id}`);
              window.scrollTo(0, 0);
            }}
            className="max-w-[220px] w-full border border-blue-50 rounded-2xl overflow-hidden cursor-pointer hover:-translate-y-2 transition-all duration-500 bg-white shadow-sm hover:shadow-md group flex flex-col">
            <div className="bg-blue-50 overflow-hidden relative h-52">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover object-top group-hover:scale-110 transition-all duration-500"
              />
            </div>

            <div className="p-4 flex flex-col flex-grow items-center text-center">
              <div
                className={`flex items-center gap-1.5 text-[10px] mb-2 ${item.available ? "text-green-500" : "text-gray-400"}`}>
                <span
                  className={`w-1.5 h-1.5 rounded-full ${item.available ? "bg-green-500 animate-pulse" : "bg-gray-400"}`}></span>
                <p>{item.available ? "متاح" : "غير متاح"}</p>
              </div>

              <h3 className="text-base font-bold text-slate-800 mb-1 truncate w-full">
                {item.name}
              </h3>

              {/* الاختصاص البارز */}
              <p className="text-teal-700 text-[13px] font-bold mb-1 bg-teal-50 px-3 py-0.5 rounded-lg w-fit">
                {specialityTranslation[item.speciality]}
              </p>

              {/* العنوان: المدينة + الشارع */}
              <div className="flex items-center justify-center gap-1 text-gray-500 text-[11px] mb-3 w-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 text-teal-600 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <p className="truncate font-medium">
                  {item.address?.city}
                  - {item.address?.line1}
                </p>
              </div>

              <div className="mt-auto pt-3 border-t border-slate-50 w-full">
                <div className="flex flex-col items-center gap-0.5">
                  <div className="flex text-yellow-400 text-lg">
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
                  <span className="text-[10px] text-gray-400 font-medium">
                    ({item.numReviews || 0} تقييم)
                  </span>
                </div>
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
        className="bg-teal-600 text-white px-10 py-3 rounded-full mt-10 hover:bg-teal-700 transition-all duration-300 text-sm font-bold shadow-md">
        عرض جميع الأطباء
      </button>
    </div>
  );
};

export default TopDoctors;
