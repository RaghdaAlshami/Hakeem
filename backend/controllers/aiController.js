import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const specialityTranslation = {
  "General Physician": "طبيب عام",
  "General physician": "طبيب عام",
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
  "Internal Medicine": "باطنية",
  Ophthalmologist: "عيون",
  Ophthalmology: "عيون",
  ENT: "أذن وأنف وحنجرة",
  Endocrinology: "غدد صماء",
};

export const getAiMedicalAdvice = async (req, res) => {
  try {
    const { symptoms } = req.body;

    if (!symptoms) {
      return res.json({ success: false, message: "يرجى وصف الأعراض" });
    }

    const validSpecs = Object.keys(specialityTranslation).join(", ");

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `أنت مساعد طبي ذكي في تطبيق "حكيم". وظيفتك تحليل الأعراض وتوجيه المريض للتخصص الصحيح.`,
        },
        {
          role: "user",
          content: `حلل هذه الأعراض: "${symptoms}".
                    المطلوب:
                    1- تحليل طبي موجز جداً بالعربية.
                    2- اختر تخصصاً واحداً فقط من هذه القائمة حصراً: (${validSpecs}).
                    3- في آخر سطر تماماً، اكتب الجملة التالية: أنصحك باستشارة طبيب متخصص بـ #اسم التخصص بالإنجليزية#`,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.2,
    });

    let fullResponse = chatCompletion.choices[0]?.message?.content;

    let englishSpeciality = "General Physician";
    for (let key in specialityTranslation) {
      if (fullResponse.toLowerCase().includes(key.toLowerCase())) {
        englishSpeciality = key;
        break;
      }
    }

    const arabicSpeciality =
      specialityTranslation[englishSpeciality] || englishSpeciality;

    let finalAnalysis = fullResponse;

    finalAnalysis = finalAnalysis.replace(/#([^#]+)#/g, arabicSpeciality);

    const safeEnglishSpec = englishSpeciality.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&",
    );
    finalAnalysis = finalAnalysis.replace(
      new RegExp(`\\b${safeEnglishSpec}\\b`, "gi"),
      arabicSpeciality,
    );

    res.json({
      success: true,
      analysis: finalAnalysis,
      suggestedSpeciality: englishSpeciality,
    });
  } catch (error) {
    console.error("AI Error:", error);
    res.json({
      success: false,
      message: "عذراً، فشل المساعد في التحليل حالياً",
    });
  }
};
