import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import RelatedDoctors from "../components/RelatedDoctors";
import axios from "axios";
import { toast } from "react-toastify";
import { specialityTranslation } from "../assets/assets"; // استيراد القاموس


const Appointment = () => {
  const { docId } = useParams();
  const { doctors, backendUrl, token, getDoctorsData } = useContext(AppContext);
  const navigate = useNavigate();

  const daysOfWeek = [
    "الأحد",
    "الاثنين",
    "الثلاثاء",
    "الأربعاء",
    "الخميس",
    "الجمعة",
    "السبت",
  ];
  const monthsOfYear = [
    "يناير",
    "فبراير",
    "مارس",
    "أبريل",
    "مايو",
    "يونيو",
    "يوليو",
    "أغسطس",
    "سبتمبر",
    "أكتوبر",
    "نوفمبر",
    "ديسمبر",
  ];

  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");

  const fetchDocInfo = async () => {
    const foundDoc = doctors.find((doc) => doc._id === docId);
    setDocInfo(foundDoc);
  };

  // دالة لتحويل AM/PM إلى صباحاً/مساءً للعرض فقط
  const formatTimeArabic = (timeStr) => {
    if (!timeStr) return "";

    // 1. فصل الوقت (مثلاً 10:30) عن العلامة (AM/PM)
    const [time, period] = timeStr.split(" ");

    // 2. تحويل العلامة
    const periodAr = period === "AM" ? "صباحاً" : "مساءً";

    // 3. نرجع النص مع التأكيد على اتجاه الأرقام
    return `${time} ${periodAr}`;
  };

 const getAvailableSlots = async () => {
   setDocSlots([]);
   let today = new Date();
   let allSlots = [];

   // جلب بيانات العمل المحددة للطبيب من قاعدة البيانات
   const workingDaysAr = docInfo.workingDays || []; // الأيام بالعربي
   const startHour = docInfo.workingHours?.start
     ? parseInt(docInfo.workingHours.start.split(":")[0])
     : 10;
   const endHour = docInfo.workingHours?.end
     ? parseInt(docInfo.workingHours.end.split(":")[0])
     : 21;

   for (let i = 0; i < 7; i++) {
     let currentDate = new Date(today);
     currentDate.setDate(today.getDate() + i);

     // 1. التحقق إذا كان اليوم من ضمن أيام عمل الطبيب
     const dayNameAr = daysOfWeek[currentDate.getDay()];
     if (workingDaysAr.length > 0 && !workingDaysAr.includes(dayNameAr)) {
       continue; // تخطي اليوم إذا لم يكن الطبيب يعمل فيه
     }

     let endTime = new Date(currentDate);
     endTime.setHours(endHour, 0, 0, 0);

     // 2. ضبط وقت البداية
     if (today.getDate() === currentDate.getDate()) {
       // إذا كان اليوم هو الحالي، نبدأ من الساعة الحالية + 1 أو وقت بدء الدوام (أيهما أكبر)
       const currentHour = currentDate.getHours();
       currentDate.setHours(
         currentHour >= startHour ? currentHour + 1 : startHour,
       );
       currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
     } else {
       // الأيام القادمة تبدأ من وقت فتح العيادة المخصص
       currentDate.setHours(startHour);
       currentDate.setMinutes(0);
     }

     let timeSlots = [];
     while (currentDate < endTime) {
       let formattedTime = currentDate.toLocaleTimeString("en-US", {
         hour: "2-digit",
         minute: "2-digit",
         hour12: true,
       });

       let day = currentDate.getDate();
       let month = currentDate.getMonth() + 1;
       let year = currentDate.getFullYear();
       let slotDate = day + "_" + month + "_" + year;

       const isSlotAvailable =
         docInfo.slots_booked &&
         docInfo.slots_booked[slotDate] &&
         docInfo.slots_booked[slotDate].includes(formattedTime)
           ? false
           : true;

       if (isSlotAvailable) {
         timeSlots.push({
           datetime: new Date(currentDate),
           time: formattedTime,
           slotDate: slotDate,
         });
       }
       currentDate.setMinutes(currentDate.getMinutes() + 30);
     }

     if (timeSlots.length > 0) {
       allSlots.push(timeSlots);
     }
   }
   setDocSlots(allSlots);
 };

  const bookAppointment = async () => {
    if (!token) {
      toast.warn("يرجى تسجيل الدخول لحجز موعد");
      return navigate("/login");
    }

    if (!slotTime) {
      return toast.error("يرجى اختيار وقت أولاً");
    }

    try {
      const date = docSlots[slotIndex][0].slotDate;
      const { data } = await axios.post(
        backendUrl + "/api/user/book-appointment",
        { docId, slotDate: date, slotTime },
        { headers: { token } },
      );

      if (data.success) {
        toast.success(data.message);
        getDoctorsData();
        navigate("/my-appointments");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchDocInfo();
  }, [doctors, docId]);

  useEffect(() => {
    if (docInfo) getAvailableSlots();
  }, [docInfo]);

  if (!docInfo)
    return (
      <div className="text-center p-20 text-xl font-bold">
        جاري تحميل بيانات الطبيب...
      </div>
    );

  return (
    <div dir="rtl" className="p-5 md:mx-10">
      {/* --- تفاصيل الطبيب --- */}
      <div className="flex flex-col md:flex-row gap-6 lg:gap-12">
        <div className="bg-hakeem-dark w-full md:max-w-72 rounded-2xl overflow-hidden shadow-lg border border-gray-100">
          <img
            className="w-full h-auto object-cover"
            src={docInfo.image}
            alt={docInfo.name}
          />
        </div>

        <div className="flex-1 border border-gray-200 rounded-2xl p-5 bg-white shadow-sm">
          <div className="flex flex-wrap items-center gap-2 text-xl font-bold text-gray-800">
            <h1>{docInfo.name}</h1>
            <img className="w-6" src={assets.verified_icon} alt="" />
            <div
              className={`flex items-center gap-1.5 text-sm font-medium mr-auto md:mr-4 ${docInfo.available ? "text-green-500" : "text-red-500"}`}>
              <span
                className={`w-2 h-2 rounded-full ${docInfo.available ? "bg-green-500 animate-pulse" : "bg-red-500"}`}></span>
              {docInfo.available ? "متاح" : "غير متاح"}
            </div>
          </div>

          {/* --- قسم نجوم التقييم المضاف --- */}
          <div className="flex items-center gap-3 mt-2">
            <div className="flex text-yellow-400 text-lg">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={
                    star <= Math.round(docInfo.rating || 0)
                      ? "text-yellow-400"
                      : "text-gray-200"
                  }>
                  ★
                </span>
              ))}
            </div>
            <div className="flex items-center gap-1 text-sm">
              <span className="font-bold text-gray-700">
                {docInfo.rating ? docInfo.rating.toFixed(1) : "0.0"}
              </span>
              <span className="text-gray-400">
                ({docInfo.numReviews || 0} مراجعة)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-3 text-gray-600 font-medium">
            <p className="text-lg">
              {docInfo.degree} -{" "}
              {specialityTranslation[docInfo.speciality] || docInfo.speciality}
            </p>
            <span className="py-1 px-3 border border-gray-300 text-[10px] text-center rounded-full text-teal-600 bg-gray-50">
              {docInfo.experience} خبرة
            </span>
          </div>

          <div className="mt-5">
            <p className="flex items-center gap-1 text-gray-900 font-bold mb-2">
              نبذة عن الطبيب{" "}
              <img className="w-4" src={assets.info_icon} alt="" />
            </p>
            <p className="text-gray-600 leading-relaxed text-justify max-w-[700px] text-sm md:text-base">
              {docInfo.about}
            </p>
          </div>

          {/* --- قسم العنوان والمدينة المنسق --- */}
          <div className="mt-5 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <p className="text-gray-900 font-bold mb-2 flex items-center gap-2 text-sm">
              موقع العيادة:
            </p>
            <div className="text-gray-600 text-sm leading-6">
              <p className="font-semibold text-teal-800 mb-2">
                {docInfo.address.city}
              </p>
              <p className="text-xs">{docInfo.address.line1}</p>
            </div>
          </div>

          <p className="mt-5 text-gray-600 font-semibold flex items-center gap-2">
            سعر الكشـف:{" "}
            <span className="text-teal-700 font-semibold text-lg">
              {docInfo.fees.toLocaleString()}{" "}
              <span className="text-xs font-medium">ل.س</span>
            </span>
          </p>
        </div>
      </div>

      {/* --- باقي كود قسم المواعيد --- */}
      <div className="mt-10 md:mr-4 font-medium text-gray-700">
        {docInfo.available ? (
          <>
            <p className="text-xl font-bold text-gray-800 mb-6 border-r-4 border-cyan-600 pr-4">
              اختر موعد الحجز المناسب
            </p>
            <div className="flex gap-4 items-center w-full overflow-x-auto pb-4 no-scrollbar">
              {docSlots.length > 0 &&
                docSlots.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      setSlotIndex(index);
                      setSlotTime("");
                    }}
                    className={`text-center py-6 min-w-24 rounded-2xl cursor-pointer transition-all border 
                    ${slotIndex === index ? "bg-hakeem-dark text-white border-hakeem-dark shadow-lg" : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}>
                    <p className="text-sm mb-1">
                      {item[0] && daysOfWeek[item[0].datetime.getDay()]}
                    </p>
                    <p className="text-xl font-bold">
                      {item[0] && item[0].datetime.getDate()}
                    </p>
                    <p className="text-xs mt-1">
                      {item[0] && monthsOfYear[item[0].datetime.getMonth()]}
                    </p>
                  </div>
                ))}
            </div>

            <div className="flex items-center gap-3 w-full overflow-x-auto mt-8 pb-4 no-scrollbar">
              {docSlots.length > 0 &&
                docSlots[slotIndex].map((item, index) => (
                  <button
                    key={index}
                    onClick={() => setSlotTime(item.time)} // هنا تبقى القيمة إنجليزية للحفظ في السيرفر
                    className={`text-sm shrink-0 px-8 py-3 rounded-full cursor-pointer transition-all border
        ${item.time === slotTime ? "bg-hakeem-dark text-white border-hakeem-dark shadow-md" : "text-gray-500 border-gray-200 hover:border-hakeem-dark"}`}>
                    {/* التعديل هنا: العرض بالعربي */}
                    {formatTimeArabic(item.time)}
                  </button>
                ))}
            </div>

            <button
              onClick={bookAppointment}
              className="bg-hakeem-dark text-white text-md font-semibold px-12 py-4 rounded-full mt-10 hover:shadow-2xl hover:scale-105 transition-all w-full md:w-auto">
              تأكيد الموعد مع {docInfo.name}
            </button>
          </>
        ) : (
          <div className="bg-red-50 border border-red-100 text-red-600 p-8 rounded-2xl text-center shadow-inner">
            <p className=" font-bold">
              عذراً، هذا الطبيب غير متاح حالياً للحجوزات.
            </p>
            <p className="text-md mt-2 opacity-80">
              يرجى المحاولة في وقت لاحق أو اختيار طبيب آخر من القائمة.
            </p>
          </div>
        )}
      </div>

      <div className="mt-16 border-t  border-gray-200 pt-10">
        <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
      </div>
    </div>
  );
};;

export default Appointment;
