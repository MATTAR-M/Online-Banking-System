export const authorization = (roles = []) => {
    return async (req, res, next) => {
        const userRole = req.user.role || req.user.Role; 

        if (!roles.includes(userRole)) {
            throw new Error("UnAuthorized: You don't have permission", { cause: 403 }); 
        }
        
        next();
    }
}