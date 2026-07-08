import prisma from "../prismaClient.js";

export const toggleFavoriteService = async (userId, recipeId) => {
    const existingFavorite = await prisma.favorite.findUnique({
        where: {
            user_id_recipe_id: {
                user_id: userId,
                recipe_id: Number(recipeId)
            }
        }
    });

    if (existingFavorite) {
        await prisma.favorite.delete({
            where: {
                favorite_id: existingFavorite.favorite_id
            }
        });

        return {
            action: "removed",
            message: "Recipe removed from favorites! ᕕ( ᐛ )ᕗ"
        };
    }

    const favorite = await prisma.favorite.create({
        data: {
            user_id: userId,
            recipe_id: Number(recipeId)
        },
        include: {
            recipe: {
                select: {
                    title: true,
                    image_url: true
                }
            }
        }
    });

    return {
        action: "added",
        message: "Recipe added to favorites! ʕ•̀ᆺ•́ʔ",
        data: favorite
    };
};