const admin = require("../config/firebase-config");

const isAuthenticated = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];

  try {
    const decodeValue = await admin.auth().verifyIdToken(token);

    if (decodeValue) {
      req.userData = decodeValue;

      return next();
    }

    return res.status(401).json({ message: "Unauthorized" });
  } catch (error) {
    console.error("Error: ", error);

    if (error instanceof admin.auth.InvalidIdTokenError) {
      return res.status(401).json({ message: "Invalid token" });
    }

    if (error instanceof admin.auth.ExpiredIdTokenError) {
      return res.status(401).json({ message: "Expired token" });
    }

    return res.status(500).json({ message: "Internal Error" });
  }
};

exports.isAuthenticated = isAuthenticated;
