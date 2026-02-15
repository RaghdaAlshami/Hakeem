import { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
  const [aToken, setAToken] = useState(
    localStorage.getItem("aToken") ? localStorage.getItem("aToken") : "",
  );

  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [dashData, setDashData] = useState(false);
  const [users, setUsers] = useState([]);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const getAllDoctors = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/admin/all-doctors", {
        headers: { aToken },
      });

      if (data.success) {
        setDoctors(data.doctors);
        console.log("Doctors loaded:", data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const changeAvailability = async (docId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/admin/change-availability",
        { docId },
        { headers: { aToken } },
      );

      if (data.success) {
        toast.success(data.message);

        getAllDoctors();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const getAllAppointments = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/admin/appointments", {
        headers: { aToken }, // إرسال توكن المسؤول للتحقق
      });

      if (data.success) {
        setAppointments(data.appointments); // تخزين المواعيد في الـ State
        console.log(data.appointments);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
  const cancelAppointment = async (appointmentId) => {

    const isConfirmed = window.confirm(
      "هل أنت متأكد من رغبتك في إلغاء هذا الموعد؟ سيتم إخطار الطبيب والمريض بالإلغاء.",
    );

    if (!isConfirmed) {
      return;
    }

    try {

      const { data } = await axios.post(
        backendUrl + "/api/admin/cancel-appointment",
        { appointmentId },
        { headers: { aToken } }, 
      );

      if (data.success) {

        toast.success(data.message);

   
        getAllAppointments();
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
      // إرسال طلب GET للحصول على الإحصائيات مع التوكن
      const { data } = await axios.get(backendUrl + "/api/admin/dashboard", {
        headers: { aToken },
      });

      if (data.success) {
        // تخزين البيانات في الـ State (تأكدي من تعريف [dashData, setDashData] في الأعلى)
        setDashData(data.dashData);
        console.log(data.dashData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const deleteDoctor = async (docId) => {
    // 1. إظهار نافذة التأكيد الخاصة بالويندوز
    const isConfirmed = window.confirm(
      "هل أنت متأكد تماماً من رغبتك في حذف هذا الطبيب؟ سيتم مسح كافة البيانات المتعلقة به نهائياً.",
    );

    // 2. إذا ضغط المستخدم على "إلغاء" (Cancel)، يتم إيقاف تنفيذ الدالة
    if (!isConfirmed) {
      return;
    }

    try {
      const { data } = await axios.post(
        backendUrl + "/api/admin/delete-doctor",
        { docId },
        { headers: { aToken } },
      );

      if (data.success) {
        toast.success(data.message);
        getAllDoctors(); // لتحديث القائمة فوراً بعد الحذف
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getAllUsers = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/admin/all-users", {
        headers: { aToken },
      });

      if (data.success) {
        setUsers(data.users);
        console.log("تم تحديث الحالة ببيانات:", data.users);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("خطأ في جلب البيانات:", error);
      toast.error(error.message);
    }
  };

  const deleteUser = async (userId) => {
    // 1. طلب التأكيد من المسؤول برسالة تحذيرية واضحة
    const isConfirmed = window.confirm(
      "تحذير: هل أنت متأكد من حذف هذا المستخدم نهائياً؟ ستفقد كافة بيانات الحساب ولا يمكن استعادتها مرة أخرى.",
    );

    // 2. إذا لم يتم التأكيد، توقف عن التنفيذ
    if (!isConfirmed) {
      return;
    }

    try {
      const { data } = await axios.post(
        backendUrl + "/api/admin/delete-user",
        { userId },
        { headers: { aToken } },
      );

      if (data.success) {
        toast.success(data.message);
        getAllUsers(); // تحديث قائمة المستخدمين فوراً
      } else {
        // إضافة التعامل مع حالة عدم النجاح (إذا أرجع السيرفر success: false)
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
  const value = {
    aToken,
    setAToken,
    backendUrl,
    doctors,
    getAllDoctors,
    changeAvailability,
    appointments,
    setAppointments,
    getAllAppointments,
    cancelAppointment,
    dashData,
    getDashData,
    deleteDoctor,
    getAllUsers,
    deleteUser,
    users,
    setUsers,
  };

  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;
