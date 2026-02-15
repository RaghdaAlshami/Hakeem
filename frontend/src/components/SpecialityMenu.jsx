import React from 'react'
import { specialityData } from '../assets/assets'
import { Link } from 'react-router-dom'

const SpecialityMenu = () => {
  return (
    <div id="speciality" dir="rtl" className="flex flex-col items-center gap-4 py-16 px-4 md:px-8 lg:px-16">
      
      <h1 className="text-2xl md:text-3xl font-medium text-center text-hakeem-dark">
        البحث حسب التخصص
      </h1>
      <p className="sm:w-1/2 text-center text-gray-600 text-md mb-4">
        تصفح قائمة التخصصات لدينا بكل سـهولة، وابحث عن الطبيب المناسب لك.
      </p>

      <div className='flex flex-wrap justify-center gap-8 pt-5 w-full max-w-5xl'>
        {specialityData.map((item, index) => (
            <Link 
                to={`/doctors/${item.path}`} 
                key={index} 
                onClick={() => window.scrollTo(0,0)} 
                className="flex flex-col items-center text-xs cursor-pointer shrink-0 
                hover:-translate-y-2 transition-all duration-300 w-20 sm:w-24"
            >
                <img className="w-full mb-2" src={item.image} alt={item.speciality}/>
                <p className="text-center font-medium text-gray-700">{item.speciality}</p>
            </Link>
        ))}

        <Link 
            to={'/doctors'} 
            onClick={() => window.scrollTo(0,0)} 
            className="flex flex-col items-center justify-center text-xs cursor-pointer shrink-0 hover:-translate-y-2 transition-all duration-300 w-20 sm:w-24 group"
        >
            <div className="w-16 h-20 sm:w-20 sm:h-20 mb-2 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-hakeem-dark transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
                className="text-gray-500 group-hover:text-teal-300">
                    <rect x="3" y="3" width="7" height="7"></rect>
                    <rect x="14" y="3" width="7" height="7"></rect>
                    <rect x="14" y="14" width="7" height="7"></rect>
                    <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
            </div>
            <p className="text-center font-bold text-primary">كل التخصصات</p>
        </Link>
      </div>
    </div>
  )
}

export default SpecialityMenu