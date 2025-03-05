import { redisClient } from "./signin.js";

export const requireAuth = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json("Unauthorized");
    }

    const reply = await redisClient.get(authorization);
    if (!reply) {
        return res.status(401).json("Unauthorized");
    }
    console.log("you shall pass");

    return next();
};
