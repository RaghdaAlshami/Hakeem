import express from "express";
import {
  addDoctor,
  allDoctors,
  loginAdmin,
  appointmentsAdmin,
  appointmentCancel,
  adminDashboard,
  deleteDoctor,
  allUsers, 
  deleteUser, 
  changeAvailability, // تأكد من استيرادها من adminController
} from "../controllers/adminController.js";
import upload from "../middlewares/multer.js";
import authAdmin from "../middlewares/authAdmin.js";

const adminRouter = express.Router();

// مسارات الوصول العام
adminRouter.post("/login", loginAdmin);

// مسارات الأطباء (تحتاج صلاحية أدمن)
adminRouter.post("/add-doctor", authAdmin, upload.single("image"), addDoctor);
adminRouter.get("/all-doctors", authAdmin, allDoctors);
adminRouter.post("/change-availability", authAdmin, changeAvailability);
adminRouter.post("/delete-doctor", authAdmin, deleteDoctor);

// مسارات المواعيد والإحصائيات
adminRouter.get("/appointments", authAdmin, appointmentsAdmin);
adminRouter.post("/cancel-appointment", authAdmin, appointmentCancel);
adminRouter.get("/dashboard", authAdmin, adminDashboard);

// --- مسارات المستخدمين المضافة ---
adminRouter.get("/all-users", authAdmin, allUsers);
adminRouter.post("/delete-user", authAdmin, deleteUser);

export default adminRouter;
