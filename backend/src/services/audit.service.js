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

export const getAllAuditLogsService = async () => {
  const auditLogs = await prisma.logs_audit.findMany({
    orderBy: {
      action_timestamp: "desc",
    },
    include: {
      users: {
        select: {
          user_id: true,
          user_name: true,
        },
      },
      recipe: {
        select: {
          recipe_id: true,
          title: true,
        },
      },
      suggestion: {
        select: {
          suggestion_id: true,
          suggestion_text: true,
          status: true,
          deleted_at: true,
        },
      },
    },
  });

  return auditLogs;
};