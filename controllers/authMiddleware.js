const jwt = require('jsonwebtoken');

const authMiddleware = (allowedRoles = []) => {
  return (req, res, next) => {
    const authHeaders = req.headers.authorization;

    if (!authHeaders || !authHeaders.startsWith("Bearer ")) {
      return res.status(400).json({ message: "Token not found" });
    }

    const token = authHeaders.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.user = decoded;

      const userRole = decoded.role;

      console.log(userRole, decoded);

      if (userRole === "admin") {
        return next();
      }

      if (userRole === 'passenger') {
        if (req.method === 'GET') {
          return next();
        } else {
          return res.status(403).json({ message: "Unauthorized" }); // ✅ FIXED: req → res
        }
      }

      return res.status(403).json({ message: "Forbidden: Insufficient role" });

    } catch (error) {
      console.log("JWT Verification Error:", error.message); // ✅ More helpful log
      return res.status(401).json({ message: "Invalid or expired token" }); // ✅ Better status code
    }
  };
};

module.exports = authMiddleware;