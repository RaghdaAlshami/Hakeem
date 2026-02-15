import { useState, createContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const DoctorContext = createContext();

const DoctorContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [dToken, setDToken] = useState(
    localStorage.getItem("dToken") ? localStorage.getItem("dToken") : "",
  );

  const [appointments, setAppointments] = useState([]);
  const [dashData, setDashData] = useState(false);
  const [profileData, setProfileData] = useState(false);
  const [userData, setUserData] = useState(false);


  const getAppointments = async () => {
    try {
      // 1. إرسال طلب GET مع تمرير التوكن في الـ Headers
      // ملاحظة: نستخدم dToken (بحرف صغير أو كبير حسب ما عرفتيه في الـ Middleware)
      const { data } = await axios.get(
        backendUrl + "/api/doctor/appointments",
        {
          headers: { dToken },
        },
      );

      if (data.success) {
        // 2. تخزين المواعيد في الـ State (تأكدي من تعريف [appointments, setAppointments])
        setAppointments(data.appointments); // تخزين المواعيد في الـ State
        console.log(data.appointments);
      } else {
        // 3. عرض رسالة خطأ إذا لم تنجح العملية
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const completeAppointment = async (appointmentId) => {
    try {
      // 1. إرسال طلب GET مع تمرير التوكن في الـ Headers
      // ملاحظة: نستخدم dToken (بحرف صغير أو كبير حسب ما عرفتيه في الـ Middleware)
      const { data } = await axios.post(
        backendUrl + "/api/doctor/complete-appointment",
        { appointmentId },
        {
          headers: { dToken },
        },
      );

      if (data.success) {
        toast.success(data.message);
        getAppointments();
      } else {
        // 3. عرض رسالة خطأ إذا لم تنجح العملية
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

const cancelAppointment = async (appointmentId) => {

    const isConfirmed = window.confirm("هل أنت متأكد من رغبتك في إلغاء هذا الموعد؟ لا يمكن التراجع عن هذه الخطوة.");

    if (!isConfirmed) {
      return; 
    }

    try {
      const { data } = await axios.post(
        backendUrl + "/api/doctor/cancel-appointment",
        { appointmentId },
        {
          headers: { dToken },
        },
      );

      if (data.success) {
        toast.success(data.message);
        getAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const getDashData = async () => {
    try {
      
      const { data } = await axios.get(backendUrl + "/api/doctor/dashboard", {
        headers: { dToken },
      });

      if (data.success) {
        setDashData(data.dashData);
        console.log("Dashboard Data:", data.dashData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const getProfileData = async () => {
    try {
    
      const { data } = await axios.get(backendUrl + "/api/doctor/profile", {
        headers: { dToken },
      });

      if (data.success) {
        setProfileData(data.docData);
        console.log("Doctor Profile Data:", data.docData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };


  const getUserData = async (userId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/doctor/user-profile",
        { userId },
        { headers: { dToken } },
      );

      if (data.success) {
        setUserData(data.userData);
        return data.userData;
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  const value = {
    dToken,
    setDToken,
    backendUrl,
    appointments,
    setAppointments,
    getAppointments,
    completeAppointment,
    cancelAppointment,
    dashData,
    getDashData,
    profileData,
    setProfileData,
    getProfileData,
    userData,
    setUserData,
    getUserData}

  return (
    <DoctorContext.Provider value={value}>
      {props.children}
    </DoctorContext.Provider>
  );
};

export default DoctorContextProvider;
