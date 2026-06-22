import prisma from "../prismaClient.js"

const registerUser = async () => {
    const user = await prisma.user.create({
        data : {
            user_name: "Test_user",
        },

    });
    return user;
};

export default {
    registerUser,
};