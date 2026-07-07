import { addRecipeStepService } from "../services/step.service.js";

export const addRecipeStepController = async (req, res) => {
    try {
        const { id } = req.params;

        const step = await addRecipeStepService(id, req.body);

        return res.status(201).json({
            success: true,
            message: "Recipe step added successfully! ᕕ( ᐛ )ᕗ",
            data: step,
        });

    } catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message,
        });
    }
};