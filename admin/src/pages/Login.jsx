import React, { useContext, useState } from "react";
import axios from "axios";
import { AdminContext } from "../context/AdminContext";
import { toast } from "react-toastify";
import { DoctorContext } from "../context/DoctorContext";
import { assets } from "../../../frontend/src/assets/assets"; 

const Login = () => {
  const [state, setState] = useState("مدير النظام");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { setAToken, backendUrl } = useContext(AdminContext);
  const { setDToken } = useContext(DoctorContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (state === "مدير النظام") {
        const { data } = await axios.post(backendUrl + "/api/admin/login", {
          email,
          password,
        });
        if (data.success) {
          localStorage.setItem("aToken", data.token);
          setAToken(data.token);
          toast.success("مرحباً بك أيها المدير");
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(backendUrl + "/api/doctor/login", {
          email,
          password,
        });
        if (data.success) {
          localStorage.setItem("dToken", data.dToken);
          setDToken(data.dToken);
          toast.success("مرحباً بك دكتور، تم تسجيل الدخول");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("حدث خطأ في الاتصال بالسيرفر");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative px-4"
      style={{ backgroundImage: `url(${assets.bg_icon})` }} // استخدام نفس خلفية الفرونت
    >
  
      <div className="absolute inset-0 bg-teal-950/20 backdrop-blur-[2px]"></div>

      <form
        dir="rtl"
        onSubmit={onSubmitHandler}
        className="relative z-10 w-full max-w-[400px] font-['Cairo']">
      
        <div className="bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl rounded-[2.5rem] p-10 flex flex-col gap-6">
          <div className="text-center mb-1">
            <h2 className="text-3xl font-bold text-white tracking-tight">
              تسجيل دخول
            </h2>
            <p className="text-white font-medium mt-1 text-sm bg-white/20 py-1 px-4 rounded-full inline-block">
              {state}
            </p>
          </div>

          <div className="space-y-4">
            <div className="w-full">
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="w-full bg-white/10 border border-white/20 rounded-full p-3 text-white placeholder:text-white/50 focus:bg-white/20 transition-all outline-none text-right"
                type="email"
                placeholder="البريد الإلكتروني"
                required
              />
            </div>

            <div className="w-full">
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className="w-full bg-white/10 border border-white/20 rounded-full p-3 text-white placeholder:text-white/50 focus:bg-white/20 transition-all outline-none text-right"
                type="password"
                placeholder="كلمة المرور"
                required
              />
            </div>
          </div>

 
          <button
            type="submit"
            className="group relative overflow-hidden bg-white text-teal-900 w-full py-2.5 rounded-full text-lg font-bold mt-2 shadow-xl transition-all duration-500 hover:bg-teal-600 hover:text-white hover:scale-105 active:scale-95">
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>

            <span className="relative z-10">دخول للنظام</span>
          </button>

          <div className="text-center mt-2">
            {state === "مدير النظام" ? (
              <p className="text-white/70 text-sm">
                دخول الأطباء؟{" "}
                <span
                  className="text-white font-bold underline underline-offset-8 cursor-pointer hover:text-teal-200 transition-colors"
                  onClick={() => setState("طبيب")}>
                  اضغط هنا
                </span>
              </p>
            ) : (
              <p className="text-white/70 text-sm">
                دخول المدير؟{" "}
                <span
                  className="text-white font-bold underline underline-offset-8 cursor-pointer hover:text-teal-200 transition-colors"
                  onClick={() => setState("مدير النظام")}>
                  اضغط هنا
                </span>
              </p>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
