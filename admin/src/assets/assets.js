import add_icon from "./add_icon.svg";
import logo from "./loggo.png";
import appointment_icon from "./appointment_icon.svg";
import cancel_icon from "./cancel_icon.svg";
import doctor_icon from "./doctor_icon.svg";
import home_icon from "./home_icon.svg";
import people_icon from "./people_icon.svg";
import upload_area from "./upload_area.svg";
import list_icon from "./list_icon.svg";
import tick_icon from "./tick_icon.svg";
import appointments_icon from "./appointments_icon.svg";
import earning_icon from "./earning_icon.svg";
import patients_icon from "./patients_icon.svg";

export const assets = {
  add_icon,
  logo,
  appointment_icon,
  cancel_icon,
  doctor_icon,
  upload_area,
  home_icon,
  patients_icon,
  people_icon,
  list_icon,
  tick_icon,
  appointments_icon,
  earning_icon,
};

export const specialityData = [
  { speciality: "General Physician", arabic: "طبيب عام" },
  { speciality: "Pediatricians", arabic: "طب الأطفال" },
  { speciality: "Gynecologist", arabic: "طب النساء والتوليد" },
  { speciality: "Dermatologist", arabic: "جلدية" },
  { speciality: "Neurologist", arabic: "عصبية" },
  { speciality: "Cardiologist", arabic: "أمراض القلب" },
  { speciality: "Surgeon", arabic: "جراحة عامة" },
  { speciality: "Orthopedic", arabic: "عظمية" },
  { speciality: "Oncology", arabic: "أمراض الدم والأورام" },
  { speciality: "Neurosurgery", arabic: "جراحة المخ والأعصاب" },
  { speciality: "Dentist", arabic: "طب الأسنان" },
  { speciality: "Psychiatrist", arabic: "الطب النفسي" },
  { speciality: "Pulmonologist", arabic: "أمراض الجهاز التنفسي" },
  { speciality: "Gastroenterology", arabic: "أمراض الجهاز الهضمي" },
];

// أو كقاموس (Object) وهو الأسهل للبحث السريع:
export const specialityTranslation = {
  "General Physician": "طبيب عام",
  Pediatricians: "طب الأطفال",
  Gynecologist: "طب النساء والتوليد",
  Dermatologist: "جلدية",
  Neurologist: "عصبية",
  Cardiologist: "أمراض القلب",
  Surgeon: "جراحة عامة",
  Orthopedic: "عظمية",
  Oncology: "أمراض الدم والأورام",
  Neurosurgery: "جراحة المخ والأعصاب",
  Dentist: "طب الأسنان",
  Psychiatrist: "الطب النفسي",
  Pulmonologist: "أمراض الجهاز التنفسي",
  Gastroenterology: "أمراض الجهاز الهضمي",
  Ophthalmology: "عيون",
  ENT: "أذن وأنف وحنجرة",
  Endocrinology: "غدد صماء",
  Urology: "أمراض المسالك البولية",
};