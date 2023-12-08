const jwt = require("jsonwebtoken");

const { CONFIG } = require("../constants/config");

const verifyCookie = (req, res, next) => {
  const cookies = req.headers.cookie.split(";").reduce((acc, cookie) => {
    if (cookie.trim().startsWith("accessToken=")) {
      acc["accessToken"] = cookie.trim().substring("accessToken=".length);
    }
    return acc;
  }, {});

  const accessToken = cookies["accessToken"];

  if (!accessToken) {
    return res.status(401).json({ error: "토큰이 유효하지 않습니다." });
  }

  try {
    const decodedToken = jwt.verify(accessToken, CONFIG.SECRETKEY);
    req.token = decodedToken;

    next();
  } catch (error) {
    return res.status(403).json({ error: "토큰이 유효하지 않습니다." });
  }
};

module.exports = verifyCookie;
