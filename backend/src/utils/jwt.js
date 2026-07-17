import jwt from "jsonwebtoken";

const getJwtSecret = () => process.env.JWT_SECRET;
const getRefreshSecret = () => process.env.REFRESH_SECRET;

export const generateAccessToken = (user) => {
    return jwt.sign(
        user,
        getJwtSecret(),
        { expiresIn: "15m" }
    );
}

export const generateRefreshToken = (user) => {
    return jwt.sign(
        user,
        getRefreshSecret(),
        { expiresIn: "7d" }
    );
}
