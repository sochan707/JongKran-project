export const buildAuthPayload = (user) => {
    return {
        userId: user.user_id,
        role: user.role.role_name
    };
};