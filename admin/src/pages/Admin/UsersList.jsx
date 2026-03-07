import React, { useContext, useEffect, useState, useMemo } from "react";
import { AdminContext } from "../../context/AdminContext";
import { assets } from "../../assets/assets";

const UsersList = () => {
  const { aToken, users, getAllUsers, deleteUser } = useContext(AdminContext);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (aToken) {
      getAllUsers();
    }
  }, [aToken]);

  const filteredUsers = useMemo(() => {
    if (!users) return [];
    return users.filter((user) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        user.name?.toLowerCase().includes(searchLower) ||
        user.email?.toLowerCase().includes(searchLower) ||
        user.phone?.includes(searchTerm)
      );
    });
  }, [users, searchTerm]);

  const handleDelete = (id, name) => {
    if (window.confirm(`هل أنت متأكد من حذف حساب المستخدم ${name}؟`)) {
      deleteUser(id);
    }
  };

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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-xl font-bold text-gray-700 border-r-4 border-primary pr-3">
          قائمة كافة المستخدمين ({filteredUsers.length})
        </h1>

        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="ابحث بالاسم، البريد، أو الهاتف..."
            className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <img
            className="w-4 absolute right-3 top-3 opacity-40"
            src={assets.search_icon}
            alt="بحث"
          />
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        <div className="hidden sm:grid grid-cols-[0.5fr_2fr_2fr_1.5fr_1.5fr_0.5fr] items-center py-4 px-6 bg-gray-50 border-b border-gray-100 font-semibold text-gray-600 text-sm">
          <p>#</p>
          <p>الاسم</p>
          <p>البريد الإلكتروني</p>
          <p>رقم الهاتف</p>
          <p>تاريخ التسجيل</p>
          <p className="text-center">الإجراء</p>
        </div>

        <div className="max-h-[70vh] overflow-y-auto no-scrollbar">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((item, index) => (
              <div
                key={item._id || index}
                className="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_2fr_1.5fr_1.5fr_0.5fr] items-center py-4 px-6 border-b border-gray-100 hover:bg-gray-50 transition-all text-sm text-gray-600">
                <p className="hidden sm:block font-medium text-gray-400">
                  {index + 1}
                </p>

                <div className="flex items-center gap-3">
                  <img
                    className="w-10 h-10 rounded-full bg-slate-100 object-cover border border-gray-100"
                    src={item.image || assets.upload_area}
                    alt={item.name}
                  />
                  <p className="font-bold text-gray-800">{item.name}</p>
                </div>

                <p className="truncate ml-2 text-gray-500 font-english">
                  {item.email}
                </p>

                <p className="font-medium text-gray-700">{item.phone || "—"}</p>

                <p className="text-xs text-gray-400">
                  {item.createdAt
                    ? formatDate(item.createdAt)
                    : formatDate(item.date)}
                </p>

                <div className="text-center">
                  <button
                    onClick={() => handleDelete(item._id, item.name)}
                    className="inline-block cursor-pointer p-2 hover:bg-red-50 rounded-full transition-all group"
                    title="حذف المستخدم">
                    <img
                      className="w-6 opacity-70 group-hover:opacity-100"
                      src={assets.cancel_icon}
                      alt="حذف"
                    />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-20 text-center text-gray-400">
              {users ? "لا توجد نتائج تطابق بحثك..." : "جاري تحميل البيانات..."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UsersList;
