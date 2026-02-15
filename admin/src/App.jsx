import React, { useContext } from "react";
import Login from "./pages/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AdminContext } from "./context/AdminContext";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Admin/Dashboard";
import AllAppointments from "./pages/Admin/AllAppointments";
import AddDoctor from "./pages/Admin/AddDoctor";
import DoctorsList from "./pages/Admin/DoctorsList";
import UsersList from "./pages/Admin/UsersList";
import { DoctorContext } from "./context/DoctorContext";
import DoctorAppointments from "./pages/Doctor/DoctorAppointments";
import DoctorProfile from "./pages/Doctor/DoctorProfile";
import DoctorDashboard from "./pages/Doctor/DoctorDashboard";
import PatientProfile from "./pages/PatientProfile";

const App = () => {
  const { aToken } = useContext(AdminContext);
  const { dToken } = useContext(DoctorContext);

  return aToken || dToken ? (
    <div className="bg-[#F8F9FD] min-h-screen font-['Cairo']" dir="rtl">
      <ToastContainer position="top-left" />
      <Navbar />
      <div className="flex items-start">
        <Sidebar />
        <div className="flex-1 p-5 sm:p-10">
          <Routes>
            {/*  default route */}
            <Route
              path="/"
              element={aToken ? <Dashboard /> : <DoctorDashboard />}
            />
            {/*  admin route */}

            {aToken && (
              <>
                <Route path="/admin-dashboard" element={<Dashboard />} />
                <Route path="/all-appointments" element={<AllAppointments />} />
                <Route path="/add-doctor" element={<AddDoctor />} />
                <Route path="/doctors-list" element={<DoctorsList />} />
                <Route path="/users-list" element={<UsersList />} />
              </>
            )}
            {/*  doctor route */}

            {dToken && (
              <>
                <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
                <Route
                  path="/doctor-appointments"
                  element={<DoctorAppointments />}
                />
                <Route path="/doctor-profile" element={<DoctorProfile />} />

             
                <Route path="/profile/:userId" element={<PatientProfile />} />
              </>
            )}
          </Routes>
        </div>
      </div>
    </div>
  ) : (
    <div dir="rtl" className="font-['Cairo']">
      <Login />
      <ToastContainer position="top-left" />
    </div>
  );
};

export default App;
