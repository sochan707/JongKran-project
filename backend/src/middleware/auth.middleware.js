import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_key";

export const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "No token provided! (; •́ᆺ•̀)"
            })
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Invalid token format! (; •́ᆺ•̀)"
            });
        }

        const decoded = jwt.verify(token, JWT_SECRET);

        req.user = decoded;

        next()

    } catch(err){
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token! o(╥﹏╥)o"
        });
    }
}