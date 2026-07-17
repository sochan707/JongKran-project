import { addHistoryService, getUserHistoryService } from "../services/history.service.js";

export const addHistoryController = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { recipeId } = req.params;
        const history = await addHistoryService(userId,recipeId);

        return res.status(201).json({
            success: true,
            message: "Recipe added to history! ＼( ᵔ ω ᵔ )／",
            data: history
        });

    } catch(error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

export const getUserHistoryController = async (req, res) => {
    try {
        const userId = req.user.userId;
        const history = await getUserHistoryService(userId);

        return res.status(200).json({
            success: true,
            data: history
        });

    } catch(error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};