import authService, { logoutUser } from "../services/auth.service.js";
import jwt from "jsonwebtoken";
import { generateAccessToken } from "../utils/jwt.js";
import { loginUser } from "../services/auth.service.js";

const REFRESH_SECRET = process.env.REFRESH_SECRET || "refresh_secret_key";

export const register = async (req, res) => {
    const result = await authService.registerUser(req.body);

    if(!result.success){
        return res.status(400).json(result);
    }

    return res.status(201).json(result);
};

export const login = async (req, res) => {
    const result = await authService.loginUser(req.body);

    if(!result.success){
        return res.status(401).json(result);
    }

    res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
        success: true,
        data: result.data
    });
}

export const refreshToken = async (req, res) => {
    try{
        const {refreshToken} = req.body;

        if(!refreshToken){
            return res.status(401).json({
                message: "No refrest token provided! (ó﹏ò｡)"
            });
        }

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);

        const newAccessToken = jwt.sign(
            {
                userId : decoded.userId,
                role: decoded.role
            },
            process.env.JWT_SECRET,
            {expiresIn: "15m"}
        );

        return res.json({
            accessToken: newAccessToken
        });

    } catch(err){
        return res.status(401).json({
            message: "Invalid refresh token"
        });
    }
};

export const logoutController = async (req, res) => {
    console.log("REQ.USER:", req.user);
    if(!req.user){
        return res.status(401).json({
            success: false,
            message: "Unauthorized! (; ･`д･´)"
        });
    }

    const result = await logoutUser(req.user.userId);
    return res.json(result);
}

// export const logout = async (req, res) => {
//     return res.json({
//         message: "Logged out successfully"
//     });
// };

// export const refreshToken = (req, res) => {
//     const token = req.cookies.refreshToken;

//     if (!token) {
//         return res.status(401).json({
//             success: false,
//             message: "No refresh token! (ó﹏ò｡)"
//         })
//     }

//     try {
//         const decoded = jwt.verify(token, REFRESH_SECRET);

//         const newAccessToken = generateAccessToken({
//             user_id: decoded.user_id,
//             email: decoded.email,
//             role_id: decoded.role_id
//         });

//         return res.json({
//             success: true,
//             accessToken: newAccessToken
//         });
//     } catch(err){
//         return res.status(403).json({
//             success: false,
//             message: "Invalid refresh token! (; •́ᆺ•̀)"
//         });
//     }
// }
