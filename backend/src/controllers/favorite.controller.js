import { toggleFavoriteService } from "../services/favorite.service.js";

export const toggleFavoriteController = async (req, res) => {
    try {
        const userId = req.user.userId;
        const {recipeId} = req.params;
        const result = await toggleFavoriteService(userId,recipeId);

        return res.status(200).json({
            success: true,
            ...result
        });

    } catch(error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};