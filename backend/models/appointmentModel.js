import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  docId: { type: String, required: true },
  slotDate: { type: String, required: true },
  slotTime: { type: String, required: true },
  userData: { type: Object, required: true },
  docData: { type: Object, required: true },
  amount: { type: Number, required: true },
  date: { type: Number, required: true },
  cancelled: { type: Boolean, default: false },
  isCompleted: { type: Boolean, default: false },

  // --- الحقول الجديدة للتقييم ---
  isRated: { type: Boolean, default: false }, // للتأكد من أن المريض قيم الموعد مرة واحدة فقط
  rating: { type: Number, default: 0 }, // عدد النجوم المعطاة لهذا الموعد (من 1 إلى 5)
});

const appointmentModel =
  mongoose.models.appointment ||
  mongoose.model("appointment", appointmentSchema);

export default appointmentModel;
