import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

export const generateAccessToken = (user) => {
    return jwt.sign(user, JWT_SECRET, {expiresIn: "15m"});
}

export const generateRefreshToken = (user) => {
    return jwt.sign(user, REFRESH_SECRET, {expiresIn: "7d"});
}




