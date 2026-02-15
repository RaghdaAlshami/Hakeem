import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";
import { assets } from "../../assets/assets";

const UsersList = () => {
  const { aToken, users, getAllUsers, deleteUser } = useContext(AdminContext);

  useEffect(() => {
    if (aToken) {
      getAllUsers();
    }
  }, [aToken]);

  const handleDelete = (id, name) => {
    if (window.confirm(`هل أنت متأكد من حذف حساب المستخدم ${name}؟`)) {
      deleteUser(id);
    }
  };

  // دالة بسيطة لتنسيق التاريخ
  const formatDate = (dateString) => {
    if (!dateString) return "غير متوفر";
    const date = new Date(dateString);
    return date.toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="m-5 font-['Cairo'] text-right" dir="rtl">
      <h1 className="text-xl font-bold text-gray-700 mb-6 border-r-4 border-primary pr-3">
      قائمة كافة المستخدمين ({users ? users.length : 0})
      </h1>

      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        {/* رأس الجدول - تم تعديل توزيع الأعمدة grid-cols */}
        <div className="hidden sm:grid grid-cols-[0.5fr_2fr_2fr_1.5fr_1.5fr_0.5fr] items-center py-4 px-6 bg-gray-100 border-b border-gray-100 font-semibold text-gray-600 text-sm">
          <p>#</p>
          <p>الاسم</p>
          <p>البريد الإلكتروني</p>
          <p>رقم الهاتف</p>
          <p>تاريخ التسجيل</p>
          <p className="text-center">الإجراء</p>
        </div>

        <div className="max-h-[70vh] overflow-y-auto">
          {users && users.length > 0 ? (
            users.map((item, index) => (
              <div
                key={item._id || index}
                className="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_2fr_1.5fr_1.5fr_0.5fr] items-center py-4 px-6 border-b border-gray-100 hover:bg-gray-50 transition-all text-sm text-gray-600">
                <p className="hidden sm:block">{index + 1}</p>

                <div className="flex items-center gap-3">
                  <img
                    className="w-10 h-10 rounded-full bg-slate-100 object-cover border border-gray-100"
                    src={item.image || assets.upload_area}
                    alt={item.name}
                  />
                  <p className="font-bold text-gray-800">{item.name}</p>
                </div>

                <p className="truncate ml-2">{item.email}</p>

                <p>{item.phone || "غير محدد"}</p>

                {/* عمود التاريخ الجديد */}
                <p className="text-xs text-gray-500">
                  {item.createdAt
                    ? formatDate(item.createdAt)
                    : formatDate(item.date)}
                </p>

                <div className="text-center">
                  <button
                    onClick={() => handleDelete(item._id, item.name)}
                    className="w-10 cursor-pointer p-1 hover:bg-red-50 rounded-full transition-all"
                    title="حذف المستخدم">
                    <img
                      className="w-8 cursor-pointer p-1"
                      src={assets.cancel_icon}
                      alt="حذف"
                    />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-10 text-center text-gray-400 italic">
              جاري تحميل بيانات المرضى...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UsersList;
