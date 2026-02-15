import React from 'react'
import { assets } from '../assets/assets'

const Contact = () => {
  return (
    <div dir='rtl' className='px-5 md:px-20'>
      
      {/* عنوان الصفحة */}
      <div className='text-center text-3xl pt-10 text-gray-800 font-bold'>
        <p>اتصل <span className='text-hakeem-dark'>بنا</span></p>
      </div>

      {/* محتوى التواصل */}
      <div className='my-10 flex flex-col justify-center md:flex-row gap-12 mb-28 text-sm text-right'>
        
        {/* صورة المكتب/التواصل */}
        <img className='w-full md:max-w-90 rounded-2xl shadow-md' src={assets.contact_image} alt="اتصل بنا" />

        {/* تفاصيل البيانات */}
        <div className='flex flex-col justify-center items-start gap-6'>
          
          <p className='font-bold text-lg text-gray-700'>مكتبنا الرئيسي</p>
          
          <div className='text-gray-500 leading-relaxed'>
            <p>سوريا، دمشق</p>
            <p>شارع المزة، برج الأطباء</p>
          </div>

          <div className='text-gray-500'>
            <p className='mb-1'><span className='font-semibold text-gray-700'>هاتف:</span> 011-22334455</p>
            <p><span className='font-semibold text-gray-700'>البريد الإلكتروني:</span> support@hakeem.com</p>
          </div>

        </div>

      </div>
    </div>
  )
}

export default Contact