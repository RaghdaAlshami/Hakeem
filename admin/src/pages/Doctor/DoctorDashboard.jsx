import React, { useContext, useEffect } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";
import {
  ResponsiveContainer,
  LineChart,
  Line,
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


  const chartData =
    dashData?.graphData
      ?.reduce((acc, curr) => {
        const date = curr.slotDate;
        const found = acc.find((item) => item.date === date);
        if (found) {
          found.patients += 1;
        } else {
          acc.push({ date: date, patients: 1 });
        }
        return acc;
      }, [])
      .sort((a, b) => {
        // الترتيب التصاعدي الطبيعي (14-2 قبل 15-2)
        const dateA = new Date(a.date.split("_").reverse().join("-"));
        const dateB = new Date(b.date.split("_").reverse().join("-"));
        return dateA - dateB;
      })
      .slice(-7) || []; // الآن سيأخذ آخر 7 أيام نشطة فعلياً من تاريخ العيادة
      
 

 
  useEffect(() => {
    if (dToken) {
      getDashData();
    }
  }, [dToken]);

  return (
    dashData && (
      <div className="m-5" dir="rtl">
        {/* قسم البطاقات الإحصائية */}
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-3 bg-white p-5 min-w-48 flex-1 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <img className="w-10" src={assets.earning_icon} alt="" />
            <div>
              <p className="text-lg font-bold text-gray-700">
                {dashData.earnings.toLocaleString()}{" "}
                <span className="text-xs font-normal">ل.س</span>
              </p>
              <p className="text-gray-400 text-sm">الأرباح</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white p-5 min-h-24 min-w-48 flex-1 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <img className="w-10" src={assets.appointments_icon} alt="" />
            <div>
              <p className="text-lg font-bold text-gray-700">
                {dashData.appointments}
              </p>
              <p className="text-gray-400 text-sm">المواعيد</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white p-5 min-w-48 flex-1 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <img className="w-10" src={assets.patients_icon} alt="" />
            <div>
              <p className="text-lg font-bold text-gray-700">
                {dashData.patients}
              </p>
              <p className="text-gray-400 text-sm">المرضى</p>
            </div>
          </div>
        </div>
        <div
          className="bg-white mt-8 p-6 rounded-xl border border-gray-100 shadow-sm overflow-hidden"
          dir="rtl">
          <div className="flex items-center gap-2 mb-6">
            <img className="w-5" src={assets.appointments_icon} alt="" />
            <p className="font-bold text-gray-700 text-lg font-cairo">
              نشاط المواعيد
            </p>
          </div>

          <div className="w-full min-h-[300px] flex items-center justify-center">
            {dashData && chartData && chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                {/* استخدام ارتفاع ثابت (300) داخل المكون بدلاً من 100% ينهي المشكلة تماماً */}
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
                    padding={{ left: 30, right: 30 }}
                    tick={{ fill: "#9ca3af", fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "10px",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      textAlign: "right",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="patients"
                    stroke="#5f6FFF"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorPatients)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-gray-400 font-cairo text-sm">
                جاري معالجة البيانات الإحصائية...
              </div>
            )}
          </div>
        </div>

        {/* قسم أحدث المواعيد */}
        <div className="bg-white mt-8 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center px-6 py-4 gap-2 bg-gray-50 border-b border-gray-100">
            <img className="w-5" src={assets.list_icon} alt="" />
            <p className="font-bold text-gray-700">أحدث المواعيد</p>
          </div>

          <div className="pt-2">
            {dashData.latestAppointments &&
            dashData.latestAppointments.length > 0 ? (
              dashData.latestAppointments.map((item, index) => (
                <div
                  className="flex items-center px-6 py-3 gap-4 hover:bg-gray-50 transition-all border-b border-gray-100 last:border-0"
                  key={index}>
                  <img
                    className="w-10 h-10 rounded-full object-cover bg-gray-100"
                    src={item.userData.image}
                    alt=""
                  />
                  <div className="flex-1">
                    <p
                      onClick={() => navigate(`/profile/${item.userId}`)}
                      className="text-gray-800 font-medium text-sm cursor-pointer hover:text-primary">
                      {item.userData.name}
                    </p>
                    <p className="text-gray-400 text-xs">{item.slotDate}</p>
                  </div>
                  {item.cancelled ? (
                    <p className="text-red-400 text-xs bg-red-50 px-2 py-1 rounded">
                      ملغي
                    </p>
                  ) : item.isCompleted ? (
                    <p className="text-green-500 text-xs bg-green-50 px-2 py-1 rounded">
                      مكتمل
                    </p>
                  ) : (
                    <div className="flex gap-2">
                      <img
                        onClick={() => cancelAppointment(item._id)}
                        className="w-7 cursor-pointer hover:scale-110"
                        src={assets.cancel_icon}
                        alt="إلغاء"
                      />
                      <img
                        onClick={() => completeAppointment(item._id)}
                        className="w-7 cursor-pointer hover:scale-110"
                        src={assets.tick_icon}
                        alt="إتمام"
                      />
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="p-6 text-center text-gray-400">
                لا توجد بيانات حالياً
              </p>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default DoctorDashboard;