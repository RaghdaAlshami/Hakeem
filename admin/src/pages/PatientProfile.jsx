import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DoctorContext } from "../context/DoctorContext";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../assets/assets"; // تأكد من استيراد الأيقونات إذا لزم الأمر

const PatientProfile = () => {
  const { userId } = useParams();
  const { dToken, backendUrl } = useContext(DoctorContext);
  const [userData, setUserData] = useState(null);

  const fetchPatientData = async () => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/doctor/patient-profile",
        { userId },
        { headers: { dToken } },
      );
      if (data.success) {
        setUserData(data.userData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("فشل في جلب بيانات المريض");
    }
  };

  useEffect(() => {
    if (dToken) {
      fetchPatientData();
    }
  }, [dToken, userId]);

  return userData ? (
    <div className="m-3 font-['Cairo']" dir="rtl">
      <div className="flex items-center gap-2 mb-3">
        <p className="text-xl font-bold text-gray-700">ملف المريض الشامل</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* القسم العلوي: الصورة والمعلومات الأساسية */}
        <div className="bg-gradient-to-r from-primary/10 to-transparent p-6 border-b border-gray-50">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <img
              className="w-32 h-32 rounded-full border-4 border-white shadow-md object-cover bg-white"
              src={userData.image}
              alt={userData.name}
            />
            <div className="text-center sm:text-right">
              <h1 className="text-xl font-bold text-gray-800">
                {userData.name}
              </h1>
              <p className="text-gray-500 mt-1">{userData.email}</p>
            
            </div>
          </div>
        </div>

        {/* القسم السفلي: التفاصيل الحيوية */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* معلومات التواصل والبيانات الشخصية */}
          <div>
            <h3 className="text-lg font-semibold text-primary mb-2 border-b border-gray-200 pb-2">
              المعلومات الشخصية
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                <span className="text-gray-500">رقم الهاتف:</span>
                <span className="font-medium text-gray-700">
                  {userData.phone}
                </span>
              </div>
              <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                <span className="text-gray-500">الجنس:</span>
                <span className="font-medium text-gray-700">
                  {userData.gender}
                </span>
              </div>
              <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                <span className="text-gray-500">تاريخ الميلاد:</span>
                <span className="font-medium text-gray-700">
                  {userData.dob}
                </span>
              </div>
            </div>
          </div>

          {/* المعلومات الطبية والعنوان */}
          <div>
            <h3 className="text-lg font-semibold text-primary mb-2 border-b border-gray-200 pb-2">
              البيانات الطبية والسكن
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center bg-red-50 p-3 rounded-lg">
                <span className="text-red-600 font-medium">فصيلة الدم:</span>
                <span className="font-bold text-red-700">
                  {userData.bloodGroup}
                </span>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-500 mb-1">العنوان:</p>
                <p className="font-medium text-gray-700">
                  {userData.address.line1} {userData.address.line1 && "،"}{" "}
                  {userData.address.city}
                  {!userData.address.line1 &&
                    !userData.address.city &&
                    "غير محدد"}
                </p>
              </div>
              <div className="flex justify-between items-center bg-gray-50 p-2 rounded-lg">
                <span className="text-gray-500">تاريخ التسجيل:</span>
                <span className="font-medium text-gray-700">
                  {new Date(userData.createdAt).toLocaleDateString("ar-EG")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="flex justify-center items-center h-64">
      <p className="text-gray-500 animate-pulse">جاري تحميل ملف المريض...</p>
    </div>
  );
};

export default PatientProfile;
