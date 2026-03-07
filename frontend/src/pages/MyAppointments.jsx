import React, { useContext, useEffect, useState, useMemo } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { specialityTranslation } from "../assets/assets";

const MyAppointments = () => {
  const { backendUrl, token, getDoctorsData } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState("upcoming");
  const [hoverRating, setHoverRating] = useState({ id: null, value: 0 });

  const navigate = useNavigate();

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

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split("_");
    return `${dateArray[0]} ${monthsOfYear[Number(dateArray[1]) - 1]} ${dateArray[2]}`;
  };

  const formatTimeArabic = (timeStr) => {
    if (!timeStr) return "";
    const [time, period] = timeStr.split(" ");
    const periodAr = period === "AM" ? "صباحاً" : "مساءً";
    return `${time} ${periodAr}`;
  };

  const isAppointmentMissed = (slotDate, slotTime) => {
    const dateArray = slotDate.split("_"); 
    const [time, period] = slotTime.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    if (period === "PM" && hours < 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;

    const appointmentDateTime = new Date(
      dateArray[2],
      Number(dateArray[1]) - 1,
      dateArray[0],
      hours,
      minutes,
    );

    return new Date() > appointmentDateTime;
  };

  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/appointments", {
        headers: { token },
      });
      if (data.success) {
        setAppointments(data.appointments);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const filteredAppointments = useMemo(() => {
    return appointments
      .filter((item) => {
        const missed = isAppointmentMissed(item.slotDate, item.slotTime);

        if (filter === "upcoming") {
          return !item.cancelled && !item.isCompleted && !missed;
        }
        if (filter === "completed") {
          return item.isCompleted;
        }
        if (filter === "cancelled") {
          return item.cancelled;
        }
        if (filter === "missed") {
          return !item.cancelled && !item.isCompleted && missed;
        }
        return true;
      })
      .sort((a, b) => {
        const dateA = new Date(a.slotDate.split("_").reverse().join("-"));
        const dateB = new Date(b.slotDate.split("_").reverse().join("-"));
        return dateB - dateA;
      });
  }, [appointments, filter]);

  const cancelAppointment = async (appointmentId) => {
    const isConfirmed = window.confirm(
      "هل أنت متأكد من رغبتك في إلغاء هذا الموعد؟",
    );
    if (isConfirmed) {
      try {
        const { data } = await axios.post(
          backendUrl + "/api/user/cancel-appointment",
          { appointmentId },
          { headers: { token } },
        );
        if (data.success) {
          toast.success(data.message);
          getUserAppointments();
          getDoctorsData();
        }
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const handleRate = async (appointmentId, ratingValue) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/rate-appointment",
        { appointmentId, rating: ratingValue },
        { headers: { token } },
      );
      if (data.success) {
        toast.success("شكراً لتقييمك!");
        getUserAppointments();
        getDoctorsData();
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) getUserAppointments();
  }, [token]);

  return (
    <div dir="rtl" className="p-5 md:mx-10 font-cairo text-right min-h-screen">
      <h1 className="text-xl font-bold text-slate-800 mb-6 pb-3 border-b border-slate-100 w-fit pr-2 border-r-4 border-r-teal-600">
        قائمة مواعيدي
      </h1>

      <div className="flex flex-wrap gap-2 mb-8 bg-slate-100 p-1 rounded-xl w-fit">
        {[
          { id: "upcoming", label: "القادمة" },
          { id: "completed", label: "المكتملة" },
          { id: "cancelled", label: "الملغية" },
          { id: "missed", label: "الفائتة" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
              filter === tab.id
                ? "bg-white text-teal-600 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map((item, index) => {
            const missed = isAppointmentMissed(item.slotDate, item.slotTime);

            return (
              <div
                key={index}
                className="flex flex-col sm:flex-row gap-6 p-4 bg-white border border-slate-100 rounded-2xl hover:shadow-md transition-shadow">
                <div className="flex-shrink-0">
                  <img
                    onClick={() => navigate(`/appointment/${item.docId}`)}
                    className="w-32 h-40 sm:w-28 sm:h-32 object-cover bg-teal-50 rounded-xl cursor-pointer"
                    src={item.docData.image}
                    alt={item.docData.name}
                  />
                </div>

                <div className="flex-1">
                  <p className="text-xl font-semibold text-slate-800 mb-1">
                    {item.docData.name}
                  </p>
                  <p className="text-teal-600 font-semibold text-sm mb-3">
                    {specialityTranslation[item.docData.speciality]}
                  </p>
                  <div className="space-y-1 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg inline-block min-w-[220px]">
                    <p>
                      <span className="font-bold">التاريخ:</span>{" "}
                      {slotDateFormat(item.slotDate)}
                    </p>
                    <p>
                      <span className="font-bold">الوقت:</span>{" "}
                      {formatTimeArabic(item.slotTime)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 justify-center sm:min-w-[160px]">
                  {!item.cancelled && !item.isCompleted && !missed && (
                    <button
                      onClick={() => cancelAppointment(item._id)}
                      className="py-2.5 px-4 text-sm font-bold text-red-600 border border-red-100 rounded-xl hover:bg-red-600 hover:text-white transition-all">
                      إلغاء الموعد
                    </button>
                  )}

                  {!item.cancelled && !item.isCompleted && missed && (
                    <span className="py-2 px-4 text-center text-sm font-bold text-amber-600 bg-amber-50 rounded-xl border border-amber-100">
                      موعد فائت
                    </span>
                  )}

                  {item.cancelled && (
                    <span className="py-2 px-4 text-center text-sm font-bold text-red-400 bg-red-50 rounded-xl border border-red-100">
                      تم إلغاء الموعد
                    </span>
                  )}

                  {item.isCompleted && (
                    <div className="flex flex-col gap-2">
                      <span className="py-2 px-4 text-center text-sm font-bold text-teal-600 bg-teal-50 rounded-xl border border-teal-100">
                        مكتمل ✓
                      </span>
                      <div className="flex flex-col items-center p-2 bg-yellow-50/30 rounded-xl border border-yellow-100/50">
                        {!item.isRated ? (
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                className={`text-xl transition-transform hover:scale-125 ${
                                  star <=
                                  (hoverRating.id === item._id
                                    ? hoverRating.value
                                    : 0)
                                    ? "text-yellow-400"
                                    : "text-slate-200"
                                }`}
                                onMouseEnter={() =>
                                  setHoverRating({ id: item._id, value: star })
                                }
                                onMouseLeave={() =>
                                  setHoverRating({ id: null, value: 0 })
                                }
                                onClick={() => handleRate(item._id, star)}>
                                ★
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className="flex text-yellow-400 text-sm">
                            {"★".repeat(item.rating)}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 text-slate-400 font-bold">
            لا توجد مواعيد في هذا القسم حالياً
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAppointments;
