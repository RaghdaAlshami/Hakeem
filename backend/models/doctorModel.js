import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String, required: true },
    speciality: { type: String, required: true },
    degree: { type: String, required: true },
    experience: { type: String, required: true },
    about: { type: String, default:""},
    available: { type: Boolean, default: true },
    fees: { type: Number, required: true },
    address: { type: Object, required: true },
    slots_booked: { type: Object, default: {} },

    // --- الحقول الجديدة للتقييم ---
    rating: { type: Number, default: 0 }, // متوسط التقييم (مثلاً 4.5)
    numReviews: { type: Number, default: 0 },

    workingHours: {
      start: { type: String, default: "09:00" }, // تنسيق 24 ساعة (مثلاً 09:00)
      end: { type: String, default: "17:00" }, // تنسيق 24 ساعة (مثلاً 17:00)
    },

    workingDays: {
      type: [String],
      default: ["السبت", "الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس"],
    },
  },

  {
    minimize: false,
    timestamps: true,
  },
);

const doctorModel =
  mongoose.models.doctor || mongoose.model("doctor", doctorSchema);

export default doctorModel;
