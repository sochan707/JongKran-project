import {registerUser} from "../services/auth.service.js";

export const register = async (req, res) => {
    const {user_name} = req.body;
    const user = await registerUser({user_name});
    res.json(user);
};