import authService from "../services/auth.service.js";

export const register = async (req, res) => {
    const result = await authService.registerUser(req.body);

    if(!result.success){
        return res.status(400).json(result);
    }

    return res.status(201).json(result);
};