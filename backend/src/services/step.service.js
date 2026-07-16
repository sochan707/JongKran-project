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

export const bulkAddRecipeStepsService = async (recipeId, steps, adminId) => {
  if (!Array.isArray(steps) || steps.length === 0) {
    const error = new Error(
      "Steps must be a non-empty array! ʕ•̀ᆺ•́ʔ"
    );
    error.statusCode = 400;
    throw error;
  }

  const normalizedSteps = steps.map((step, index) => {
    const stepNumber = Number(step.step_number);
    const instructionText =
      typeof step.instruction_text === "string"
        ? step.instruction_text.trim()
        : "";

    if (!Number.isInteger(stepNumber) || stepNumber <= 0) {
      const error = new Error(
        `Step number at position ${index + 1} must be a positive integer! ʕ•̀ᆺ•́ʔ`
      );
      error.statusCode = 400;
      throw error;
    }

    if (!instructionText) {
      const error = new Error(
        `Instruction at position ${index + 1} is required! ʕ•̀ᆺ•́ʔ`
      );
      error.statusCode = 400;
      throw error;
    }

    return {
      recipe_id: recipeId,
      step_number: stepNumber,
      instruction_text: instructionText,
    };
  });

  const stepNumbers = normalizedSteps.map(
    (step) => step.step_number
  );

  const uniqueStepNumbers = new Set(stepNumbers);

  if (uniqueStepNumbers.size !== stepNumbers.length) {
    const error = new Error(
      "The request contains duplicate step numbers! ʕ•̀ᆺ•́ʔ"
    );
    error.statusCode = 400;
    throw error;
  }

  return prisma.$transaction(async (tx) => {
    const recipe = await tx.recipe.findFirst({
      where: {
        recipe_id: recipeId,
        deleted_at: null,
      },
      select: {
        recipe_id: true,
      },
    });

    if (!recipe) {
      const error = new Error(
        "Recipe not found! ˏ(•́∧•̀)ˎ"
      );
      error.statusCode = 404;
      throw error;
    }

    const existingSteps = await tx.recipeStep.findMany({
      where: {
        recipe_id: recipeId,
        step_number: {
          in: stepNumbers,
        },
      },
      select: {
        step_number: true,
      },
    });

    if (existingSteps.length > 0) {
      const existingNumbers = existingSteps.map(
        (step) => step.step_number
      );

      const error = new Error(
        `Step numbers already exist: ${existingNumbers.join(", ")}`
      );
      error.statusCode = 409;
      throw error;
    }

    await tx.recipeStep.createMany({
      data: normalizedSteps,
    });

    await tx.logs_audit.create({
      data: {
        user_id: adminId,
        recipe_id: recipeId,
        action_type: "update",
      },
    });

    const addedSteps = await tx.recipeStep.findMany({
      where: {
        recipe_id: recipeId,
        step_number: {
          in: stepNumbers,
        },
      },
      orderBy: {
        step_number: "asc",
      },
    });

    return addedSteps;
  });
};