import { addRecipeStepService, bulkAddRecipeStepsService, updateRecipeStepService } from "../services/step.service.js";

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

export const bulkAddRecipeStepsController = async (req, res) => {
  try {
    const recipeId = Number(req.params.id);
    const adminId = req.user.userId;
    const { steps } = req.body;

    if (!Number.isInteger(recipeId) || recipeId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Recipe ID must be a valid number! ʕ•̀ᆺ•́ʔ",
      });
    }

    const addedSteps = await bulkAddRecipeStepsService(
      recipeId,
      steps,
      adminId
    );

    return res.status(201).json({
      success: true,
      message: "Recipe steps added successfully! ᕕ( ᐛ )ᕗ",
      count: addedSteps.length,
      data: addedSteps,
    });
  } catch (error) {
    console.error("BULK ADD RECIPE STEPS ERROR:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message:
        error.message ||
        "Failed to add recipe steps! o(╥﹏╥)o",
    });
  }
};

export const updateRecipeStepController = async (req, res) => {
  try {
    const recipeId = Number(req.params.recipeId);
    const currentStepNumber = Number(req.params.stepNumber);
    const adminId = req.user.userId;

    if (!Number.isInteger(recipeId) || recipeId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Recipe ID must be a valid number! ʕ•̀ᆺ•́ʔ",
      });
    }

    if (
      !Number.isInteger(currentStepNumber) ||
      currentStepNumber <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Current step number must be valid! ʕ•̀ᆺ•́ʔ",
      });
    }

    const updateData = {};

    if (
      Object.prototype.hasOwnProperty.call(
        req.body,
        "step_number"
      )
    ) {
      updateData.step_number = req.body.step_number;
    }

    if (
      Object.prototype.hasOwnProperty.call(
        req.body,
        "instruction_text"
      )
    ) {
      updateData.instruction_text =
        req.body.instruction_text;
    }

    const updatedStep = await updateRecipeStepService(
      recipeId,
      currentStepNumber,
      updateData,
      adminId
    );

    return res.status(200).json({
      success: true,
      message: "Recipe step updated successfully! ᕕ( ᐛ )ᕗ",
      data: updatedStep,
    });
  } catch (error) {
    console.error("UPDATE RECIPE STEP ERROR:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message:
        error.message ||
        "Failed to update recipe step! o(╥﹏╥)o",
    });
  }
};