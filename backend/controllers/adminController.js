import validator from "validator";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import userModel from "../models/userModel.js";
import appointmentModel from "../models/appointmentModel.js";
import jwt from "jsonwebtoken";

// API لإضافة طبيب
const addDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      speciality,
      degree,
      experience,
      about,
      fees,
      address,
      workingDays,
      workingHours,
    } = req.body;
    const imageFile = req.file;

    if (!name || !email || !password || !speciality || !fees || !address) {
      return res.json({
        success: false,
        message: "بيانات ناقصة: يرجى إدخال الحقول الأساسية",
      });
    }

    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "يرجى إدخال بريد إلكتروني صحيح",
      });
    }

    if (password.length < 8) {
      return res.json({
        success: false,
        message: "كلمة المرور يجب أن تكون 8 أحرف على الأقل",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let imageUrl = "";
    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      imageUrl = imageUpload.secure_url;
    }

    const doctorData = {
      name,
      email,
      image: imageUrl || "https://res.cloudinary.com/placeholder-image.png",
      password: hashedPassword,
      speciality,
      degree: degree || "غير محدد",
      experience: experience || "1 Year",
      about: about || "",
      fees: Number(fees),
      address: JSON.parse(address),
      workingDays: workingDays ? JSON.parse(workingDays) : [],
      workingHours: workingHours
        ? JSON.parse(workingHours)
        : { start: "09:00", end: "17:00" },
    };

    const newDoctor = new doctorModel(doctorData);
    await newDoctor.save();
    res.json({ success: true, message: "تم إضافة الطبيب بنجاح" });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "حدث خطأ أثناء الإضافة: " + error.message,
    });
  }
};

// API تسجيل دخول المسؤول
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "بيانات الاعتماد غير صحيحة" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// جلب جميع الأطباء
const allDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select("-password");
    res.json({ success: true, doctors });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// جلب جميع المواعيد
const appointmentsAdmin = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({});
    res.json({ success: true, appointments: appointments.reverse() });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "فشل في جلب المواعيد: " + error.message,
    });
  }
};

// إلغاء الموعد
const appointmentCancel = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);
    if (!appointmentData)
      return res.json({ success: false, message: "الموعد غير موجود" });

    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
    });

    const { docId, slotDate, slotTime } = appointmentData;
    const doctorData = await doctorModel.findById(docId);
    let slots_booked = doctorData.slots_booked;
    slots_booked[slotDate] = slots_booked[slotDate].filter(
      (e) => e !== slotTime,
    );

    await doctorModel.findByIdAndUpdate(docId, { slots_booked });
    res.json({ success: true, message: "تم إلغاء الموعد بنجاح" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// جلب بيانات لوحة التحكم
const adminDashboard = async (req, res) => {
  try {
    const doctors = await doctorModel.find({});
    const users = await userModel.find({});
    const appointments = await appointmentModel.find({});

    const dashData = {
      doctors: doctors.length,
      appointments: appointments.length,
      patients: users.length,
      latestAppointments: appointments.reverse().slice(0, 5),
    };
    res.json({ success: true, dashData });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "فشل في جلب بيانات الإحصائيات: " + error.message,
    });
  }
};

// --- الدوال الجديدة المضافة ---

// جلب كل المستخدمين
// جلب كل المستخدمين - الكود الصحيح للباك إند
const allUsers = async (req, res) => {
    try {
        const users = await userModel.find({}).select("-password");
        res.json({ success: true, users });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// حذف مستخدم
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.body;
    await userModel.findByIdAndDelete(userId);
    res.json({ success: true, message: "تم حذف المستخدم بنجاح" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// حذف طبيب
const deleteDoctor = async (req, res) => {
  try {
    const { docId } = req.body;
    await doctorModel.findByIdAndDelete(docId);
    res.json({ success: true, message: "تم حذف الطبيب بنجاح" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// تغيير توفر الطبيب
const changeAvailability = async (req, res) => {
  try {
    const { docId } = req.body;
    const docData = await doctorModel.findById(docId);
    await doctorModel.findByIdAndUpdate(docId, {
      available: !docData.available,
    });
    res.json({ success: true, message: "تم تغيير الحالة بنجاح" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export {
  addDoctor,
  loginAdmin,
  allDoctors,
  appointmentsAdmin,
  appointmentCancel,
  adminDashboard,
  allUsers, // تأكدي أنه allUsers وليس getAllUsers
  deleteUser,
  deleteDoctor,
  changeAvailability,
};