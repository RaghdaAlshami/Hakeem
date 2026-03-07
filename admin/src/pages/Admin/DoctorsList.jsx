import React, { useContext, useEffect, useState, useMemo } from "react";
import { AdminContext } from "../../context/AdminContext";
import { assets } from "../../assets/assets";
import { specialityTranslation } from "../../assets/assets";

const DoctorsList = () => {
  const { doctors, getAllDoctors, aToken, changeAvailability, deleteDoctor } =
    useContext(AdminContext);


  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (aToken) {
      getAllDoctors();
    }
  }, [aToken]);

  const filteredDoctors = useMemo(() => {
    if (!doctors) return [];

    return doctors.filter((doc) => {
      const searchLower = searchTerm.toLowerCase();
      const nameMatch = doc.name.toLowerCase().includes(searchLower);
      const specialityMatch = (
        specialityTranslation[doc.speciality] || doc.speciality
      )
        .toLowerCase()
        .includes(searchLower);
      const cityMatch = doc.address?.city?.toLowerCase().includes(searchLower);

      return nameMatch || specialityMatch || cityMatch;
    });
  }, [doctors, searchTerm]);

  const handleDelete = (id, name) => {
    if (window.confirm(`هل أنت متأكد من حذف الطبيب ${name} نهائياً؟`)) {
      deleteDoctor(id);
    }
  };

  return (
    <div
      className='m-5 max-h-[90vh] overflow-y-scroll font-["Cairo"] text-right no-scrollbar'
      dir="rtl">

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-xl font-bold text-gray-700">قائمة الأطباء</h1>
          <p className="text-sm text-gray-500">
            إجمالي الأطباء:{" "}
            <span className="text-cyan-700 font-bold">
              {filteredDoctors.length}
            </span>{" "}
            من أصل {doctors.length}
          </p>
        </div>

     
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="ابحث عن اسم طبيب، تخصص، أو مدينة..."
            className="w-full pr-10 pl-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-transparent text-sm transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <img
            className="w-4 absolute right-3 top-3.5 opacity-40"
            src={assets.search_icon}
            alt="بحث"
          />
        </div>
      </div>

     
      <div className="w-full flex flex-wrap gap-6 pt-2">
        {filteredDoctors.length > 0 ? (
          filteredDoctors.map((item, index) => (
            <div
              key={index}
              className="relative border-none bg-white shadow-md rounded-xl w-full sm:max-w-56 overflow-hidden cursor-pointer group hover:scale-105 transition-all duration-300">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(item._id, item.name);
                }}
                className="absolute top-2 right-2 z-10 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-700 shadow-lg"
                title="حذف الطبيب">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-4 h-4">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-3.675A2.25 2.25 0 0013.812 1.5h-3.624a2.25 2.25 0 00-2.25 2.25v.323m7.5 0a48.114 48.114 0 00-7.5 0"
                  />
                </svg>
              </button>

              <img
                className="bg-blue-50 group-hover:bg-cyan-700 transition-all duration-500 w-full h-48 object-cover object-top block"
                src={item.image || assets.upload_area}
                alt={item.name}
                onError={(e) => {
                  e.target.src = assets.upload_area;
                }}
              />

              <div className="p-4">
                <p className="text-neutral-800 text-lg font-bold truncate">
                  {item.name}
                </p>

                <p className="text-zinc-600 text-sm mb-2">
                  {specialityTranslation[item.speciality] || item.speciality}
                </p>

                <div className="flex items-center gap-2 text-sm mt-3">
                  <input
                    type="checkbox"
                    checked={item.available}
                    onChange={() => changeAvailability(item._id)}
                    className="accent-green-500 w-4 h-4 cursor-pointer"
                  />
                  <p
                    className={`${item.available ? "text-green-600" : "text-gray-400"} font-medium`}>
                    {item.available ? "متاح الآن" : "غير متاح"}
                  </p>
                </div>

                <div className="mt-2 text-xs text-gray-500 border-t pt-2 border-gray-50">
                  <p className="truncate">
                    {item.address.city} - {item.address.line1}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="w-full py-20 text-center text-gray-400">
            لا يوجد أطباء مطابقين لعملية البحث...
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorsList;
