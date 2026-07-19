import authService, { logoutUser } from "../services/auth.service.js";
import jwt from "jsonwebtoken";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";
import { loginUser } from "../services/auth.service.js";
import prisma from "../prismaClient.js";
import { uploadImageToCloudinaryService } from "../services/cloudinary.service.js";

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

const profileResponse = (user) => ({
    user_id: user.user_id,
    username: user.user_name,
    email: user.auth.email,
    gender: user.gender,
    dob: user.dob ? user.dob.toISOString().slice(0, 10) : null,
    bio: user.bio,
    profileImage: user.user_profile,
    memberSince: user.auth.created_at,
});

export const getProfile = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { user_id: req.user.userId },
            include: { auth: true },
        });

        if (!user?.auth) {
            return res.status(404).json({ success: false, message: "User profile not found." });
        }

        return res.json({ success: true, data: profileResponse(user) });
    } catch (error) {
        console.error("GET PROFILE ERROR:", error);
        return res.status(500).json({ success: false, message: "Could not load your profile." });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const username = String(req.body.username || "").trim();
        const email = String(req.body.email || "").trim().toLowerCase();
        const bio = String(req.body.bio || "").trim() || null;
        const gender = String(req.body.gender || "").trim() || null;
        const dob = req.body.dob ? new Date(`${req.body.dob}T00:00:00.000Z`) : null;

        if (!username || username.length > 25) {
            return res.status(400).json({ success: false, message: "Username must be between 1 and 25 characters." });
        }
        if (!email || email.length > 40) {
            return res.status(400).json({ success: false, message: "Please enter a valid email address." });
        }
        if (bio && bio.length > 100) {
            return res.status(400).json({ success: false, message: "Bio must not exceed 100 characters." });
        }
        if (gender && gender.length > 10) {
            return res.status(400).json({ success: false, message: "Gender must not exceed 10 characters." });
        }
        if (dob && (Number.isNaN(dob.getTime()) || dob > new Date())) {
            return res.status(400).json({ success: false, message: "Please select a valid date of birth." });
        }

        let profileImage;
        if (req.file) {
            const uploaded = await uploadImageToCloudinaryService(req.file.buffer, "jongkran/profiles");
            profileImage = uploaded.image_url;
        } else if (req.body.removeImage === "true") {
            profileImage = null;
        }

        const user = await prisma.$transaction(async (tx) => {
            await tx.user.update({
                where: { user_id: req.user.userId },
                data: {
                    user_name: username,
                    bio,
                    gender,
                    dob,
                    ...(profileImage !== undefined && { user_profile: profileImage }),
                },
            });
            await tx.userAuth.update({
                where: { user_id: req.user.userId },
                data: { email },
            });
            return tx.user.findUnique({
                where: { user_id: req.user.userId },
                include: { auth: true },
            });
        });

        return res.json({ success: true, message: "Profile updated successfully.", data: profileResponse(user) });
    } catch (error) {
        console.error("UPDATE PROFILE ERROR:", error);
        const duplicateEmail = error?.code === "P2002";
        return res.status(duplicateEmail ? 409 : 500).json({
            success: false,
            message: duplicateEmail ? "Email is already in use." : "Could not update your profile.",
        });
    }
};

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
