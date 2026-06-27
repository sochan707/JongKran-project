import prisma from "../prismaClient.js";
import bcrypt from "bcrypt";

export const registerUser = async ({user_name, email, password }) => {
    try {
        const exitingAuth = await prisma.userAuth.findUnique({
            where: {email},
        });

        if(exitingAuth){
            return {
                success: false,
                message: "Email already exists :)"
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
            message: "Internal server error :("
        }
    }
};



export default {
    registerUser,
};