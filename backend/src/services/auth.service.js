import prisma from "../prismaClient.js";
import bcrypt from "bcrypt";

export const registerUser = async ({user_name, email, password }) => {
    const hashed = await bcrypt.hash(password,10);

    return await prisma.user.create({
        data: {
            user_name,
            role_id: 2,

            auth: { // when create user, it will automatically create auth
                create: {
                    email,
                    password_hash: hashed,
                },
            },
        },
        include: {
            auth: true,
        },
    });
    
};

export default {
    registerUser,
};