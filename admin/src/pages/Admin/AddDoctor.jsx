import React, { useState, useContext } from "react";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";
import axios from "axios";
import { assets, specialityTranslation } from "../../assets/assets";

const AddDoctor = () => {
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
  const hoursRange = Array.from(
    { length: 24 },
    (_, i) => `${String(i).padStart(2, "0")}:00`,
  );

  const [docImg, setDocImg] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [experience, setExperience] = useState("1 Year");
  const [fees, setFees] = useState("");
  const [about, setAbout] = useState("");
  const [speciality, setSpeciality] = useState("General Physician");
  const [degree, setDegree] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");

  const [workingDays, setWorkingDays] = useState([]);
  const [workingHours, setWorkingHours] = useState({
    start: "09:00",
    end: "17:00",
  });

  const { aToken, backendUrl } = useContext(AdminContext);

  const toggleDay = (day) => {
    setWorkingDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    // التحقق من الحقول الإجبارية فقط
    if (!name || !email || !password || !speciality || !address2 || !fees) {
      return toast.error(
        "يرجى ملء الحقول الأساسية: الاسم، الإيميل، كلمة السر، الاختصاص، المدينة، وسعر الكشف",
      );
    }

    try {
      const formData = new FormData();

      // الحقول الإجبارية
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("speciality", speciality);
      formData.append("fees", Number(fees));
      formData.append(
        "address",
        JSON.stringify({ line1: address1 || "غير محدد", city: address2 }),
      );

      // الحقول الاختيارية (مع إضافة قيم افتراضية إذا كانت فارغة)
      if (docImg) formData.append("image", docImg);
      formData.append("degree", degree || "غير محدد");
      formData.append("experience", experience);
      formData.append("about", about || "");

      // إرسال الأيام والساعات (حتى لو فارغة لن تسبب خطأ في الإرسال)
      formData.append("workingDays", JSON.stringify(workingDays));
      formData.append("workingHours", JSON.stringify(workingHours));

      const { data } = await axios.post(
        backendUrl + "/api/admin/add-doctor",
        formData,
        { headers: { aToken } },
      );

      if (data.success) {
        toast.success(data.message);
        // تصفير الحقول
        setDocImg(false);
        setName("");
        setEmail("");
        setPassword("");
        setAddress1("");
        setAddress2("");
        setAbout("");
        setFees("");
        setWorkingDays([]);
        setDegree("");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };
  console.log("التخصصات المتاحة:", specialityTranslation);
  const totalSpecs = Object.keys(specialityTranslation).length;
  console.log("عدد التخصصات المسجلة حالياً:", totalSpecs);
  const inputStyle =
    "bg-gray-50 rounded px-3 py-2 outline-hakeem-dark w-full border border-gray-200 focus:bg-white transition-all text-sm";

  return (
    <form
      onSubmit={onSubmitHandler}
      className='m-5 w-full font-["Cairo"] text-right'
      dir="rtl">
      <p className="mb-3 text-lg font-bold text-gray-700">إضافة طبيب جديد</p>

      <div className="bg-white px-6 py-6 rounded-xl w-full max-w-4xl max-h-[85vh] overflow-y-scroll shadow-md space-y-8">
        {/* قسم الصورة (اختياري) */}
        <div className="flex items-center gap-4 text-gray-500 border-b pb-4">
          <label htmlFor="doc-img">
            <img
              className="w-16 h-16 bg-gray-100 rounded-full cursor-pointer object-cover"
              src={docImg ? URL.createObjectURL(docImg) : assets.upload_area}
              alt=""
            />
          </label>
          <input
            onChange={(e) => setDocImg(e.target.files[0])}
            type="file"
            id="doc-img"
            hidden
          />
          <p className="text-xs italic">تحميل صورة (اختياري)</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          <div className="flex-1 flex flex-col gap-4">
            <div>
              <p className="text-sm mb-1">
                اسم الطبيب <span className="text-red-500">*</span>
              </p>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                className={inputStyle}
                type="text"
                placeholder="الاسم الكامل"
                required
              />
            </div>
            <div>
              <p className="text-sm mb-1">
                البريد الإلكتروني <span className="text-red-500">*</span>
              </p>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className={inputStyle}
                type="email"
                placeholder="example@mail.com"
                required
              />
            </div>
            <div>
              <p className="text-sm mb-1">
                كلمة المرور <span className="text-red-500">*</span>
              </p>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className={inputStyle}
                type="password"
                placeholder="كلمة المرور"
                required
              />
            </div>
            <div>
              <p className="text-sm mb-1 text-hakeem-dark font-bold">
                أيام العمل (اختياري)
              </p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {daysOfWeek.map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] border transition-all ${workingDays.includes(day) ? "bg-hakeem-dark text-white" : "bg-white text-gray-400 border-gray-200"}`}>
                    {day}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-4">
            <select
              onChange={(e) => setSpeciality(e.target.value)}
              value={speciality}
              className={inputStyle}
              required>
              <option value="">-- اختر التخصص --</option>
              {Object.entries(specialityTranslation)
                .sort((a, b) => a[1].localeCompare(b[1], "ar")) // ترتيب أبجدي عربي
                .map(([enName, arName]) => (
                  <option key={enName} value={enName}>
                    {arName}
                  </option>
                ))}
            </select>
            <div>
              <p className="text-sm mb-1">المؤهل العلمي (اختياري)</p>
              <input
                onChange={(e) => setDegree(e.target.value)}
                value={degree}
                className={inputStyle}
                type="text"
                placeholder="مثلاً: دكتوراه"
              />
            </div>
            <div>
              <p className="text-sm mb-1 text-hakeem-dark font-bold">
                ساعات الدوام (اختياري)
              </p>
              <div className="grid grid-cols-2 gap-2">
                <select
                  className={inputStyle}
                  value={workingHours.start}
                  onChange={(e) =>
                    setWorkingHours((p) => ({ ...p, start: e.target.value }))
                  }>
                  {hoursRange.map((h) => (
                    <option key={h} value={h}>
                      من: {h}
                    </option>
                  ))}
                </select>
                <select
                  className={inputStyle}
                  value={workingHours.end}
                  onChange={(e) =>
                    setWorkingHours((p) => ({ ...p, end: e.target.value }))
                  }>
                  {hoursRange.map((h) => (
                    <option key={h} value={h}>
                      إلى: {h}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <p className="text-sm mb-1">
                العنوان <span className="text-red-500">*</span>
              </p>
              <select
                onChange={(e) => setAddress2(e.target.value)}
                value={address2}
                className={inputStyle}
                required>
                <option value="">-- اختر المدينة --</option>
                {syrianCities.map((city, index) => (
                  <option key={index} value={city}>
                    {city}
                  </option>
                ))}
              </select>
              <input
                onChange={(e) => setAddress1(e.target.value)}
                value={address1}
                className={`${inputStyle} mt-2`}
                type="text"
                placeholder="الشارع/البناء (اختياري)"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-sm font-bold">معلومات إضافية</p>
          <div className="flex gap-4">
            <textarea
              onChange={(e) => setAbout(e.target.value)}
              value={about}
              className={`${inputStyle} flex-1 resize-none`}
              placeholder="نبذة عن الطبيب (اختياري)..."
              rows={3}
            />
            <div className="w-1/3 flex flex-col gap-2">
              <p className="text-[10px] text-gray-400">سعر الكشف *</p>
              <input
                onChange={(e) => setFees(e.target.value)}
                value={fees}
                className={inputStyle}
                type="number"
                placeholder="ل.س"
                required
              />
              <p className="text-[10px] text-gray-400">سنوات الخبرة</p>
              <select
                onChange={(e) => setExperience(e.target.value)}
                value={experience}
                className={inputStyle}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((yr) => (
                  <option key={yr} value={`${yr} Year${yr > 1 ? "s" : ""}`}>
                    {yr} {yr === 1 ? "سنة" : yr === 2 ? "سنتان" : "سنوات"}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="bg-hakeem-dark w-full md:w-auto px-12 py-3 text-white rounded-lg font-bold shadow-lg hover:brightness-110 active:scale-95 transition-all">
          إضافة الطبيب
        </button>
      </div>
    </form>
  );
};

export default AddDoctor;
