import authService, { logoutUser } from "../services/auth.service.js";
import jwt from "jsonwebtoken";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";
import { loginUser } from "../services/auth.service.js";
import prisma from "../prismaClient.js";

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

export const refreshTokenController = async (req, res) => {
    try{
        const {refreshToken} = req.body;

        if(!refreshToken){
            return res.status(401).json({
                message: "No refrest token provided! (ó﹏ò｡)"
            });
        }

        const storedToken = await prisma.refreshToken.findUnique({
            where: {token: refreshToken}
        });

        if(!storedToken){
            return res.status(401).json({message: "Invalid refresh token! ʕ•̀ᆺ•́ʔ"});
        }

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);

        const payload = {
            userId: decoded.userId,
            role: decoded.role
        };

        const newAccessToken = generateAccessToken(payload);
        const newRefreshToken = generateRefreshToken(payload);

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        await prisma.refreshToken.create({
            data: {
                token: newRefreshToken,
                user_id: payload.userId,
                expires_at: expiresAt
            }
        });

        await prisma.refreshToken.delete({
            where: {
                token: refreshToken
            }
        });

        return res.json({
            success: true,
            data: {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken
            }
        });

    } catch(err){
        return res.status(401).json({
            message: "Invalid or expired refresh token! (ó﹏ò｡)"
        });
    }
};

export const logoutController = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized! (; ･`д･´)"
            });
        }

        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({
                success: false,
                message: "No refresh token provided! (; •́ᆺ•̀)"
            });
        }

        // Delete this refresh token from DB
        await prisma.refreshToken.deleteMany({
            where: {
                token: refreshToken,
                user_id: req.user.userId
            }
        });

        return res.json({
            success: true,
            message: "Logged out successfully. ᕕ( ᐛ )ᕗ"
        });

    } catch (err) {
        console.error("Logout Error: ", err);
        return res.status(500).json({
            success: false,
            message: "Logout failed! (~T༚T~)"
        });
    }
};

// export const logoutController = async (req, res) => {
//     const {refreshToken} = req.body;
    
//     if (!refreshToken) {
//         return res.status(400).json({
//             success: false,
//             message: "No refresh token provided! (; •́ᆺ•̀)"
//         })
//     }

//     if(!req.user){
//         return res.status(401).json({
//             success: false,
//             message: "Unauthorized! (; ･`д･´)"
//         });
//     }

//     const deleted = await prisma.refreshToken.deleteMany({
//         where: {token: refreshToken}
//     });

    

//     const result = await logoutUser(req.user.userId);
//     return res.json(result);
// }

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
