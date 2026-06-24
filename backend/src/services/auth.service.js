import prisma from "../prismaClient.js";


export const registerUser = async () => {
    try {
        const user = await prisma.User.create({
            data : {
                user_name: "TestUser1",
                role: {
                    connect: {role_id: 2}
                }
            },

        });
        console.log("User created: ", user);
    } catch (err) {
        console.log("Error creating user: ", err);
    } finally {
        await prisma.$disconnect();
    }
    
    return user;
};

export default {
    registerUser,
};