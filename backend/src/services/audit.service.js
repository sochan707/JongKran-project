import prisma from "../prismaClient.js";

export const createAuditLogService = async ({userId, recipeId = null, suggestionId = null, actionType}) => {
  const auditLog = await prisma.logs_audit.create({
    data: {
      user_id: userId,
      recipe_id: recipeId,
      suggestion_id: suggestionId,
      action_type: actionType,
    },
  });

  return auditLog;
};