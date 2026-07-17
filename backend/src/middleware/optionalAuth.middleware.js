import jwt from "jsonwebtoken";
import prisma from "../prismaClient.js";

export const optionalAuthenticate = async (req, res, next) => {
    try{
        const authHeader = req.headers.authorization;

        if(!authHeader || !authHeader.startsWith("Bearer ")) {
            return next();
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const user = await prisma.user.findUnique({
            where: {
                user_id: decoded.userId,
            },
            include: {
                role: true,
            },
        });

        if (user) {
            req.user = {
                userId: user.user_id,
                role: user.role.role_name,
            };
        }

        next();

    } catch(err){
        next();
    }
};