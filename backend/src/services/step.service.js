import prisma from "../prismaClient.js";

export const addRecipeStepService = async (recipeId, data, adminId) => {
  const normalizedRecipeId = Number(recipeId);
  const stepNumber = Number(data.step_number);

  const instructionText =
    typeof data.instruction_text === "string"
      ? data.instruction_text.trim()
      : "";

  if (!Number.isInteger(normalizedRecipeId) || normalizedRecipeId <= 0) {
    const error = new Error("Recipe ID must be a valid number! ʕ•̀ᆺ•́ʔ");
    error.statusCode = 400;
    throw error;
  }

  if (!Number.isInteger(stepNumber) || stepNumber <= 0) {
    const error = new Error("Step number must be a positive integer! ʕ•̀ᆺ•́ʔ");
    error.statusCode = 400;
    throw error;
  }

  if (!instructionText) {
    const error = new Error("Instruction is required! ʕ•̀ᆺ•́ʔ");
    error.statusCode = 400;
    throw error;
  }

  return prisma.$transaction(async (tx) => {
    const recipe = await tx.recipe.findFirst({
      where: {
        recipe_id: normalizedRecipeId,
        deleted_at: null,
      },
      select: {
        recipe_id: true,
      },
    });

    if (!recipe) {
      const error = new Error("Recipe not found! ˏ(•́∧•̀)ˎ");
      error.statusCode = 404;
      throw error;
    }

    const existingStep = await tx.recipeStep.findUnique({
      where: {
        recipe_id_step_number: {
          recipe_id: normalizedRecipeId,
          step_number: stepNumber,
        },
      },
      select: {
        step_number: true,
      },
    });

    if (existingStep) {
      const error = new Error(`Step number ${stepNumber} already exists in this recipe! ʕ•̀ᆺ•́ʔ`);
      error.statusCode = 409;
      throw error;
    }

    const step = await tx.recipeStep.create({
      data: {
        recipe_id: normalizedRecipeId,
        step_number: stepNumber,
        instruction_text: instructionText,
      },
    });

    await tx.logs_audit.create({
      data: {
        user_id: adminId,
        recipe_id: normalizedRecipeId,
        action_type: "update",
      },
    });

    return step;
  });
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

export const updateRecipeStepService = async (recipeId, currentStepNumber, data, adminId) => {
  const normalizedRecipeId = Number(recipeId);
  const normalizedCurrentStepNumber = Number(currentStepNumber);

  const hasStepNumber = Object.prototype.hasOwnProperty.call(data, "step_number");

  const hasInstructionText = Object.prototype.hasOwnProperty.call(data, "instruction_text");

  if (!hasStepNumber && !hasInstructionText) {
    const error = new Error(
      "Step number or instruction is required! ʕ•̀ᆺ•́ʔ"
    );
    error.statusCode = 400;
    throw error;
  }

  const updateData = {};

  if (hasStepNumber) {
    const newStepNumber = Number(data.step_number);

    if (!Number.isInteger(newStepNumber) || newStepNumber <= 0) {
      const error = new Error(
        "Step number must be a positive integer! ʕ•̀ᆺ•́ʔ"
      );
      error.statusCode = 400;
      throw error;
    }

    updateData.step_number = newStepNumber;
  }

  if (hasInstructionText) {
    const instructionText =
      typeof data.instruction_text === "string"
        ? data.instruction_text.trim()
        : "";

    if (!instructionText) {
      const error = new Error(
        "Instruction cannot be blank! ʕ•̀ᆺ•́ʔ"
      );
      error.statusCode = 400;
      throw error;
    }

    updateData.instruction_text = instructionText;
  }

  return prisma.$transaction(async (tx) => {
    const recipe = await tx.recipe.findFirst({
      where: {
        recipe_id: normalizedRecipeId,
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

    const existingStep = await tx.recipeStep.findUnique({
      where: {
        recipe_id_step_number: {
          recipe_id: normalizedRecipeId,
          step_number: normalizedCurrentStepNumber,
        },
      },
    });

    if (!existingStep) {
      const error = new Error(
        "Recipe step not found! ˏ(•́∧•̀)ˎ"
      );
      error.statusCode = 404;
      throw error;
    }

    if (
      hasStepNumber &&
      updateData.step_number !== normalizedCurrentStepNumber
    ) {
      const duplicateStep = await tx.recipeStep.findUnique({
        where: {
          recipe_id_step_number: {
            recipe_id: normalizedRecipeId,
            step_number: updateData.step_number,
          },
        },
        select: {
          step_number: true,
        },
      });

      if (duplicateStep) {
        const error = new Error(
          `Step number ${updateData.step_number} already exists in this recipe! ʕ•̀ᆺ•́ʔ`
        );
        error.statusCode = 409;
        throw error;
      }
    }

    const updatedStep = await tx.recipeStep.update({
      where: {
        recipe_id_step_number: {
          recipe_id: normalizedRecipeId,
          step_number: normalizedCurrentStepNumber,
        },
      },
      data: updateData,
    });

    await tx.logs_audit.create({
      data: {
        user_id: adminId,
        recipe_id: normalizedRecipeId,
        action_type: "update",
      },
    });

    return updatedStep;
  });
};

export const removeRecipeStepService = async (recipeId, stepNumber, adminId) => {
  const normalizedRecipeId = Number(recipeId);
  const normalizedStepNumber = Number(stepNumber);

  return prisma.$transaction(async (tx) => {
    const recipe = await tx.recipe.findFirst({
      where: {
        recipe_id: normalizedRecipeId,
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

    const recipeStep = await tx.recipeStep.findUnique({
      where: {
        recipe_id_step_number: {
          recipe_id: normalizedRecipeId,
          step_number: normalizedStepNumber,
        },
      },
    });

    if (!recipeStep) {
      const error = new Error(
        "Recipe step not found! ˏ(•́∧•̀)ˎ"
      );
      error.statusCode = 404;
      throw error;
    }

    await tx.recipeStep.delete({
      where: {
        recipe_id_step_number: {
          recipe_id: normalizedRecipeId,
          step_number: normalizedStepNumber,
        },
      },
    });

    await tx.logs_audit.create({
      data: {
        user_id: adminId,
        recipe_id: normalizedRecipeId,
        action_type: "update",
      },
    });

    return recipeStep;
  });
};