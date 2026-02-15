import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";
import { specialityTranslation } from "../../assets/assets";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const { aToken, getDashData, dashData, appointments, getAllAppointments } =
    useContext(AdminContext);

  const { slotDateFormat } = useContext(AppContext);

  useEffect(() => {
    if (aToken) {
      getDashData();
      getAllAppointments();
    }
  }, [aToken]);

  // معالجة البيانات الإحصائية (مرة واحدة فقط) مع دمج الترجمة العربية
  const specialityStats = appointments
    ? Object.values(
        appointments.reduce((acc, appointment) => {
          const englishSpec = appointment.docData?.speciality;
          // جلب الترجمة العربية أو استخدام النص الإنجليزي في حال عدم وجودها
          const arabicSpec =
            specialityTranslation[englishSpec] || englishSpec || "غير مصنف";

          if (!acc[arabicSpec]) {
            acc[arabicSpec] = { speciality: arabicSpec, count: 0 };
          }
          acc[arabicSpec].count += 1;
          return acc;
        }, {}),
      )
    : [];

  return (
    dashData && (
      <div dir="rtl" className="m-5 font-['Cairo']">
        {/* قسم البطاقات العلوية */}
        <div className="flex flex-wrap gap-5">
          <div className="flex items-center gap-4 bg-white p-6 min-w-72 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <img className="w-14" src={assets.doctor_icon} alt="" />
            <div>
              <p className="text-xl font-bold text-gray-700">
                {dashData.doctors}
              </p>
              <p className="text-gray-500">الأطباء</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white p-6 min-w-72 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <img className="w-14" src={assets.appointments_icon} alt="" />
            <div>
              <p className="text-xl font-bold text-gray-700">
                {dashData.appointments}
              </p>
              <p className="text-gray-500">المواعيد</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white p-6 min-w-72 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <img className="w-14" src={assets.patients_icon} alt="" />
            <div>
              <p className="text-xl font-bold text-gray-700">
                {dashData.patients}
              </p>
              <p className="text-gray-500">المرضى</p>
            </div>
          </div>
        </div>

        {/* مخطط إحصائيات التخصصات */}
        <div className="bg-white border border-gray-300 rounded-xl mt-8 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-8 border-b pb-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <img className="w-5" src={assets.appointments_icon} alt="" />
            </div>
            <div>
              <p className="font-bold text-lg text-gray-800">
                إحصاء المواعيد حسب الاختصاص
              </p>
             
            </div>
          </div>

          <div className="w-full min-h-[350px]">
            {specialityStats.length > 0 ? (
              <ResponsiveContainer width="100%" height={350}>
                <BarChart
                  data={specialityStats}
                  margin={{ top: 20, right: 30, left: 0, bottom: 40 }}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f0f0f0"
                  />
                  <XAxis
                    dataKey="speciality"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#4b5563", fontSize: 11, fontWeight: 600 }}
                    angle={-25}
                    textAnchor="end"
                    interval={0}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9ca3af", fontSize: 12 }}
                  />
                  <Tooltip
                    cursor={{ fill: "#f3f4f6", opacity: 0.4 }}
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                      textAlign: "right",
                    }}
                  />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]} barSize={40}>
                    {specialityStats.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={index % 2 === 0 ? "#5f6FFF" : "#8a94ff"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[350px] text-gray-400 italic">
                لا توجد بيانات مواعيد لعرض الإحصائيات...
              </div>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default Dashboard;
