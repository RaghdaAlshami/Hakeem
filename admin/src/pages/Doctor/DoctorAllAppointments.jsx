import React, { useContext, useEffect, useState, useMemo } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";

const DoctorAllAppointments = () => {
  const {
    dToken,
    appointments,
    getAppointments,
    cancelAppointment,
    completeAppointment,
  } = useContext(DoctorContext);

  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [visibleCount, setVisibleCount] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    if (dToken) {
      getAppointments();
    }
  }, [dToken]);

  const filteredData = useMemo(() => {
    if (!appointments) return [];

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    return appointments
      .filter((item) => {
        const matchesSearch = item.userData.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

        const appDate = new Date(item.slotDate.split("_").reverse().join("-"));
        let matchesStatus = true;

        if (filter === "upcoming") {
          matchesStatus =
            appDate >= now && !item.cancelled && !item.isCompleted;
        } else if (filter === "past") {
          matchesStatus = appDate < now || item.cancelled || item.isCompleted;
        }

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        const dateA = new Date(a.slotDate.split("_").reverse().join("-"));
        const dateB = new Date(b.slotDate.split("_").reverse().join("-"));

        if (dateB - dateA === 0) {
          return b.slotTime.localeCompare(a.slotTime);
        }

        return dateB - dateA;
      });
  }, [appointments, searchTerm, filter]);

  useEffect(() => {
    setVisibleCount(10);
  }, [filter, searchTerm]);

  return (
    <div className="m-5 font-cairo" dir="rtl">
      <h1 className="text-xl font-bold text-gray-700 mb-5">
        سجل كافة المواعيد
      </h1>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-100 flex flex-col lg:flex-row justify-between items-center gap-4">
          <div className="flex bg-gray-200 p-1 rounded-lg w-full lg:w-auto">
            <button
              onClick={() => setFilter("all")}
              className={`flex-1 px-4 py-1.5 text-xs font-medium rounded-md transition-all ${filter === "all" ? "bg-white text-teal-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
              الكل
            </button>
            <button
              onClick={() => setFilter("upcoming")}
              className={`flex-1 px-4 py-1.5 text-xs font-medium rounded-md transition-all ${filter === "upcoming" ? "bg-white text-teal-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
              القادمة
            </button>
            <button
              onClick={() => setFilter("past")}
              className={`flex-1 px-4 py-1.5 text-xs font-medium rounded-md transition-all ${filter === "past" ? "bg-white text-teal-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
              السابقة
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="ابحث عن اسم المريض..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-teal-500 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <img
                className="w-4 absolute left-3 top-3 opacity-40"
                src={assets.search_icon}
                alt=""
              />
            </div>

            <p className="text-gray-500 text-sm whitespace-nowrap">
              النتائج: {filteredData.length}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-gray-50 text-gray-600 font-bold border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">#</th>
                <th className="px-6 py-4">المريض</th>
                <th className="px-6 py-4">التاريخ والوقت</th>
                <th className="px-6 py-4">الحالة</th>
                <th className="px-6 py-4 text-center">الإجراء</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.slice(0, visibleCount).map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-gray-400">{index + 1}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        className="w-8 h-8 rounded-full object-cover border"
                        src={item.userData.image}
                        alt=""
                      />
                      <p
                        onClick={() => navigate(`/profile/${item.userId}`)}
                        className="text-gray-800 font-bold text-sm cursor-pointer hover:text-teal-600 transition-colors">
                        {item.userData.name}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {item.slotDate} |{" "}
                    <span className="text-teal-500 font-medium">
                      {item.slotTime}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {item.cancelled ? (
                      <span className="text-red-500 bg-red-50 px-2 py-1 rounded text-[10px] font-bold border border-red-100">
                        ملغي
                      </span>
                    ) : item.isCompleted ? (
                      <span className="text-green-600 bg-green-50 px-2 py-1 rounded text-[10px] font-bold border border-green-100">
                        مكتمل
                      </span>
                    ) : (
                      <span className="text-blue-600 bg-blue-50 px-2 py-1 rounded text-[10px] font-bold border border-blue-100">
                        قيد الانتظار
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {!item.cancelled && !item.isCompleted && (
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => completeAppointment(item._id)}
                          title="إتمام"
                          className="p-1.5 hover:bg-green-100 rounded-full transition-all group">
                          <img
                            className="w-5 group-hover:scale-110"
                            src={assets.tick_icon}
                            alt=""
                          />
                        </button>
                        <button
                          onClick={() => cancelAppointment(item._id)}
                          title="إلغاء"
                          className="p-1.5 hover:bg-red-100 rounded-full transition-all group">
                          <img
                            className="w-5 group-hover:scale-110"
                            src={assets.cancel_icon}
                            alt=""
                          />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {visibleCount < filteredData.length ? (
          <div className="p-6 flex justify-center bg-gray-50 border-t border-gray-100">
            <button
              onClick={() => setVisibleCount((prev) => prev + 10)}
              className="px-10 py-2 bg-white border border-teal-600 text-teal-600 rounded-full hover:bg-teal-600 hover:text-white transition-all shadow-sm font-medium">
              تحميل المزيد
            </button>
          </div>
        ) : (
          filteredData.length > 0 && (
            <p className="text-center py-4 text-gray-400 text-xs">
              نهاية السجل
            </p>
          )
        )}

        {filteredData.length === 0 && (
          <div className="py-20 text-center text-gray-400">
            <img
              className="w-16 mx-auto mb-4 opacity-20"
              src={assets.list_icon}
              alt=""
            />
            <p>لا توجد مواعيد </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorAllAppointments;
