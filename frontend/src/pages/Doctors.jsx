import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { specialityTranslation } from "../assets/assets";

const Doctors = () => {
  const { speciality } = useParams();
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedCity, setSelectedCity] = useState("");
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);

  const syrianCities = [
    "دمشق",
    "ريف دمشق",
    "حلب",
    "حمص",
    "حماة",
    "اللاذقية",
    "طرطوس",
    "إدلب",
    "دير الزور",
    "الرقة",
    "الحسكة",
    "درعا",
    "السويداء",
    "القنيطرة",
  ];

  // --- 1. إنشاء قائمة التخصصات وترتيبها أبجدياً من القاموس مباشرة ---
  const dynamicSpecialities = Object.entries(specialityTranslation)
    .map(([slug, name]) => ({ name, slug }))
    .sort((a, b) => a.name.localeCompare(b.name, "ar"));

  const applyFilter = () => {
    let filtered = doctors;

    if (speciality) {
      filtered = filtered.filter(
        (doc) => doc.speciality?.toLowerCase() === speciality.toLowerCase(),
      );
    }

    if (selectedCity) {
      filtered = filtered.filter((doc) => doc.address?.city === selectedCity);
    }

    setFilteredDoctors(filtered);
  };

  useEffect(() => {
    if (doctors && doctors.length > 0) {
      applyFilter();
    } else {
      setFilteredDoctors([]);
    }
  }, [doctors, speciality, selectedCity]);

  return (
    <div dir="rtl" className="p-5 md:mx-10 font-cairo text-right">
      {/* --- فلتر المدن العلوي --- */}
      <div className="mb-8 overflow-x-auto">
        <div className="flex gap-3 pb-2 no-scrollbar">
          <button
            onClick={() => setSelectedCity("")}
            className={`px-5 py-2 rounded-full whitespace-nowrap text-sm border transition-all ${
              !selectedCity
                ? "bg-teal-600 text-white border-teal-600 shadow-md"
                : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
            }`}>
            كل المدن
          </button>
          {syrianCities.map((city, index) => (
            <button
              key={index}
              onClick={() => setSelectedCity(city)}
              className={`px-5 py-2 rounded-full whitespace-nowrap text-sm border transition-all ${
                selectedCity === city
                  ? "bg-teal-600 text-white border-teal-600 shadow-md"
                  : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
              }`}>
              {city}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-start gap-8">
        {/* --- Side Bar الجانبي (التخصصات مرتبة أبجدياً) --- */}
        <div className="w-full md:w-[22rem] sticky top-5">
          <button
            onClick={() => setShowFilter(!showFilter)}
            className={`md:hidden w-full py-3 rounded-xl mb-4 text-white font-bold transition-all ${
              showFilter ? "bg-slate-700" : "bg-teal-600"
            }`}>
            {showFilter ? "إغلاق التخصصات" : "تصفية حسب التخصص"}
          </button>

          <div
            className={`flex-col p-2 bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 ${showFilter ? "flex" : "hidden md:flex"}`}>
            <div className="px-6 py-4 border-b border-slate-50 mb-2">
              <h2 className="font-extrabold text-slate-800 text-lg">
                التخصصات
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                اختر التخصص المطلوب للمتابعة
              </p>
            </div>

            <div className="space-y-1 max-h-[70vh] overflow-y-auto px-2 custom-scrollbar">
              {dynamicSpecialities.map((item, index) => {
                const isActive =
                  speciality?.toLowerCase() === item.slug.toLowerCase();
                return (
                  <div
                    key={index}
                    onClick={() =>
                      isActive
                        ? navigate("/doctors")
                        : navigate(`/doctors/${item.slug}`)
                    }
                    className={`group relative flex items-center px-5 py-4 rounded-2xl cursor-pointer transition-all duration-300 ${
                      isActive
                        ? "bg-teal-50/50"
                        : "hover:bg-slate-50 text-slate-500 hover:text-slate-800"
                    }`}>
                    {isActive && (
                      <div className="absolute right-0 top-1/4 bottom-1/4 w-1.5 bg-teal-600 rounded-l-full shadow-[0_0_10px_rgba(13,148,136,0.3)]" />
                    )}
                    <div className="flex items-center justify-between w-full">
                      <span
                        className={`text-[15px] transition-colors duration-300 ${isActive ? "text-teal-700 font-bold" : "font-medium"}`}>
                        {item.name}
                      </span>
                      <span
                        className={`text-[12px] transition-all duration-300 transform ${isActive ? "text-teal-600 opacity-100" : "opacity-0 group-hover:opacity-100 group-hover:-translate-x-1"}`}>
                        ◀
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* --- Doctors Grid --- */}
        {/* --- Doctors Grid --- */}
        <div className="w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 gap-y-6">
            {filteredDoctors.length > 0 ? (
              filteredDoctors.map((item, index) => (
                <div
                  key={index}
                  onClick={() => {
                    navigate(`/appointment/${item._id}`);
                    window.scrollTo(0, 0);
                  }}
                  className="border border-blue-100 rounded-xl overflow-hidden cursor-pointer hover:-translate-y-2 transition-all duration-500 bg-white shadow-sm hover:shadow-lg group text-center">
                  {/* تم زيادة الارتفاع هنا من h-48 إلى h-64 (256px) أو h-72 (288px) حسب رغبتك */}
                  <div className="bg-slate-50 overflow-hidden relative h-64 md:h-72">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-500"
                    />
                    {/* لمسة إضافية: تدرج لوني خفيف أسفل الصورة لتحسين الرؤية */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  <div className="p-4 flex flex-col items-center">
                    <div
                      className={`flex items-center gap-1.5 text-xs mb-2 ${item.available ? "text-green-500" : "text-gray-500"}`}>
                      <span
                        className={`w-2 h-2 rounded-full ${item.available ? "bg-green-500 animate-pulse" : "bg-gray-400"}`}></span>
                      <p className="font-semibold">
                        {item.available ? "متاح الآن" : "غير متاح"}
                      </p>
                    </div>

                    <h3 className="text-lg font-bold text-gray-800 mb-1 group-hover:text-teal-700 transition-colors w-full truncate px-2">
                      {item.name}
                    </h3>

                    <p className="text-teal-600 text-[14px] font-bold mb-1 w-full truncate">
                      {specialityTranslation[item.speciality] ||
                        item.speciality}
                    </p>

                    <div className="flex items-center justify-center gap-1 text-gray-500 text-[12px] mb-4 w-full">
                      <span className="text-teal-500">📍</span>
                      <p className="truncate font-medium">
                        {item.address?.city}، {item.address?.line1}
                      </p>
                    </div>

                    <div className="flex flex-col items-center justify-center pt-3 border-t border-slate-50 w-full">
                      <div className="flex text-yellow-400 text-lg mb-1">
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
                      <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">
                        ({item.numReviews || 0} تقييم)
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-24 text-center text-gray-400 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                <p className="text-xl font-medium">
                  لم نجد أطباء يطابقون خياراتك حالياً
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Doctors;
