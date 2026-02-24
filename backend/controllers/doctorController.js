import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import { v2 as cloudinary } from "cloudinary";

//api to change doctor availability
const changeAvailability = async (req, res) => {
  try {
    const { docId } = req.body;

 
    const docData = await doctorModel.findById(docId);

    if (!docData) {
      return res.json({ success: false, message: "الطبيب غير موجود" });
    }

    
    const updatedDoctor = await doctorModel.findByIdAndUpdate(
      docId,
      { available: !docData.available },
      { new: true }, 
    );

    res.json({
      success: true,
      message: "تم تغيير حالة التوفر بنجاح",
      available: updatedDoctor.available,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const doctorList = async (req, res) => {
  try {
    // جلب الأطباء مع اختيار الحقول العامة فقط (اسم، صورة، تخصص، إلخ)
    // .select("-password -email") تعني جلب كل شيء ما عدا الباسورد والايميل
    const doctors = await doctorModel.find({}).select(["-password", "-email"]);

    res.json({ success: true, doctors });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API for docror Login
const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;

    const doctor = await doctorModel.findOne({ email });

    if (!doctor) {
      return res.json({
        success: false,
        message: "بيانات الاعتماد غير صالحة (البريد الإلكتروني غير موجود)",
      });
    }

    const isMatch = await bcrypt.compare(password, doctor.password);

    if (isMatch) {
      const dToken = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET);

      res.json({ success: true, dToken });
    } else {
      res.json({ success: false, message: "كلمة المرور غير صحيحة" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API  to get all  doctor's appointments
const appointmentsDoctor = async (req, res) => {
  try {
    const { docId } = req.body;

    const appointments = await appointmentModel.find({ docId });

    res.json({
      success: true,
      appointments: appointments.reverse(),
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "فشل في جلب المواعيد: " + error.message,
    });
  }
};

// API  to make an appointment  completed
const appointmentComplete = async (req, res) => {
  try {
    const { docId, appointmentId } = req.body;

    
    const appointmentData = await appointmentModel.findById(appointmentId);

    if (appointmentData && appointmentData.docId === docId) {
     
      await appointmentModel.findByIdAndUpdate(appointmentId, {
        isCompleted: true,
      });

      return res.json({ success: true, message: "تم إتمام الكشف بنجاح" });
    } else {
      return res.json({
        success: false,
        message: "فشل التحديث، الموعد غير موجود!  ",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "حدث خطأ: " + error.message });
  }
};

// API  to cancel an appointment
const appointmentCancel = async (req, res) => {
  try {
    const { docId, appointmentId } = req.body;

   
    const appointmentData = await appointmentModel.findById(appointmentId);

    if (appointmentData && appointmentData.docId === docId) {
  
      await appointmentModel.findByIdAndUpdate(appointmentId, {
        cancelled: true,
      });

      
      const { slotDate, slotTime } = appointmentData;
      const doctorData = await doctorModel.findById(docId);

      let slots_booked = doctorData.slots_booked;
      slots_booked[slotDate] = slots_booked[slotDate].filter(
        (e) => e !== slotTime,
      );

      await doctorModel.findByIdAndUpdate(docId, { slots_booked });

      return res.json({ success: true, message: "تم إلغاء الموعد بنجاح" });
    } else {
      return res.json({
        success: false,
        message: "فشل التحديث، الموعد غير موجود!  ",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "حدث خطأ: " + error.message });
  }
};

// API to get dashboard data for doctor panel
const doctorDashboard = async (req, res) => {
  try {
    const { docId } = req.body;

   
    const appointments = await appointmentModel.find({ docId });

    let earnings = 0;
    let patients = [];

    appointments.map((item) => {
    
      if (item.isCompleted) {
        earnings += item.amount;
      }

    
      if (!patients.includes(item.userId)) {
        patients.push(item.userId);
      }
    });

   
    const dashData = {
      earnings, 
      appointments: appointments.length, 
      patients: patients.length, 
      latestAppointments: appointments.reverse().slice(0, 7),
      graphData: appointments.map((app) => ({ slotDate: app.slotDate })),
    };

    res.json({ success: true, dashData });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "فشل جلب إحصائيات لوحة التحكم: " + error.message,
    });
  }
};

//API to get doctor profile for Doctor Panel
const doctorProfile = async (req, res) => {
  try {
    
    const { docId } = req.body;

    const docData = await doctorModel.findById(docId).select("-password");

    if (!docData) {
      return res.json({ success: false, message: "الطبيب غير موجود" });
    }

    res.json({ success: true, docData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//API to get update profile for Doctor Panel
const updateDoctorProfile = async (req, res) => {
  try {
    const {
      name,
      fees,
      address,
      available,
      about,
      experience,
      workingDays,
      workingHours,
    } = req.body;

    const docId = req.body.docId;
    const imageFile = req.file;

    if (!name) {
      return res.json({ success: false, message: "بيانات ناقصة" });
    }
    const doc = await doctorModel.findById(docId);

    if (!doc) {
      return res.json({
        success: false,
        message: "فشل العثور على المستخدم، يرجى إعادة تسجيل الدخول",
      });
    }

  
    const updateData = {
      name,
      fees,
      about,
      experience,
      available,
      address: address ? JSON.parse(address) : doc.address,
      workingDays: workingDays ? JSON.parse(workingDays) : doc.workingDays, 
      workingHours: workingHours ? JSON.parse(workingHours) : doc.workingHours, 
    };

    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      updateData.image = imageUpload.secure_url;
    }

    await doctorModel.findByIdAndUpdate(docId, updateData);

    res.json({ success: true, message: "تم تحديث الملف الشخصي بنجاح" });
  } catch (error) {
    console.log("Error in updateProfile:", error);
    res.json({
      success: false,
      message: "حدث خطأ في الخادم: " + error.message,
    });
  }
};

//API to get user profile
const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.body;
    const userData = await userModel.findById(userId).select("-password");

    if (!userData) {
      return res.json({ success: false, message: "المريض غير موجود" });
    }

    res.json({ success: true, userData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  changeAvailability,
  doctorList,
  loginDoctor,
  appointmentsDoctor,
  appointmentComplete,
  appointmentCancel,
  doctorDashboard,
  doctorProfile,
  updateDoctorProfile,
  getUserProfile,
};
