import logo from "./loggo.png";
import profile_pic from "./profile_pic.png";
import dropdown_icon from "./dropdown_icon.svg";
import group_profiles from "./group_profiles.png";
import arrow_icon from "./arrow_icon.svg";
import header_img from "./header_img.png";
import hero_img from "./heroo.png";

import appointment_img from "./appointment_img.png";
import about_image from "./about_image.png";
import contact_image from "./contact_image.png";
import menu_icon from "./menu_icon.svg";
import cross_icon from "./cross_icon.png";
import search_icon from "./search.png";
import no_results_icon from "./no-results.png";
import chatbot_icon from "./chatbot.png";
import bg_icon from "./bglog.png";


import Dermatologist from "./Dermatologist.svg";
import Gastroenterologist from "./Gastroenterologist.svg";
import General_physician from "./General_physician.svg";
import Gynecologist from "./Gynecologist.svg";
import Neurologist from "./Neurologist.svg";
import Pediatricians from "./Pediatricians.svg";

import doc1 from "./doc1.png";
import doc2 from "./doc2.png";
import doc3 from "./doc3.png";


import verified_icon from "./verified_icon.svg";
import info_icon from "./info_icon.svg";

export const assets = {
  logo,
  profile_pic,
  dropdown_icon,
  group_profiles,
  arrow_icon,
  header_img,
  appointment_img,
  verified_icon,
  info_icon,
  about_image,
  contact_image,
  menu_icon,
  cross_icon,
  search_icon,
  no_results_icon,
  chatbot_icon,
  hero_img,
  doc1,
  doc2,
  doc3,
  bg_icon,
};

// البيانات المستخدمة في عرض التخصصات (الصفحة الرئيسية)
export const specialityData = [
  {
    speciality: "طبيب عام",
    path: "General Physician",
    image: General_physician,
  },
  { speciality: "نسائية وتوليد", path: "Gynecologist", image: Gynecologist },
  { speciality: "أطفال", path: "Pediatricians", image: Pediatricians },
  { speciality: "جلدية", path: "Dermatologist", image: Dermatologist },
  { speciality: "مخ وأعصاب", path: "Neurologist", image: Neurologist },
  {
    speciality: "جهاز هضمي",
    path: "Gastroenterology",
    image: Gastroenterologist,
  },
];

// القاموس الموحد للترجمة في جميع أنحاء التطبيق
export const specialityTranslation = {
  "General Physician": "طبيب عام",
  //"General physician": "طبيب عام",
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
 // Ophthalmologist: "عيون",
  ENT: "أذن وأنف وحنجرة",
  Endocrinology: "غدد صماء",
  Urology: "أمراض المسالك البولية",
};


