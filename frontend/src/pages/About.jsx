import React from "react";
import { assets } from "../assets/assets";

const About = () => {
  return (
    <div dir="rtl" className="px-6 md:px-20 py-16 bg-white">
      {/* العنوان الرئيسي بتصميم عصري */}
      <div className="text-center mb-16">
        <h1 className="text-2xl md:text-4xl font-bold text-gray-800 leading-tight">
          قصة{" "}
          <span className="text-cyan-800 ">
            حكيم
          </span>
        </h1>
       
      </div>

      {/* قسم من نحن: تصميم متداخل */}
      <div className="flex flex-col lg:flex-row gap-16 items-center mb-28">
        {/* الصورة مع خلفية زخرفية */}
        <div className="relative w-full lg:w-1/2">
          <div className="absolute -top-4 -right-4 w-full h-full bg-primary/10 rounded-2xl -z-10"></div>
          <img
            className="w-full rounded-2xl shadow-2xl transition-transform duration-500 hover:scale-[1.02]"
            src={assets.about_image}
            alt="حول حكيم"
          />
        </div>

        {/* النص التعريفي */}
        <div className="w-full lg:w-1/2 space-y-8">
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800">
              شريككم الموثوق في سوريا
            </h2>
            <p className="text-gray-600  leading-relaxed text-justify">
              مرحباً بكم في <strong className="text-cyan-700">حكيم</strong>. نحن
              لم نبتكر مجرد منصة حجز، بل صممنا جسراً رقمياً يربط بين كفاءة
              الطبيب واحتياج المريض. في ظل التحديات الحالية، نسعى لتسخير الذكاء
              البرمجي لتنظيم القطاع الطبي وتوفير عناء الانتظار.
            </p>
          </div>

          <div className="p-6 bg-primary/5 border-r-4 border-cyan-600 rounded-xl">
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              رؤيتنا المستقبيلة
            </h3>
            <p className="text-gray-600 leading-relaxed">
              أن تصبح "حكيم" الهوية الرقمية الصحية الأولى في سوريا، حيث لا يضطر
              مريض لقطع مسافات طويلة أو الانتظار لساعات، بل يحصل على حقه في
              الرعاية بكرامة وسهولة.
            </p>
          </div>
        </div>
      </div>

      {/* قسم المميزات: بطاقات منفصلة بظلال ناعمة */}
      <div className="space-y-12">
        

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* ميزة الكفاءة */}
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
         
            <h4 className="text-xl font-semibold text-gray-800 mb-3">
              الكفاءة الرقمية
            </h4>
            <p className="text-gray-600 leading-relaxed">
              نحن نختصر وقت الحجز من أيام إلى ثوانٍ معدودة، مع نظام إدارة مواعيد
              دقيق يتناسب مع ضغط العمل الطبي.
            </p>
          </div>

          {/* ميزة الراحة */}
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
         
            <h4 className="text-xl font-semibold text-gray-800 mb-3">
              سهولة الوصول
            </h4>
            <p className="text-gray-600 leading-relaxed">
              ابحث عن طبيبك المفضل حسب التخصص أو المنطقة، وتعرف على توافر
              مواعيده الحقيقية في أي وقت ومن أي مكان.
            </p>
          </div>

          {/* ميزة التخصيص */}
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
            
            <h4 className="text-xl font-semibold text-gray-800 mb-3">
              تجربة مخصصة
            </h4>
            <p className="text-gray-600 leading-relaxed">
              نقدم لك تنبيهات ذكية وتذكيرات مستمرة لضمان عدم فوات موعدك، مع ملف
              شخصي يحفظ تاريخ حجوزاتك بدقة.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
