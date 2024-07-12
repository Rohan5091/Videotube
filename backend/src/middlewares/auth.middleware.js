import jwt from "jsonwebtoken";

const isloggedIn = (req, res, next) => {
  if (req.cookies && req.cookies.accessToken) {
    const token = req.cookies.accessToken;
    const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = user;
    return next();
  }
  return res.status(401).json({ message: "Unauthorized" });
};

export { isloggedIn };