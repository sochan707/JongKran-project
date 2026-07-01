import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_key";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "refresh_secret_key";

export const generateAccessToken = (user) => {
    return jwt.sign(user, JWT_SECRET, {expiresIn: "15m"});
}

export const generateRefreshToken = (user) => {
    return jwt.sign(user, REFRESH_SECRET, {expiresIn: "7d"});
}

// export const generateToken = (user) => {
//     return jwt.sign(
//         {
//             user_id: user.user_id,
//             email: user.email,
//             role_id: user.role_id
//         },
//         JWT_SECRET,
//         {expiresIn: "1d"}
//     )
// };

