import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";

const MyProfile = () => {
  const { userData, setUserData, token, backendUrl, loadUserProfileData } =
    useContext(AppContext);

  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(false);

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const syrianCities = [
    "دمشق",
    "حلب",
    "حمص",
    "حماة",
    "اللاذقية",
    "طرطوس",
    "إدلب",
    "دير الزور",
    "درعا",
    "السويداء",
  ];

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  const updateUserProfileData = async () => {
    try {
      if (userData.phone.length !== 10) {
        return toast.error(
          "يجب أن يتكون رقم الهاتف من 10 أرقام تماماً (مثال: 09xxxxxxxx)",
        );
      }

      if (
        passwords.newPassword &&
        passwords.newPassword !== passwords.confirmPassword
      ) {
        return toast.error("كلمة المرور الجديدة غير متطابقة");
      }

      const formData = new FormData();
      formData.append("name", userData.name);
      formData.append("phone", userData.phone);
      formData.append("address", JSON.stringify(userData.address));
      formData.append("gender", userData.gender);
      formData.append("dob", userData.dob);
      formData.append("bloodGroup", userData.bloodGroup);

      if (passwords.currentPassword)
        formData.append("currentPassword", passwords.currentPassword);
      if (passwords.newPassword)
        formData.append("newPassword", passwords.newPassword);
      if (image) formData.append("image", image);

      const { data } = await axios.post(
        backendUrl + "/api/user/update-profile",
        formData,
        { headers: { token } },
      );

      if (data.success) {
        toast.success(data.message);
        await loadUserProfileData();
        setIsEdit(false);
        setImage(false);
        setPasswords({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  console.log("Current User Data:", userData);
  return (
    userData && (
      <div
        dir="rtl"
        className="min-h-screen bg-slate-50/50 py-12 px-4 font-cairo text-right">
        <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-100 h-24 relative">
            <div className="absolute -bottom-10 right-8">
              {isEdit ? (
                <label
                  htmlFor="image"
                  className="relative cursor-pointer block group">
                  <img
                    className="w-24 h-24 rounded-xl object-cover border-4 border-white shadow-md group-hover:brightness-90 transition-all"
                    src={image ? URL.createObjectURL(image) : userData.image}
                    alt="profile"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <img
                      className="w-8"
                      src={assets.upload_icon}
                      alt="upload"
                    />
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
                  className="w-24 h-24 rounded-xl object-cover border-4 border-white shadow-md"
                  src={userData.image}
                  alt="profile"
                />
              )}
            </div>
          </div>

          <div className="pt-14 pb-8 px-8">
            <div className="mb-6">
              {isEdit ? (
                <input
                  className="text-xl font-bold text-slate-800 border-b border-teal-500 outline-none w-full bg-slate-50 px-2 py-1 rounded"
                  type="text"
                  value={userData.name}
                  onChange={(e) =>
                    setUserData((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
              ) : (
                <h1 className="text-xl font-bold text-slate-800">
                  {userData.name}
                </h1>
              )}
              <p className="text-slate-400 text-xs mt-0.5">{userData.email}</p>
            </div>

            <div className="space-y-6">
              <section>
                <h3 className="text-teal-700 text-[13px] font-bold mb-3 flex items-center gap-2 opacity-80 uppercase tracking-wider">
                  معلومات الاتصال
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="flex flex-col gap-1 items-start">
                    <p className="text-[11px] text-slate-400 font-bold">
                      رقم الهاتف:
                    </p>
                    {isEdit ? (
                      <input
                        className="text-xs w-full bg-white p-1.5 rounded border border-slate-200 outline-none focus:border-teal-400 text-right font-mono"
                        type="tel"
                        dir="ltr"
                        maxLength="10"
                        placeholder="09xxxxxxxx"
                        value={userData.phone}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "");
                          setUserData((prev) => ({
                            ...prev,
                            phone: val,
                          }));
                        }}
                      />
                    ) : (
                      <p className="text-xs font-medium text-slate-700 font-mono w-full text-right">
                        {userData.phone}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-1 items-start">
                    <p className="text-[11px] text-slate-400 font-bold">
                      العنوان:
                    </p>
                    {isEdit ? (
                      <select
                        className="text-xs w-full bg-white p-1.5 rounded border border-slate-200 outline-none focus:border-teal-400 cursor-pointer"
                        value={userData.address.city}
                        onChange={(e) =>
                          setUserData((prev) => ({
                            ...prev,
                            address: {
                              city: e.target.value,
                              line1: e.target.value,
                            },
                          }))
                        }>
                        <option value="" disabled>
                          اختر المدينة
                        </option>
                        {syrianCities.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <p className="text-xs font-medium text-slate-700">
                        {userData.address.city}
                      </p>
                    )}
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-teal-700 text-[13px] font-bold mb-3 flex items-center gap-2 opacity-80 uppercase tracking-wider">
                  المعلومات الأساسية
                </h3>
                <div className="grid grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="flex flex-col items-start">
                    <p className="text-[11px] text-slate-400 font-bold mb-1">
                      زمرة الدم
                    </p>
                    {isEdit ? (
                      <select
                        className="text-[11px] w-full bg-white p-1 rounded border outline-none"
                        value={userData.bloodGroup}
                        onChange={(e) =>
                          setUserData((prev) => ({
                            ...prev,
                            bloodGroup: e.target.value,
                          }))
                        }>
                        {bloodGroups.map((g) => (
                          <option key={g} value={g}>
                            {g}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="text-[10px] font-bold bg-white text-red-500 border border-red-100 px-2 py-0.5 rounded shadow-sm">
                        {userData.bloodGroup || "--"}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col items-start">
                    <p className="text-[11px] text-slate-400 font-bold mb-1">
                      الجنس
                    </p>
                    {isEdit ? (
                      <select
                        className="text-[11px] w-full bg-white p-1 rounded border outline-none"
                        value={userData.gender}
                        onChange={(e) =>
                          setUserData((prev) => ({
                            ...prev,
                            gender: e.target.value,
                          }))
                        }>
                        <option value="ذكر">ذكر</option>
                        <option value="أنثى">أنثى</option>
                      </select>
                    ) : (
                      <p className="text-xs font-medium text-slate-700">
                        {userData.gender}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col items-start">
                    <p className="text-[11px] text-slate-400 font-bold mb-1">
                      تاريخ الميلاد
                    </p>
                    {isEdit ? (
                      <input
                        className="text-[10px] w-full bg-white p-1 rounded border outline-none"
                        type="date"
                        value={userData.dob}
                        onChange={(e) =>
                          setUserData((prev) => ({
                            ...prev,
                            dob: e.target.value,
                          }))
                        }
                      />
                    ) : (
                      <p className="text-xs font-medium text-slate-700">
                        {userData.dob}
                      </p>
                    )}
                  </div>
                </div>
              </section>

              {isEdit && (
                <section className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <h3 className="text-slate-500 text-[11px] font-bold mb-3 flex items-center gap-2 uppercase tracking-widest">
                    <span>🛡️</span> إعدادات الأمان
                  </h3>
                  <div className="bg-amber-50/40 p-4 rounded-xl border border-amber-100 space-y-3">
                    <input
                      className="text-xs w-full bg-white p-2 rounded border border-amber-200 outline-none focus:ring-1 ring-amber-300 text-right"
                      type="password"
                      placeholder="كلمة المرور الحالية"
                      value={passwords.currentPassword}
                      onChange={(e) =>
                        setPasswords({
                          ...passwords,
                          currentPassword: e.target.value,
                        })
                      }
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        className="text-xs w-full bg-white p-2 rounded border border-amber-200 outline-none text-right"
                        type="password"
                        placeholder="جديدة"
                        value={passwords.newPassword}
                        onChange={(e) =>
                          setPasswords({
                            ...passwords,
                            newPassword: e.target.value,
                          })
                        }
                      />
                      <input
                        className="text-xs w-full bg-white p-2 rounded border border-amber-200 outline-none text-right"
                        type="password"
                        placeholder="تأكيد"
                        value={passwords.confirmPassword}
                        onChange={(e) =>
                          setPasswords({
                            ...passwords,
                            confirmPassword: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </section>
              )}
            </div>

            <div className="mt-10 flex justify-end items-center gap-3">
              {isEdit ? (
                <>
                  <button
                    onClick={() => setIsEdit(false)}
                    className="text-xs text-slate-400 hover:text-slate-600 font-bold transition-colors">
                    إلغاء الأمر
                  </button>
                  <button
                    onClick={updateUserProfileData}
                    className="text-xs px-6 py-2 rounded-lg bg-teal-600 text-white shadow-md hover:bg-teal-700 active:scale-95 transition-all font-bold">
                    حفظ الملف
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEdit(true)}
                  className="text-xs px-6 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 active:scale-95 transition-all font-bold">
                  تعديل البيانات الشخصية
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default MyProfile;
