import React, { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { specialityTranslation } from "../../assets/assets";
import { assets } from "../../assets/assets";


const DoctorProfile = () => {
  const { dToken, profileData, setProfileData, getProfileData, backendUrl } =
    useContext(DoctorContext);
  const { currency } = useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(false);

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
  const daysOfWeek = [
    "السبت",
    "الأحد",
    "الاثنين",
    "الثلاثاء",
    "الأربعاء",
    "الخميس",
    "الجمعة",
  ];

  const hoursRange = Array.from({ length: 24 }, (_, i) =>
    i < 10 ? `0${i}:00` : `${i}:00`,
  );

  const toggleDay = (day) => {
    if (!isEdit) return;
    setProfileData((prev) => {
      const currentDays = prev.workingDays || [];
      const newDays = currentDays.includes(day)
        ? currentDays.filter((d) => d !== day)
        : [...currentDays, day];
      return { ...prev, workingDays: newDays };
    });
  };

  const updateProfile = async () => {
    try {
      const formData = new FormData();

      // إضافة البيانات الأساسية
       formData.append("name", profileData.name);
      formData.append("fees", profileData.fees);
      formData.append("about", profileData.about);
      formData.append("available", profileData.available);
      formData.append("experience", profileData.experience);
      
      formData.append("address", JSON.stringify(profileData.address));
      formData.append("workingDays", JSON.stringify(profileData.workingDays));
      formData.append("workingHours", JSON.stringify(profileData.workingHours));

      // إضافة الصورة إذا تم اختيار صورة جديدة
      
      image && formData.append("image", image);

      const { data } = await axios.post(
        backendUrl + "/api/doctor/update-profile",
        formData,
        { headers: { dToken } },
      );

      if (data.success) {
        toast.success(data.message);
        await getProfileData();
        setIsEdit(false);
        setImage(false); // إعادة تعيين الصورة المختارة
        
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  const renderStars = (rating) => (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <span
          key={i}
          className={`text-lg ${i < Math.round(rating) ? "text-yellow-400" : "text-gray-300"}`}>
          ★
        </span>
      ))}
    </div>
  );

  useEffect(() => {
    if (dToken) getProfileData();
  }, [dToken]);

return (
  profileData && (
    <div
      className="m-2 md:m-5 flex flex-col items-center font-['Cairo']"
      dir="rtl">
      <div className="w-full max-w-2xl bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-100">
        {/* 1. قسم الصورة والاسم - تم تحسين التنسيق هنا */}
        <div className="relative bg-gradient-to-r from-hakeem-dark/5 to-transparent p-6 pb-12 md:pb-6 flex flex-col md:flex-row items-center md:items-end gap-6">
          {/* حاوية الصورة */}
          <div className="relative z-10">
            {isEdit ? (
              <label
                htmlFor="image"
                className="relative cursor-pointer block group">
                <img
                  className="w-28 h-28 md:w-32 md:h-32 rounded-2xl object-cover border-4 border-white shadow-lg group-hover:brightness-90 transition-all"
                  src={image ? URL.createObjectURL(image) : profileData.image}
                  alt="profile"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 rounded-2xl">
                  <img className="w-8" src={assets.upload_icon} alt="upload" />
                </div>
                <input
                  onChange={(e) => setImage(e.target.files[0])}
                  type="file"
                  id="image"
                  hidden
                />
              </label>
            ) : (
              <img
                className="w-28 h-28 md:w-32 md:h-32 rounded-2xl object-cover border-4 border-white shadow-lg"
                src={profileData.image}
                alt="profile"
              />
            )}
          </div>

          {/* حاوية النصوص */}
          <div className="text-center md:text-right flex-1 space-y-1">
            {isEdit ? (
              <input
                className="text-2xl font-bold text-slate-800 border-b-2 border-teal-500 outline-none w-full md:w-2/3 bg-slate-50 px-2 py-1 rounded"
                type="text"
                value={profileData.name}
                onChange={(e) =>
                  setProfileData((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            ) : (
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                {profileData.name}
              </h1>
            )}

            <p className="text-slate-500 text-sm font-medium">
              {profileData.email}
            </p>

            {/* النجوم والمراجعات */}
            <div className="mt-2 flex items-center justify-center md:justify-start gap-3">
              <div className="flex items-center text-yellow-400">
                {renderStars(profileData.rating || 5)}
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <span className="font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
                  {profileData.rating ? profileData.rating.toFixed(1) : "0.0"}
                </span>
                <span className="text-gray-400 font-medium">
                  ({profileData.numReviews || 0} مراجعة)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* باقي الأقسام تبدأ من هنا... */}

        <div className="p-6 space-y-6">
          {/* 2. قسم النبذة التعريفية */}
          {/* 2. قسم النبذة التعريفية - أصبح قابلاً للتعديل الآن */}
          <section>
            <h3 className="flex items-center gap-2 text-gray-800 font-bold mb-2 text-sm">
              <span className="w-1 h-4 bg-hakeem-dark rounded-full"></span> نبذة
              تعريفية
            </h3>

            {isEdit ? (
              <textarea
                className="w-full bg-white border border-gray-300 rounded-lg p-3 text-xs leading-relaxed outline-none focus:border-hakeem-dark transition-all resize-none"
                rows={4}
                value={profileData.about}
                onChange={(e) =>
                  setProfileData((prev) => ({
                    ...prev,
                    about: e.target.value,
                  }))
                }
                placeholder="اكتب نبذة عن خبراتك الطبية..."
              />
            ) : (
              <p className="text-gray-600 bg-gray-50 p-3 rounded-lg leading-relaxed text-xs border border-gray-100 ">
                "{profileData.about}"
              </p>
            )}
          </section>

          {/* 3. قسم جدول العمل - جعل الأزرار أصغر */}
          <section className="bg-slate-50 p-4 rounded-xl border border-gray-100">
            <h3 className="flex items-center gap-2 text-gray-800 font-bold mb-3 text-sm">
              <span className="w-1 h-4 bg-cyan-600 rounded-full"></span> جدول
              المواعيد
            </h3>

            <div className="mb-5">
              <div className="flex flex-wrap gap-1.5">
                {daysOfWeek.map((day) => {
                  const isSelected = profileData.workingDays?.includes(day);
                  return (
                    <button
                      key={day}
                      onClick={() => toggleDay(day)}
                      type="button"
                      disabled={!isEdit}
                      className={`flex-1 min-w-[60px] py-1.5 rounded-lg text-[11px] font-medium transition-all
                      ${isSelected ? "bg-hakeem-dark text-white" : "bg-white text-gray-400 border border-gray-200"}`}>
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-2.5 rounded-lg border border-gray-100 flex flex-col gap-1">
                <span className="text-[10px] text-gray-400">بدء الدوام:</span>
                {isEdit ? (
                  <select
                    className="text-xs font-bold text-hakeem-dark outline-none bg-transparent"
                    value={profileData.workingHours?.start || "09:00"}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        workingHours: {
                          ...prev.workingHours,
                          start: e.target.value,
                        },
                      }))
                    }>
                    {hoursRange.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className="text-xs font-bold">
                    {profileData.workingHours?.start || "09:00"}
                  </span>
                )}
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-gray-100 flex flex-col gap-1">
                <span className="text-[10px] text-gray-400">
                  انتهاء الدوام:
                </span>
                {isEdit ? (
                  <select
                    className="text-xs font-bold text-hakeem-dark outline-none bg-transparent"
                    value={profileData.workingHours?.end || "17:00"}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        workingHours: {
                          ...prev.workingHours,
                          end: e.target.value,
                        },
                      }))
                    }>
                    {hoursRange.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className="text-xs font-bold">
                    {profileData.workingHours?.end || "17:00"}
                  </span>
                )}
              </div>
            </div>
          </section>

          {/* 4. الموقع والتكاليف - تصغير الخطوط والمسافات */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section className="space-y-3">
              <h3 className="text-gray-800 font-bold text-sm flex items-center gap-2 ">
                <span className="w-1 h-3 bg-cyan-600 rounded-full"></span>{" "}
                الموقع
              </h3>
              <input
                disabled={!isEdit}
                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-hakeem-dark disabled:bg-gray-50"
                type="text"
                placeholder="العنوان"
                value={profileData.address.line1}
                onChange={(e) =>
                  setProfileData((prev) => ({
                    ...prev,
                    address: { ...prev.address, line1: e.target.value },
                  }))
                }
              />
              <select
                disabled={!isEdit}
                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs outline-none disabled:bg-gray-50"
                value={profileData.address.city}
                onChange={(e) =>
                  setProfileData((prev) => ({
                    ...prev,
                    address: { ...prev.address, city: e.target.value },
                  }))
                }>
                {syrianCities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </section>

            <section className="space-y-3">
              <h3 className="text-gray-800 font-bold text-sm flex items-center gap-2 ">
                <span className="w-1 h-3 bg-cyan-600 rounded-full"></span>{" "}
                سعر الكشف
              </h3>
              <div className="relative">
                <input
                  disabled={!isEdit}
                  type="number"
                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs font-bold outline-none disabled:bg-gray-50"
                  value={profileData.fees}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      fees: e.target.value,
                    }))
                  }
                />
                <span className="absolute left-3 top-2 text-[10px] text-gray-400">
                  {currency}
                </span>
              </div>
              <div
                onClick={() =>
                  isEdit &&
                  setProfileData((prev) => ({
                    ...prev,
                    available: !prev.available,
                  }))
                }
                className={`flex items-center justify-between p-2 rounded-lg border text-[11px] font-bold cursor-pointer ${profileData.available ? "bg-green-50 border-green-100 text-green-600" : "bg-red-50 border-red-100 text-red-600"}`}>
                <span>
                  {profileData.available
                    ? "استقبال الحجوزات: مفعّل"
                    : "استقبال الحجوزات: متوقف"}
                </span>
                <div
                  className={`w-2 h-2 rounded-full ${profileData.available ? "bg-green-500" : "bg-red-500"}`}></div>
              </div>
            </section>
          </div>
        </div>

        {/* 5. زر التحكم - تقليل الحجم */}
        <div className="p-4 bg-gray-50 flex justify-center border-t border-gray-100">
          <button
            onClick={isEdit ? updateProfile : () => setIsEdit(true)}
            className="px-8 py-2.5 rounded-full font-bold text-sm shadow-md transition-all active:scale-95 bg-hakeem-dark text-white hover:opacity-90">
            {isEdit ? "حفظ التغييرات" : "تعديل الملف"}
          </button>
        </div>
      </div>
    </div>
  )
);
};

export default DoctorProfile;
