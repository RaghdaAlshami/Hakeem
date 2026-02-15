import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";

const AllAppointments = () => {
  // 1. تأكدي من استخراج cancelAppointment و getAllAppointments بشكل صحيح
  const { aToken, appointments, getAllAppointments, cancelAppointment } =
    useContext(AdminContext);
  const { slotDateFormat, currency } = useContext(AppContext);

  useEffect(() => {
    if (aToken) {
      getAllAppointments();
    }
  }, [aToken]);

  return (
    <div dir="rtl" className="w-full max-w-6xl m-5">
      <p className="mb-3 text-lg font-medium border-r-4 border-cyan-800 pr-3">
        كل المواعيد المحجوزة
      </p>

      <div className="bg-white border border-gray-300 rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll no-scrollbar shadow-sm">
        {/* رأس الجدول */}
        <div className="hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col py-3 px-6 border-b border-gray-300 bg-gray-50 text-gray-700 font-bold">
          <p>#</p>
          <p>المريض</p>
          <p>العمر</p>
          <p>التاريخ والوقت</p>
          <p>الطبيب</p>
          <p>السعر</p>
          <p>الإجراء</p>
        </div>

        {/* محتوى الجدول */}
        {appointments.map((item, index) => (
          <div
            key={index}
            className="flex flex-wrap justify-between sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-500 py-3 px-6 border-b border-gray-300 hover:bg-gray-50 transition-all">
            <p className="max-sm:hidden">{index + 1}</p>

            <div className="flex items-center gap-2">
              <img
                className="w-8 h-8 rounded-full bg-gray-200 object-cover"
                src={item.userData.image}
                alt=""
              />
              <p className="text-gray-800 font-medium">{item.userData.name}</p>
            </div>

            <p className="max-sm:hidden">
              {item.userData.dob
                ? new Date().getFullYear() -
                  new Date(item.userData.dob).getFullYear()
                : "25"}
            </p>

            <p>
              {slotDateFormat(item.slotDate)} | {item.slotTime}
            </p>

            <div className="flex items-center gap-2">
              <img
                className="w-8 h-8 rounded-full bg-gray-200 object-cover"
                src={item.docData.image}
                alt=""
              />
              <p className="text-gray-800 font-medium">{item.docData.name}</p>
            </div>

            <p className="font-bold text-gray-700">
              {item.amount}
              {currency}
            </p>

            <div className="flex justify-center">
              {item.cancelled ? (
                <p className="text-red-400 text-xs font-medium">ملغي</p>
              ) : item.isCompleted ? (
                <p className="text-green-500 text-xs font-medium">مكتمل</p>
              ) : (
                <img
                  onClick={() => cancelAppointment(item._id)} // أضفنا دالة الإلغاء هنا
                  className="w-10 cursor-pointer p-1 hover:bg-red-50 rounded-full transition-all"
                  src={assets.cancel_icon}
                  alt="إلغاء"
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllAppointments;
