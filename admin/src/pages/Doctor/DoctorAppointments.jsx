import React, { useContext, useEffect } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";

const DoctorAppointments = () => {
  const navigate = useNavigate();

  const {
    dToken,
    appointments,
    getAppointments,
    completeAppointment,
    cancelAppointment,
  } = useContext(DoctorContext);

  // 1. دالة تنسيق التاريخ
  const formatSlotDate = (slotDate) => {
    const dateArray = slotDate.split("_");
    const months = [
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
    return `${dateArray[0]} ${months[parseInt(dateArray[1]) - 1]} ${dateArray[2]}`;
  };

  // 2. دالة تحويل AM/PM للعرض العربي (مع معالجة ترتيب الأرقام)
  const formatTimeArabic = (timeStr) => {
    if (!timeStr) return "";
    return timeStr.replace("AM", "صباحاً").replace("PM", "مساءً");
  };

  // 3. دالة حساب العمر
  const calculateAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    return age;
  };

  // 4. تحويل الوقت إلى دقائق للمقارنة البرمجية
  const timeToMinutes = (timeStr) => {
    const [time, period] = timeStr.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;
    return hours * 60 + minutes;
  };

  // 5. منطق شريط الحالة المباشر
  const getLiveStats = () => {
    const now = new Date();
    const todayStr = `${now.getDate()}_${now.getMonth() + 1}_${now.getFullYear()}`;
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const todayAppointments = appointments.filter(
      (app) => app.slotDate === todayStr && !app.isCompleted && !app.cancelled,
    );

    const remainingToday = todayAppointments.length;
    let nextAppointmentMsg = "";

    if (remainingToday > 0) {
      const upcoming = todayAppointments
        .map((app) => ({ ...app, mins: timeToMinutes(app.slotTime) }))
        .filter((app) => app.mins > currentMinutes)
        .sort((a, b) => a.mins - b.mins)[0];

      if (upcoming) {
        const diff = upcoming.mins - currentMinutes;
        if (diff <= 60 && diff > 0) {
          nextAppointmentMsg = `أقرب موعد بعد ${diff} دقيقة`;
        } else {
          nextAppointmentMsg = `الموعد القادم عند الساعة ${formatTimeArabic(upcoming.slotTime)}`;
        }
      }
    }
    return { remainingToday, nextAppointmentMsg };
  };

  const { remainingToday, nextAppointmentMsg } = getLiveStats();

  useEffect(() => {
    if (dToken) {
      getAppointments();
    }
  }, [dToken]);

  // 6. ترتيب المواعيد (الأحدث في الأعلى)
  const sortedAppointments = [...appointments].sort((a, b) => {
    const dateA = new Date(a.slotDate.split("_").reverse().join("-"));
    const dateB = new Date(b.slotDate.split("_").reverse().join("-"));
    return dateB - dateA;
  });

  return (
    <div className="m-5 font-['Cairo']" dir="rtl">
      {/* شريط الحالة المباشر */}
      <div className="mb-6 flex flex-wrap gap-4">
        <div className="bg-blue-50 border-r-4 border-blue-500 p-4 rounded-lg shadow-sm flex-1 min-w-[250px]">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
            <p className="text-blue-900 text-lg">
              دكتور، لديك{" "}
              <span className="font-bold text-2xl text-blue-600">
                {remainingToday}
              </span>{" "}
              مواعيد متبقية اليوم
            </p>
          </div>
        </div>

        {nextAppointmentMsg && (
          <div className="bg-orange-50 border-r-4 border-orange-400 p-4 rounded-lg shadow-sm flex-1 min-w-[250px]">
            <div className="flex items-center gap-3">
              <img src={assets.info_icon} className="w-5 opacity-70" alt="" />
              <p className="text-orange-800 font-bold">{nextAppointmentMsg}</p>
            </div>
          </div>
        )}
      </div>

      <p className="text-lg font-medium text-gray-800 mb-4">
        كافة المواعيد (مرتبة زمنياً)
      </p>

      <div className="bg-white border border-gray-300 rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll shadow-sm">
        {/* رأس الجدول */}
        <div className="max-sm:hidden grid grid-cols-[0.5fr_2.5fr_1fr_1fr_3fr_1.5fr_1fr] items-center py-3 px-6 border-b border-gray-300 bg-gray-50 font-bold text-gray-700 text-center">
          <p className="text-right">#</p>
          <p className="text-right">المريض</p>
          <p>السن</p>
          <p>زمرة الدم</p>
          <p>تاريخ الموعد</p>
          <p>المبلغ</p>
          <p>الإجـراء</p>
        </div>

        {sortedAppointments.length > 0 ? (
          sortedAppointments.map((item, index) => (
            <div
              className="flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_2.5fr_1fr_1fr_3fr_1.5fr_1fr] items-center text-gray-500 py-4 px-6 border-b border-gray-300 hover:bg-blue-50/30 transition-all text-center"
              key={index}>
              <p className="max-sm:hidden text-right">{index + 1}</p>

              <div className="flex items-center gap-2 text-right">
                <img
                  className="w-8 h-8 rounded-full bg-gray-200 object-cover"
                  src={item.userData.image}
                  alt=""
                />
                <p
                  onClick={() => navigate(`/profile/${item.userId}`)}
                  className="text-gray-800 font-medium text-sm cursor-pointer hover:text-primary">
                  {item.userData.name}
                </p>
              </div>

              <p>{calculateAge(item.userData.dob)} سنة</p>
              <p className="font-bold text-red-600 bg-red-50 py-1 px-2 rounded-lg inline-block mx-auto">
                {item.userData.bloodGroup || "غير محدد"}
              </p>

              {/* خلية التاريخ والوقت المحدثة */}
              <p className="font-semibold text-gray-700 whitespace-nowrap flex items-center justify-center gap-1">
                <span>{formatSlotDate(item.slotDate)}</span>
                <span className="text-cyan-600 font-bold mx-1">|</span>
                <span dir="ltr" className="inline-block">
                  {formatTimeArabic(item.slotTime)}
                </span>
              </p>

              <p className="text-hakeem-dark font-semibold">
                {item.amount.toLocaleString()} ل.س
              </p>

              {item.cancelled ? (
                <p className="text-red-500 font-medium">ملـغي</p>
              ) : item.isCompleted ? (
                <p className="text-green-600 font-medium">مكـتمل</p>
              ) : (
                <div className="flex justify-center items-center gap-4">
                  <img
                    onClick={() => cancelAppointment(item._id)}
                    className="w-7 cursor-pointer hover:scale-125 transition-all"
                    src={assets.cancel_icon}
                    title="إلغاء الموعد"
                    alt=""
                  />
                  <img
                    onClick={() => completeAppointment(item._id)}
                    className="w-7 cursor-pointer hover:scale-125 transition-all"
                    src={assets.tick_icon}
                    title="تم الكشف"
                    alt=""
                  />
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center p-20 text-gray-400">
            <p className="text-lg">لا توجد مواعيد محجوزة حالياً دكتور.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorAppointments;
