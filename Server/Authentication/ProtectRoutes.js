const jwt = require("jsonwebtoken");

function Authentication(req, res, next) {
    const Safetoken = req.header('x-auth-token');

    if (!Safetoken) {
        return res.status(401).json({ note: 'Not authorized, no token' });
    }

    try {

        const token = Safetoken.startsWith("Bearer ") ? Safetoken.split(" ")[1] : Safetoken;

        const decodeToken = jwt.verify(token, process.env.Secret_key);

        req.user = decodeToken.NewUser ? decodeToken.NewUser : decodeToken;

        // console.log("Authentication Successful: req.user =", req.user);
        next();
    } catch (err) {
        // console.error("JWT Verification Error:", err.message);
        res.status(401).json({ note: "Token is not valid" });
    }
}

const isMerchant = (req, res, next) => {
    console.log("Checking Merchant Role: req.user =", req.user);

    if (!req.user) {
        // console.log("isMerchant Error: req.user is undefined");
        return res.status(401).json({ error: "User authentication failed." });
    }

    if (!req.user.roles || !Array.isArray(req.user.roles)) {
        // console.log("isMerchant Error: req.user.role is not an array");
        return res.status(400).json({ error: "User role missing or invalid." });
    }

    if (!req.user.roles.includes("merchant")) {
        // console.log("isMerchant Error: User is not a merchant");
        return res.status(403).json({ error: "Access Denied. Only merchants allowed." });
    }

    next();
};

module.exports = { Authentication, isMerchant };
