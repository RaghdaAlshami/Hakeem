import React, { useContext, useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { specialityTranslation, assets } from "../assets/assets";

const Search = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search");
  const { doctors } = useContext(AppContext);
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (searchQuery && doctors && doctors.length > 0) {
      const query = searchQuery.toLowerCase().trim();
      const filtered = doctors.filter((doc) => {
        const name = doc.name ? doc.name.toLowerCase() : "";
        const engSpeciality = doc.speciality
          ? doc.speciality.toLowerCase()
          : "";
        const arbSpeciality = specialityTranslation[doc.speciality]
          ? specialityTranslation[doc.speciality].toLowerCase()
          : "";
        const city =
          doc.address && doc.address.city ? doc.address.city.toLowerCase() : "";

        return (
          name.includes(query) ||
          engSpeciality.includes(query) ||
          arbSpeciality.includes(query) ||
          city.includes(query)
        );
      });
      setResults(filtered);
    } else if (!searchQuery) {
      setResults([]);
    }
  }, [searchQuery, doctors]);

  return (
    <div
      dir="rtl"
      className="py-10 px-6 md:px-12 lg:px-24 font-cairo min-h-[70vh]">
      {/* العنوان والإحصائيات */}
      <div className="mb-10 border-b  border-gray-200 pb-5">
        <h1 className="text-xl font-bold text-gray-800">
          نتائج البحث عن: <span className="text-teal-600">"{searchQuery}"</span>
        </h1>
        {results.length > 0 && (
          <p className="text-gray-500 mt-2 bg-teal-50 inline-block px-4 py-1 rounded-full text-sm border border-teal-100">
            ✅ تم العثور على{" "}
            <span className="font-bold text-teal-700">{results.length}</span>{" "}
            نتائج
          </p>
        )}
      </div>

      {results.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 gap-y-6">
          {results.map((item, index) => (
            <div
              key={index}
              onClick={() => {
                navigate(`/appointment/${item._id}`);
                window.scrollTo(0, 0);
              }}
              className="border border-slate-100 rounded-xl overflow-hidden cursor-pointer hover:-translate-y-1 transition-all duration-300 bg-white shadow-sm hover:shadow-md group text-center">
              {/* صورة بارزة الارتفاع */}
              <div className="bg-slate-50 overflow-hidden relative h-48 md:h-60">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              {/* تفاصيل الطبيب */}
              <div className="p-3 flex flex-col items-center">
                <div
                  className={`flex items-center gap-1 text-[10px] mb-1 ${item.available ? "text-green-500" : "text-gray-400"}`}>
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${item.available ? "bg-green-500 animate-pulse" : "bg-gray-300"}`}></span>
                  {item.available ? "متاح" : "غير متاح"}
                </div>

                <h3 className="text-sm font-bold text-gray-800 mb-0.5 truncate w-full">
                  {item.name}
                </h3>

                <p className="text-teal-600 text-[11px] font-medium mb-1 truncate w-full">
                  {specialityTranslation[item.speciality] || item.speciality}
                </p>

                {/* العنوان */}
                <div className="flex items-center justify-center gap-1 text-gray-500 text-[10px] mb-2 w-full">
                  <span className="text-teal-500">📍</span>
                  <p className="truncate font-light">
                    {item.address?.city}{" "}
                    {item.address?.line1 && `، ${item.address.line1}`}
                  </p>
                </div>

                {/* التقييم */}
                <div className="flex flex-col items-center justify-center pt-2 border-t border-slate-50 w-full">
                  <div className="flex text-yellow-400 text-xs mb-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={
                          star <= Math.round(item.rating || 0)
                            ? "text-yellow-400"
                            : "text-gray-200"
                        }>
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-[9px] text-gray-400">
                    ({item.numReviews || 0} تقييم)
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* واجهة عدم وجود نتائج */
        <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <img
            src={assets.no_results_icon || assets.search_icon}
            alt="لا توجد نتائج"
            className="w-24 mb-6 opacity-30 grayscale"
          />
          <p className="text-lg text-gray-500 font-medium">
            لم نجد أطباء يطابقون بحثك
          </p>
          <button
            onClick={() => navigate("/doctors")}
            className="mt-4 bg-teal-600 text-white px-6 py-2 rounded-full text-sm hover:bg-teal-700 transition-all shadow-md active:scale-95">
            عرض كافة الأطباء
          </button>
        </div>
      )}
    </div>
  );
};

export default Search;
