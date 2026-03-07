import React, { useContext, useEffect, useState, useMemo } from "react";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";

const AllAppointments = () => {
  const { aToken, appointments, getAllAppointments, cancelAppointment } =
    useContext(AdminContext);
  const { slotDateFormat, currency } = useContext(AppContext);

  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCount, setVisibleCount] = useState(10);

  useEffect(() => {
    if (aToken) {
      getAllAppointments();
    }
  }, [aToken]);

  const filteredAppointments = useMemo(() => {
    if (!appointments) return [];

    return appointments
      .filter((item) => {
        const searchLower = searchTerm.toLowerCase();
        const patientName = item.userData.name.toLowerCase();
        const doctorName = item.docData.name.toLowerCase();

        return (
          patientName.includes(searchLower) || doctorName.includes(searchLower)
        );
      })
      .sort((a, b) => {
        const dateA = new Date(a.slotDate.split("_").reverse().join("-"));
        const dateB = new Date(b.slotDate.split("_").reverse().join("-"));
        return dateB - dateA;
      });
  }, [appointments, searchTerm]);

  useEffect(() => {
    setVisibleCount(10);
  }, [searchTerm]);

  return (
    <div dir="rtl" className="w-full max-w-6xl m-5 font-cairo">
      <div className="flex flex-col md:flex-row justify-between items-end mb-5 gap-4">
        <div>
          <p className="text-lg font-medium border-r-4 border-cyan-800 pr-3 text-gray-800">
            كل المواعيد المحجوزة
          </p>
          <p className="text-sm text-gray-500 mt-1 pr-3">
            عدد المواعيد :{" "}
            <span className="font-bold text-cyan-800">
              {filteredAppointments.length}
            </span>
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="ابحث عن اسم مريض أو طبيب..."
            className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-600 text-sm transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <img
            className="w-4 absolute right-3 top-3 opacity-50"
            src={assets.search_icon}
            alt="بحث"
          />
        </div>
      </div>

      <div className="bg-white border border-gray-300 rounded-lg shadow-sm">
        <div className="hidden sm:grid grid-cols-[0.5fr_3fr_3fr_3fr_1.5fr_1fr] py-4 px-6 border-b border-gray-300 bg-gray-50 text-gray-700 font-bold">
          <p>#</p>
          <p>المريض</p>
          <p>التاريخ والوقت</p>
          <p>الطبيب</p>
          <p>سعر الكشف</p>
          <p className="text-center">الإجراء</p>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredAppointments.length > 0 ? (
            filteredAppointments.slice(0, visibleCount).map((item, index) => (
              <div
                key={index}
                className="flex flex-wrap justify-between sm:grid grid-cols-[0.5fr_3fr_3fr_3fr_1.5fr_1fr] items-center text-gray-600 py-4 px-6 hover:bg-gray-50 transition-colors">
                <p className="max-sm:hidden font-small text-gray-400">
                  {index + 1}
                </p>

                <div className="flex items-center gap-3">
                  <img
                    className="w-9 h-9 rounded-full bg-gray-100 object-cover border border-gray-200"
                    src={item.userData.image}
                    alt=""
                  />
                  <p className="text-gray-900 font-semibold">
                    {item.userData.name}
                  </p>
                </div>

                <p className="font-medium">
                  {slotDateFormat(item.slotDate)} |{" "}
                  <span className="text-cyan-700">{item.slotTime}</span>
                </p>

                <div className="flex items-center gap-3">
                  <img
                    className="w-9 h-9 rounded-full bg-gray-100 object-cover border border-gray-200"
                    src={item.docData.image}
                    alt=""
                  />
                  <p className="text-gray-900 font-medium">
                    {item.docData.name}
                  </p>
                </div>

                <p className="font-semibold text-gray-800">
                  {item.amount} {currency}
                </p>

                <div className="flex justify-center">
                  {item.cancelled ? (
                    <span className="text-red-500 text-xs font-bold border border-red-100 bg-red-50 px-3 py-1 rounded-full">
                      ملغي
                    </span>
                  ) : item.isCompleted ? (
                    <span className="text-green-600 text-xs font-bold border border-green-100 bg-green-50 px-3 py-1 rounded-full">
                      مكتمل
                    </span>
                  ) : (
                    <button
                      onClick={() => cancelAppointment(item._id)}
                      className="p-1 hover:bg-red-50 rounded-full transition-all group"
                      title="إلغاء الموعد">
                      <img
                        className="w-9 opacity-80 group-hover:opacity-100"
                        src={assets.cancel_icon}
                        alt="إلغاء"
                      />
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="py-24 text-center text-gray-400 flex flex-col items-center">
              <img
                src={assets.list_icon}
                className="w-12 opacity-10 mb-2"
                alt=""
              />
              <p>لا توجد مواعيد تطابق بحثك حالياً</p>
            </div>
          )}
        </div>

        {visibleCount < filteredAppointments.length && (
          <div className="p-6 bg-white text-center border-t border-gray-200">
            <button
              onClick={() => setVisibleCount((prev) => prev + 10)}
              className="bg-white border border-cyan-800 text-cyan-800 px-10 py-2.5 rounded-full text-sm font-bold hover:bg-cyan-800 hover:text-white transition-all shadow-sm active:scale-95">
              تحميل المزيد
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllAppointments;
