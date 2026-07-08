import prisma from "../prismaClient.js";

export const addHistoryService = async (userId, recipeId) => {
    const history = await prisma.history.create({
        data: {
            user_id: userId,
            recipe_id: Number(recipeId)
        },
        include: {
            recipe: {
                select: {
                    recipe_id: true,
                    title: true,
                    image_url: true,
                    difficulty: true,
                    cook_time: true,
                    servings: true
                }
            }
        }
    });

    return history;
};