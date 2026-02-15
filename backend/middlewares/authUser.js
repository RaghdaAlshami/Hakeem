import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  try {
    const { token } = req.headers;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "غير مسموح، يرجى تسجيل الدخول أولاً",
      });
    }

    const token_decode = jwt.verify(token, process.env.JWT_SECRET);

    if (!token_decode.id) {
      return res.status(401).json({
        success: false,
        message: "توكن غير صالح، يرجى إعادة تسجيل الدخول",
      });
    }

    if (!req.body) {
      req.body = {};
    }

    req.body.userId = token_decode.id;

    next();
  } catch (error) {
    console.error("JWT Auth Error:", error.message);

    res.status(403).json({
      success: false,
      message: "جلسة منتهية أو توكن غير صالح، يرجى تسجيل الدخول مجدداً",
    });
  }
};

export default authUser;
