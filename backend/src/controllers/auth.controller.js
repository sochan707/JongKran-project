import authService from "../services/auth.service.js";

export const register = async (req, res) => {
    const result = await authService.registerUser();

    res.json({
        message: result,
    });
};