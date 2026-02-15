import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { assets, specialityTranslation } from "../assets/assets"; // أضفنا specialityTranslation
import { toast } from "react-toastify";

const AiAssistant = () => {
  const [symptoms, setSymptoms] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleAnalyze = async () => {
    if (!symptoms.trim()) return toast.warning("يرجى وصف ما تشعر به أولاً");

    setLoading(true);
    setResult(null);
    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/user/ai-consultation",
        { symptoms },
      );

      if (data.success) {
        setResult(data);
        toast.success("تم تحليل الأعراض بنجاح");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("فشل الاتصال بالمساعد الذكي");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-['Cairo']" dir="rtl">
      {/* زر الأيقونة العائم */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-hakeem-dark p-4 rounded-full shadow-2xl hover:scale-110 transition-all active:scale-95 animate-bounce"
        title="مساعد حكيم الذكي">
        {isOpen ? (
          <span className="text-white text-2xl font-bold px-2">×</span>
        ) : (
          <img className="w-8 h-8" src={assets.chatbot_icon} alt="AI" />
        )}
      </button>

      {/* نافذة المساعد الذكي */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[350px] sm:w-[400px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-fadeIn">
          {/* رأس النافذة */}
          <div className="bg-teal-700 p-4 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <img className="w-6 h-6" src={assets.chatbot_icon} alt="" />
              <span className="font-bold text-sm">مساعد حكيم الذكي</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-300 transition-colors">
              <span className="text-xl">×</span>
            </button>
          </div>

          {/* محتوى الدردشة */}
          <div className="p-4 max-h-[70vh] overflow-y-auto bg-gray-50 text-right">
            {!result ? (
              <>
                <p className="text-sm text-gray-600 mb-3 font-medium">
                  مرحباً بك! صف لي ما تشعر به وسأوجهك للتخصص المناسب.
                </p>
                <textarea
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="مثال: أشعر بألم في المعدة منذ الصباح..."
                  className="w-full h-28 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-600 outline-none transition-all resize-none text-sm"
                />
                <button
                  onClick={handleAnalyze}
                  disabled={loading}
                  className="w-full mt-3 bg-teal-700 text-white py-2 rounded-xl font-bold hover:bg-opacity-90 transition-all disabled:bg-gray-400 text-sm shadow-md">
                  {loading ? "جاري التحليل..." : "تحليل الحالة الآن"}
                </button>
              </>
            ) : (
              <div className="animate-fadeIn">
                <div className="flex justify-between items-center mb-3 border-b pb-2">
                  <span className="text-teal-800 font-bold text-xs">
                    التشخيص المقترح:
                  </span>
                  <button
                    onClick={() => setResult(null)}
                    className="text-[10px] text-gray-500 hover:text-teal-700 font-bold">
                    إعادة التحليل
                  </button>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-100 mb-4 shadow-sm">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {result.analysis}
                  </p>
                </div>

                <div className="bg-gray-100 p-4 rounded-xl flex flex-col gap-3">
                  <div className="text-center">
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">
                      التخصص المطلوب
                    </p>
                    <p className="text-lg font-bold text-teal-800">
                      {/* عرض اسم التخصص بالعربي من القاموس */}
                      {specialityTranslation[result.suggestedSpeciality] || result.suggestedSpeciality}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      navigate(`/doctors/${result.suggestedSpeciality}`);
                      setIsOpen(false);
                    }}
                    className="bg-teal-700 text-white py-2 rounded-lg text-xs font-bold hover:shadow-lg transition-all">
                    عرض الأطباء المتاحين
                  </button>
                </div>
              </div>
            )}

            <p className="text-[9px] text-gray-400 mt-4 text-center leading-tight">
              ⚠️ تنبيه: تحليل ذكاء اصطناعي استرشادي فقط، لا يغني عن زيارة الطبيب.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiAssistant;