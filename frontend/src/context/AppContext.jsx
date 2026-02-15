import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL; // تصحيح الاسم
  const [doctors, setDoctors] = useState([]); // مصفوفة لتخزين الأطباء من السيرفر
  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : false,
  );
  const [userData, setUserData] = useState(false);

  // دالة جلب بيانات الأطباء للجمهور (بدون توكن أدمن)
  const getDoctorsData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/doctor/list");

      if (data.success) {
        setDoctors(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

const loadUserProfileData = async () => {
  try {
    const { data } = await axios.get(backendUrl + "/api/user/get-profile", {
      headers: { token },
    });

    if (data.success) {
      setUserData(data.userData);
    } else {
      // إذا كان التوكن موجوداً ولكن المستخدم حُذف من القاعدة
      if (data.message === "المستخدم غير موجود") {
        setToken(false);
        localStorage.removeItem("token");
        // لا تظهر Toast هنا إذا كنت لا تريد إزعاج المستخدم عند كل تحديث
      } else {
        toast.error(data.message);
      }
    }
  } catch (error) {
    console.log(error);
    toast.error(error.message);
  }
};

  
  // استدعاء الدالة بمجرد تشغيل التطبيق
  useEffect(() => {
    getDoctorsData();
  }, []);

  useEffect(() => {
    if (token) {
      loadUserProfileData();
    } else {
      setUserData(false);
    }
  }, [token]); // ستعمل الدالة في كل مرة تتغير فيها قيمة التوكن
  const value = {
    doctors,
    getDoctorsData, // لتحديث البيانات يدوياً إذا لزم الأمر
    backendUrl,
    token,
    setToken,
    userData,
    setUserData,
    loadUserProfileData,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
