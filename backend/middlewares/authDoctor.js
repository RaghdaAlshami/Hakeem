import jwt from "jsonwebtoken";

const authDoctor = async (req, res, next) => {
  try {
    const { dtoken } = req.headers;

    if (!dtoken) {
      return res.json({
        success: false,
        message: "غير مسموح، يرجى تسجيل الدخول أولاً",
      });
    }

    const token_decode = jwt.verify(dtoken, process.env.JWT_SECRET);

    if (!req.body) {
      req.body = {};
    }

    req.body.docId = token_decode.id;

    next();
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "جلسة انتهت، يرجى إعادة تسجيل الدخول",
    });
  }
};

export default authDoctor;
