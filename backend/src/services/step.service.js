import prisma from "../prismaClient.js";

export const addRecipeStepService = async (recipeId, data) => {

    const {step_number, instruction_text } = data;

    if (!step_number || !instruction_text) {
        throw new Error("Step number and instruction are required");
    }

    const step = await prisma.recipeStep.create({
        data: {
            recipe_id: Number(recipeId),
            step_number,
            instruction_text
        }
    });

    return step;
};