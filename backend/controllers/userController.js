import validator from "validator";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";
import appointmentModel from "../models/appointmentModel.js";
import doctorModel from "../models/doctorModel.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import { OAuth2Client } from "google-auth-library";

// API to register user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !password || !email) {
      return res.json({
        success: false,
        message: "يرجى إدخال جميع البيانات",
      });
    }
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "يرجى إدخال إيميل صحيح" });
    }

    if (password.length < 8) {
      return res.json({
        success: false,
        message: "كلمة المرور يجب أن تكون 8 أحرف على الأقل",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
      name,
      email,
      password: hashedPassword,
    };

    const newUser = new userModel(userData);
    const user = await newUser.save();

    // 6. إنشاء توكن (Token) للمستخدم
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    if (error.code === 11000) {
      return res.json({ success: false, message: "هذا الإيميل مسجل مسبقاً" });
    }
    res.json({ success: false, message: error.message });
  }
};

//api for user login

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "بيانات غير صالحة" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({
        success: false,
        message: "بيانات  غير صالحة",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get user profile data
const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.body;

    const userData = await userModel.findById(userId).select("-password");

    if (!userData) {
      return res.json({ success: false, message: "المستخدم غير موجود" });
    }

    res.json({ success: true, userData });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "حدث خطأ أثناء جلب بيانات الملف الشخصي",
    });
  }
};

// API to get update profile data
const updateProfile = async (req, res) => {
  try {
    const {
      name,
      phone,
      address,
      gender,
      dob,
      bloodGroup,
      currentPassword,
      newPassword,
    } = req.body;

    const userId = req.body.userId;
    const imageFile = req.file;

    if (!name || !phone || !dob || !gender) {
      return res.json({ success: false, message: "بيانات ناقصة" });
    }

    // 1. جلب بيانات المستخدم مع التأكد من وجوده
    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({
        success: false,
        message: "فشل العثور على المستخدم، يرجى إعادة تسجيل الدخول",
      });
    }

    // 2. معالجة تغيير كلمة المرور
    let hashedPassword = user.password;

    if (newPassword) {
      // إذا كان المستخدم يريد تغيير كلمة المرور
      if (!currentPassword) {
        return res.json({
          success: false,
          message: "يرجى إدخال كلمة المرور الحالية",
        });
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.json({
          success: false,
          message: "كلمة المرور الحالية غير صحيحة",
        });
      }

      if (newPassword.length < 8) {
        return res.json({
          success: false,
          message: "يجب أن تكون كلمة المرور الجديدة 8 أحرف على الأقل",
        });
      }

      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(newPassword, salt);
    }

    // 3. تجهيز بيانات التحديث
    const updateData = {
      name,
      phone,
      address: JSON.parse(address),
      dob,
      gender,
      bloodGroup,
      password: hashedPassword,
    };

    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      updateData.image = imageUpload.secure_url;
    }

    await userModel.findByIdAndUpdate(userId, updateData);

    res.json({ success: true, message: "تم تحديث الملف الشخصي بنجاح" });
  } catch (error) {
    console.log("Error in updateProfile:", error);
    res.json({ success: false, message: "حدث خطأ في الخادم" });
  }
};

