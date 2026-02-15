import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { assets } from "../assets/assets";

const Login = () => {
  const [state, setState] = useState("Login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const navigate = useNavigate();
  const { backendUrl, token, setToken } = useContext(AppContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (state === "Login") {
        const { data } = await axios.post(backendUrl + "/api/user/login", {
          password,
          email,
        });
        if (data.success) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
          toast.success("أهلاً بك مجدداً");
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(backendUrl + "/api/user/register", {
          name,
          password,
          email,
        });
        if (data.success) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
          toast.success("تم إنشاء حسابك بنجاح");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error("حدث خطأ في الاتصال");
    }
  };

  useEffect(() => {
    if (token) navigate("/");
  }, [token]);

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative px-4 py-8"
      style={{ backgroundImage: `url(${assets.bg_icon})` }}>
      <div className="absolute inset-0 bg-teal-950/20 backdrop-blur-[2px]"></div>

      <form
        dir="rtl"
        onSubmit={onSubmitHandler}
        className="relative z-10 w-full max-w-[400px]">
        <div className="bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl rounded-[2.5rem] p-10 flex flex-col gap-6">
          <div className="text-center mb-1">
            <h2 className="text-3xl font-bold text-white tracking-tight">
              {state === "Sign Up" ? "إنشاء حساب" : "تسجيل الدخول"}
            </h2>
            <p className="text-white/70 mt-1 text-sm">
              {state === "Sign Up"
                ? "انضم إلى عائلتنا الطبية"
                : "مرحباً بك في حكيم"}
            </p>
          </div>

          <div className="space-y-4 transition-all duration-500 ease-in-out">
            {state === "Sign Up" && (
              <input
                className="w-full bg-white/10 border border-white/20 rounded-full p-3 text-white placeholder:text-white/50 focus:bg-white/20 transition-all outline-none"
                type="text"
                onChange={(e) => setName(e.target.value)}
                value={name}
                placeholder="الاسم الكامل"
                required
              />
            )}
            <input
              className="w-full bg-white/10 border border-white/20 rounded-full p-3 text-white placeholder:text-white/50 focus:bg-white/20 transition-all outline-none"
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              placeholder="البريد الإلكتروني"
              required
            />
            <input
              className="w-full bg-white/10 border border-white/20 rounded-full p-3 text-white placeholder:text-white/50 focus:bg-white/20 transition-all outline-none"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              placeholder="كلمة المرور"
              required
            />
          </div>

          <button
            type="submit"
            className="group relative overflow-hidden bg-white text-teal-900 w-full py-3 rounded-full text-lg font-bold mt-2 shadow-xl transition-all duration-500 hover:bg-teal-600 hover:text-white hover:scale-105 active:scale-95">
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>

            <span className="relative z-10">
              {state === "Sign Up" ? "إنشاء الحساب" : "دخول"}
            </span>
          </button>

          <div className="flex items-center gap-3">
            <div className="h-[1px] flex-1 bg-white/20"></div>
            <span className="text-[10px] text-white/40 font-bold tracking-widest uppercase">
              أو عبر
            </span>
            <div className="h-[1px] flex-1 bg-white/20"></div>
          </div>

          <div className="flex justify-center group transition-all duration-500 hover:scale-[1.02]">
            <div className="w-full rounded-full overflow-hidden border border-white/30 bg-white/10 backdrop-blur-sm shadow-xl flex justify-center items-center">
              <GoogleLogin
                onSuccess={async (res) => {
                  const { data } = await axios.post(
                    backendUrl + "/api/user/google-auth",
                    { token: res.credential },
                  );
                  if (data.success) {
                    localStorage.setItem("token", data.token);
                    setToken(data.token);
                  }
                }}
                theme="outline" // "outline" يعطي شفافية وأناقة أكثر من الأزرق
                shape="pill"
                size="large"
                width="360" // جعل العرض ممتداً ليملأ الحاوية الدائرية
                logo_alignment="center"
              />
            </div>
          </div>

          <div className="text-center mt-2">
            <p className="text-white/60 text-sm">
              {state === "Sign Up" ? "تملك حساباً بالفعل؟" : "ليس لديك حساب؟"}{" "}
              <span
                onClick={() =>
                  setState(state === "Sign Up" ? "Login" : "Sign Up")
                }
                className="text-white font-bold cursor-pointer hover:underline underline-offset-8 transition-all">
                {state === "Sign Up" ? "سجل دخولك" : "أنشئ حساباً"}
              </span>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
