export const authorize = (allowedRoles = []) => {
    return (req, res, next) => {
        try {
            if(!req.user) {
                return res.status(401).json({
                    message: "Unauthorized! ʕ•̀ᆺ•́ʔ"
                });
            }

            const userRole = req.user.role;

            if (!allowedRoles.includes(userRole)){
                return res.status(403).json({
                    message: "Forbidden: insufficient permissions! ʕ•̀ᆺ•́ʔ"
                });
            }

            next();
        } catch(err){
            return res.status(500).json({
                message: "RBAC Error! o(╥﹏╥)o"
            });
        }
    }
}