//API to book an appointment
const bookAppointment = async (req, res) => {
  try {
    const { userId, docId, slotDate, slotTime } = req.body;

    // 1. جلب بيانات الطبيب
    const docData = await doctorModel.findById(docId).select("-password");

    if (!docData.available) {
      return res.json({ success: false, message: "الطبيب غير متاح حالياً" });
    }

    // 2. التحقق من المواعيد المحجوزة لدى الطبيب (slots_booked)
    let slots_booked = docData.slots_booked;

    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        return res.json({ success: false, message: "هذا الوقت محجوز مسبقاً" });
      } else {
        slots_booked[slotDate].push(slotTime);
      }
    } else {
      slots_booked[slotDate] = [];
      slots_booked[slotDate].push(slotTime);
    }

    // 3. جلب بيانات المستخدم لإضافتها في سجل الحجز
    const userData = await userModel.findById(userId).select("-password");

    // 4. حذف بيانات المواعيد من نسخة بيانات الطبيب (للحفاظ على خصوصية قاعدة البيانات)
    delete docData.slots_booked;

    // 5. إنشاء الحجز الجديد
    const appointmentData = {
      userId,
      docId,
      userData,
      docData,
      amount: docData.fees,
      slotTime,
      slotDate,
      date: Date.now(),
    };

    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();

    // 6. تحديث بيانات الطبيب بالمواعيد الجديدة (Slots Booked)
    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    res.json({ success: true, message: "تم حجز الموعد بنجاح" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get user's appointments for frontend
const listAppointment = async (req, res) => {
  try {
    const { userId } = req.body;

    // البحث عن كل المواعيد الخاصة بهذا المستخدم
    // استخدمنا .reverse() لكي تظهر المواعيد الجديدة في الأعلى
    const appointments = await appointmentModel
      .find({ userId })
      .sort({ date: -1 });

    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to cancel appointment
const cancelAppointment = async (req, res) => {
  try {
    const { userId, appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData || appointmentData.userId !== userId) {
      return res.json({
        success: false,
        message: "غير مسموح لك بإجراء هذا الإجراء أو الموعد غير موجود",
      });
    }


    if (appointmentData.cancelled) {
      return res.json({ success: false, message: "هذا الموعد ملغى بالفعل" });
    }

    if (appointmentData.isCompleted) {
      return res.json({
        success: false,
        message: "لا يمكن إلغاء موعد تم إتمامه",
      });
    }

    // 3. تحديث حالة الموعد إلى ملغى
    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
    });

    // 4. تحرير وقت الموعد من قائمة الطبيب (Slot Release)
    const { docId, slotDate, slotTime } = appointmentData;
    const docData = await doctorModel.findById(docId);

    let slots_booked = docData.slots_booked;

    if (slots_booked[slotDate]) {
      slots_booked[slotDate] = slots_booked[slotDate].filter(
        (e) => e !== slotTime,
      );
    }

    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    res.json({ success: true, message: "تم إلغاء الموعد بنجاح" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
// API to rate appointment
const rateAppointment = async (req, res) => {
  try {
    const { userId, appointmentId, rating } = req.body;

    // 1. التحقق من أن التقييم بين 1 و 5
    if (rating < 1 || rating > 5) {
      return res.json({
        success: false,
        message: "التقييم يجب أن يكون بين 1 و 5 نجوم",
      });
    }

    // 2. جلب بيانات الموعد
    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData || appointmentData.userId !== userId) {
      return res.json({
        success: false,
        message: "الموعد غير موجود أو غير مصرح لك بتقييمه",
      });
    }

    // 3. التأكد من أن الموعد مكتمل ولم يتم تقييمه من قبل
    if (!appointmentData.isCompleted) {
      return res.json({
        success: false,
        message: "لا يمكنك تقييم موعد لم يكتمل بعد",
      });
    }

    if (appointmentData.isRated) {
      return res.json({
        success: false,
        message: "لقد قمت بتقييم هذا الموعد مسبقاً",
      });
    }

    // 4. جلب بيانات الطبيب لتحديث متوسط التقييم
    const docId = appointmentData.docId;
    const doctorData = await doctorModel.findById(docId);

    let { rating: oldRating, numReviews } = doctorData;

    // حساب المتوسط الحسابي الجديد
    // المعادلة: (المتوسط القديم * عدد التقييمات + التقييم الجديد) / (عدد التقييمات + 1)
    const newNumReviews = numReviews + 1;
    const newRating = (oldRating * numReviews + rating) / newNumReviews;

    // 5. تحديث بيانات الطبيب
    await doctorModel.findByIdAndUpdate(docId, {
      rating: newRating.toFixed(1), // تقريب النتيجة لمرتبة عشرية واحدة مثل 4.5
      numReviews: newNumReviews,
    });

    // 6. تحديث الموعد لكي لا يتم تقييمه مرة أخرى
    await appointmentModel.findByIdAndUpdate(appointmentId, {
      isRated: true,
      rating: rating,
    });

    res.json({ success: true, message: "شكراً لك! تم إضافة تقييمك بنجاح" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleAuth = async (req, res) => {
  try {
    const { token } = req.body; // التوكن القادم من Frontend (GoogleLogin)

    // 1. التحقق من التوكن عبر جوجل
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { name, email, picture, sub } = ticket.getPayload();

    // 2. البحث عن المستخدم في قاعدة بياناتك
    let user = await userModel.findOne({ email });

    if (!user) {
      // 3. إذا لم يوجد، أنشئي حساباً جديداً تلقائياً
      user = await userModel.create({
        name,
        email,
        image: picture,
        // نضع كلمة مرور عشوائية لأن المستخدم سيدخل عبر جوجل دائماً
        password: await bcrypt.hash(sub + process.env.JWT_SECRET, 10),
        address: { line1: "", city: "دمشق" }, // قيم افتراضية
        dob: "0001-01-01",
      });
    }

    // 4. إنشاء توكن خاص بتطبيقك (JWT) ليدخل المستخدم
    const appToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({
      success: true,
      token: appToken,
      message: "تم تسجيل الدخول عبر جوجل",
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "فشل التحقق من حساب جوجل" });
  }
};

export {
  registerUser,
  loginUser,
  getUserProfile,
  updateProfile,
  bookAppointment,
  listAppointment,
  cancelAppointment,
  rateAppointment,
  googleAuth,
};
