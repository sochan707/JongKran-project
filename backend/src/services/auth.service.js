import prisma from "../prismaClient.js";
import bcrypt from "bcrypt";
import {generateAccessToken, generateRefreshToken} from "../utils/jwt.js";
import { buildAuthPayload } from "./token.service.js";

export const registerUser = async ({user_name, email, password }) => {
    try {
        const exitingAuth = await prisma.userAuth.findUnique({
            where: {email},
        });

        if(exitingAuth){
            return {
                success: false,
                message: "Email already exists (ó﹏ò｡)"
            };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                user_name,
                role_id: 2,
            }
        });

        await prisma.userAuth.create({
            data: {
                user_id: user.user_id,
                email,
                password_hash: hashedPassword,
            }
        });

        return {
            success: true,
            data: {
                user_id: user.user_id,
                user_name: user.user_name,
                email
            }
        };

    } catch(err){
        console.error("Register Error: ", err);

        return {
            success: false,
            message: "Internal server error! o(╥﹏╥)o"
        }
    }
};

export const loginUser = async ({email, password}) => {
    try{
        // const payload = buildAuthPayload(auth.user);

        const auth = await prisma.userAuth.findUnique({
            where: {email},
            include: {
                user: {
                    include: {
                        role: true
                    }
                }
            }
        });

        if (!auth) {
            return {
                success: false,
                message: "Invalid email or password! (; •́ᆺ•̀)"
            };
        }

        const isMatch = await bcrypt.compare(password, auth.password_hash);

        if(!isMatch) {
            return{
                success: false,
                message: "Invalid email or password"
            };
        }

        const payload = {
            userId: auth.user.user_id,
            role: auth.user.role.role_name,
            email: auth.email
        };

        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        await prisma.refreshToken.create({
            data: {
                token: refreshToken,
                user_id: payload.userId,
                expires_at: expiresAt
            }
        });

        return {
            success: true,
            data: {
                user: payload,
                accessToken,
                refreshToken
            },
        };

    } catch(err){
        console.error("Login Error: ", err);

        return{
            success: false,
            message: "Internal server error! o(╥﹏╥)o"
        }
    }
}

export const logoutUser = async (userId) => {
    try {
        if (refreshToken) {
            await prisma.refreshToken.deleteMany({
                where: {
                    token: refreshToken,
                    user_id: userId
                }
            });
        }

        return {
            success: true,
            message: "Logged out successfully. ᕕ( ᐛ )ᕗ"
        }

    } catch(err) {
        console.error("Logout Service Error: ", err);
        return {
            success: false,
            message: "Logout failed! (~T༚T~)"
        }
    }
}

export default {
    registerUser,
    loginUser,
    logoutUser
};