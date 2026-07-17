import { getAllAuditLogsService } from "../services/audit.service.js";

export const getAllAuditLogsController = async (req, res) => {
  try {
    const auditLogs = await getAllAuditLogsService();

    return res.status(200).json({
      success: true,
      count: auditLogs.length,
      data: auditLogs,
    });
  } catch (error) {
    console.error("GET ALL AUDIT LOGS ERROR:", error);

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to get audit logs! o(╥﹏╥)o",
    });
  }
};