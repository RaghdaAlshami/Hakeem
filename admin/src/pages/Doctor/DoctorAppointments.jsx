import React, { useContext, useEffect, useState, useMemo } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { useNavigate } from "react-router-dom";

const DoctorAppointments = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const {
    dToken,
    appointments,
    getAppointments,
    completeAppointment,
    cancelAppointment,
    profileData,
    getProfileData,
  } = useContext(DoctorContext);

  useEffect(() => {
    if (dToken) {
      getAppointments();
      getProfileData();
    }
  }, [dToken]);

  const daysList = useMemo(() => {
    const days = [];
    if (!profileData?.workingDays) return [];

    for (let i = 0; i < 14; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const dayNameInArabic = date.toLocaleDateString("ar-EG", {
        weekday: "long",
      });
      if (profileData.workingDays.includes(dayNameInArabic)) {
        days.push(date);
      }
    }
    return days;
  }, [profileData]);

  const selectedDateStr = `${selectedDate.getDate()}_${selectedDate.getMonth() + 1}_${selectedDate.getFullYear()}`;

  const allDaySlots = useMemo(() => {
    if (!profileData?.workingHours) return [];

    const slots = [];
    const startHour = parseInt(profileData.workingHours.start.split(":")[0]);
    const endHour = parseInt(profileData.workingHours.end.split(":")[0]);

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minutes of ["00", "30"]) {
        const period = hour >= 12 ? "PM" : "AM";
        const hour12 = hour % 12 || 12;
        const formattedHour = hour12.toString().padStart(2, "0");
        const time12 = `${formattedHour}:${minutes} ${period}`;

        const appointment = appointments.find(
          (app) =>
            app.slotDate === selectedDateStr &&
            app.slotTime === time12 &&
            !app.cancelled,
        );

        slots.push({
          time: time12,
          displayTime: `${hour12}:${minutes} ${period === "AM" ? "صباحاً" : "مساءً"}`,
          appointment: appointment || null,
        });
      }
    }
    return slots;
  }, [profileData, appointments, selectedDateStr]);

  if (!profileData)
    return (
      <div className="p-10 text-center font-black text-gray-400 animate-pulse">
        جاري تحميل جدول العيادة...
      </div>
    );

  return (
    <div className="m-5 font-['Cairo'] text-right" dir="rtl">
      <div className="mb-8 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-black text-gray-800 mb-6 flex items-center gap-3">
          <span className="w-2 h-8 bg-teal-600 rounded-full"></span>
          جدول المواعيد القادمة
        </h1>

        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {daysList.map((date, index) => {
            const isSelected =
              date.toDateString() === selectedDate.toDateString();

            const monthName = date.toLocaleDateString("ar-EG", {
              month: "long",
            });

            return (
              <button
                key={index}
                onClick={() => setSelectedDate(date)}
                className={`flex flex-col items-center min-w-[85px] py-4 rounded-2xl transition-all duration-300 ${
                  isSelected
                    ? "bg-teal-800 text-white shadow-xl shadow-teal-100 scale-105"
                    : "bg-gray-50 text-gray-500 hover:bg-white hover:border-teal-200 border border-transparent"
                }`}>
                <span className="text-[10px] font-bold mb-1 opacity-70">
                  {date.toLocaleDateString("ar-EG", { weekday: "short" })}
                </span>

                <span className="text-lg font-black leading-none">
                  {date.getDate()}
                </span>

                <span
                  className={`text-[10px] mt-1 font-bold ${isSelected ? "text-teal-200" : "text-gray-400"}`}>
                  {monthName}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {allDaySlots.map((slot, index) => (
          <div
            key={index}
            className={`relative rounded-2xl p-4 transition-all duration-500 border ${
              slot.appointment
                ? "bg-white border-teal-50 shadow-sm ring-1 ring-teal-50/20"
                : "bg-gray-100 border-dashed border-gray-300 opacity-50"
            }`}>
            <div className="flex justify-between items-center mb-3">
              <span
                className={`text-[10px] font-black px-2 py-1 rounded-lg ${
                  slot.appointment
                    ? "bg-teal-50 text-teal-700 border border-teal-100"
                    : "bg-gray-200 text-gray-600"
                }`}>
                {slot.displayTime}
              </span>
            </div>

            {slot.appointment ? (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
                <div className="flex items-center gap-2 mb-4">
                  <img
                    className="w-11 h-11 rounded-xl object-cover border border-gray-50 shadow-sm"
                    src={slot.appointment.userData.image}
                    alt="Patient"
                  />
                  <div className="overflow-hidden">
                    <p className="text-gray-800 font-black text-xs truncate">
                      {slot.appointment.userData.name}
                    </p>
                    <button
                      onClick={() =>
                        navigate(`/profile/${slot.appointment.userId}`)
                      }
                      className="text-[9px] text-teal-600 font-bold hover:underline">
                      الملف الشخصي ←
                    </button>
                  </div>
                </div>

                <div className="mt-2 flex items-center justify-center gap-8 border-t border-gray-50 pt-3">
                  {!slot.appointment.isCompleted ? (
                    <>
                      <button
                        onClick={() =>
                          completeAppointment(slot.appointment._id)
                        }
                        className="p-2  text-teal-700 hover:bg-teal-100 rounded-lg transition-colors">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2.5"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => cancelAppointment(slot.appointment._id)}
                        className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                        title="إلغاء">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2.5"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </>
                  ) : (
                    <div className="w-full py-1 bg-green-50 rounded-lg flex items-center justify-center gap-1">
                      <svg
                        className="w-3 h-3 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="3"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-[9px] font-black text-green-700">
                        مكتمل
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-4">
                <div className="w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center mb-1 border border-gray-100">
                  <span className="text-gray-300 text-sm">+</span>
                </div>
                <p className="text-[9px] font-bold text-gray-300 ">شاغر</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorAppointments;
