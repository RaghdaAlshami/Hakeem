import React, { useContext, useEffect, useMemo } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  AreaChart,
  Area,
} from "recharts";

const DoctorDashboard = () => {
  const navigate = useNavigate();

  const {
    dToken,
    dashData,
    getDashData,
    cancelAppointment,
    completeAppointment,
  } = useContext(DoctorContext);

  const chartData = useMemo(() => {
    if (!dashData?.graphData) return [];

    const data = dashData.graphData.reduce((acc, curr) => {
      const date = curr.slotDate;
      const found = acc.find((item) => item.date === date);
      if (found) {
        found.patients += 1;
      } else {
        acc.push({ date: date, patients: 1 });
      }
      return acc;
    }, []);

    return data
      .sort((a, b) => {
        const dateA = new Date(a.date.split("_").reverse().join("-"));
        const dateB = new Date(b.date.split("_").reverse().join("-"));
        return dateA - dateB;
      })
      .slice(-7);
  }, [dashData]);

  useEffect(() => {
    if (dToken) {
      getDashData();
    }
  }, [dToken]);

  return (
    dashData && (
      <div className="m-5 font-cairo" dir="rtl">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-3 bg-white p-4 min-w-48 flex-1 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-50">
            <img className="w-10" src={assets.earning_icon} alt="" />
            <div>
              <p className="text-xl font-bold text-gray-700">
                {dashData.earnings.toLocaleString()}{" "}
                <span className="text-xs font-normal text-gray-400">ل.س</span>
              </p>
              <p className="text-gray-400 text-sm">إجمالي الأرباح</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white p-4 min-w-48 flex-1 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-50">
            <img className="w-10" src={assets.appointments_icon} alt="" />
            <div>
              <p className="text-xl font-bold text-gray-700">
                {dashData.appointments}
              </p>
              <p className="text-gray-400 text-sm">إجمالي المواعيد</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white p-4 min-w-48 flex-1 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-50">
            <img className="w-10" src={assets.patients_icon} alt="" />
            <div>
              <p className="text-xl font-bold text-gray-700">
                {dashData.patients}
              </p>
              <p className="text-gray-400 text-sm">عدد المرضى</p>
            </div>
          </div>
        </div>

        <div className="bg-white mt-8 p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <img className="w-5" src={assets.appointments_icon} alt="" />
            <p className="font-bold text-gray-700 text-lg">
              نشاط المواعيد (آخر 7 أيام)
            </p>
          </div>
          <div className="w-full h-[300px]">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient
                      id="colorPatients"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1">
                      <stop offset="5%" stopColor="#5f6FFF" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#5f6FFF" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f5f5f5"
                  />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9ca3af", fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9ca3af", fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "10px",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      textAlign: "right",
                      direction: "rtl",
                    }}
                    formatter={(value) => [`${value} مريض`, "العدد"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="patients"
                    stroke="#5f6FFF"
                    strokeWidth={3}
                    fill="url(#colorPatients)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                لا توجد بيانات كافية
              </div>
            )}
          </div>
        </div>

        <div className="bg-white mt-8 rounded-xl border border-gray-100 shadow-sm overflow-hidden text-right">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
            <img className="w-5" src={assets.list_icon} alt="" />
            <p className="font-bold text-gray-700">أحدث المواعيد المسجلة</p>
          </div>

          <div className="min-h-[200px]">
            {dashData.latestAppointments &&
            dashData.latestAppointments.length > 0 ? (
              <>
                {dashData.latestAppointments.slice(0, 7).map((item, index) => (
                  <div
                    className="flex items-center px-6 py-4 gap-4 hover:bg-gray-50 transition-all border-b border-gray-100 last:border-0"
                    key={index}>
                    <img
                      className="w-12 h-12 rounded-full object-cover border-2 border-gray-50"
                      src={item.userData.image}
                      alt=""
                    />
                    <div className="flex-1">
                      <p
                        onClick={() => navigate(`/profile/${item.userId}`)}
                        className="text-gray-800 font-semibold text-base cursor-pointer hover:text-blue-600 transition-colors">
                        {item.userData.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-gray-400 text-xs">
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 bg-blue-400 rounded-full"></span>{" "}
                          {item.slotDate}
                        </span>
                        <span>|</span>
                        <span>{item.slotTime}</span>
                      </div>
                    </div>

                    <div className="flex items-center">
                      {item.cancelled ? (
                        <span className="text-red-500 text-xs bg-red-50 px-3 py-1 rounded-full font-medium border border-red-100">
                          ملغي
                        </span>
                      ) : item.isCompleted ? (
                        <span className="text-green-600 text-xs bg-green-50 px-3 py-1 rounded-full font-medium border border-green-100">
                          تمت الزيارة
                        </span>
                      ) : (
                        <div className="flex gap-3">
                          <button
                            onClick={() => cancelAppointment(item._id)}
                            className="p-2 bg-red-50 hover:bg-red-100 rounded-full transition-all group"
                            title="إلغاء الموعد">
                            <img
                              className="w-5 group-hover:scale-110 transition-transform"
                              src={assets.cancel_icon}
                              alt="إلغاء"
                            />
                          </button>
                          <button
                            onClick={() => completeAppointment(item._id)}
                            className="p-2 bg-green-50 hover:bg-green-100 rounded-full transition-all group"
                            title="تأكيد الإتمام">
                            <img
                              className="w-5 group-hover:scale-110 transition-transform"
                              src={assets.tick_icon}
                              alt="إتمام"
                            />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                <div className="p-4 bg-gray-50 text-center border-t border-gray-100">
                  <button
                    onClick={() => navigate("/doctor-appointments")}
                    className="text-blue-600 text-sm font-semibold hover:text-blue-800 transition-all">
                    عرض كافة المواعيد ({dashData.appointments}) ←
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                <p>لا توجد مواعيد حالياً</p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default DoctorDashboard;
