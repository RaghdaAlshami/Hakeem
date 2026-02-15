import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateProfile,
  bookAppointment,
  listAppointment,
  cancelAppointment,
  rateAppointment,
  googleAuth,

} from "../controllers/userController.js";
import authUser from "../middlewares/authUser.js";
import upload from "../middlewares/multer.js";
import { getAiMedicalAdvice } from "../controllers/aiController.js";

const userRouter = express.Router();

// المسارات العامة
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/google-auth", googleAuth); // تم تصحيح طريقة الكتابة هنا

// المسارات المحمية (تتطلب تسجيل دخول)
userRouter.get("/get-profile", authUser, getUserProfile);

userRouter.post(
  "/update-profile",
  upload.single("image"),
  authUser,
  updateProfile,
);
userRouter.post("/book-appointment", authUser, bookAppointment);
userRouter.get("/appointments", authUser, listAppointment);
userRouter.post("/cancel-appointment", authUser, cancelAppointment);
userRouter.post("/rate-appointment", authUser, rateAppointment);


// مسار استشارة الذكاء الاصطناعي
userRouter.post("/ai-consultation", getAiMedicalAdvice);
export default userRouter;
