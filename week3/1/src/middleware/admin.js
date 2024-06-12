import { Admin } from "../db";

const adminMiddleware = async (req, res, next) => {
    const username = req.headers['username'];
    const password = req.headers['password'];

    const user = await Admin.findOne({
        username: username,
        password: password
    });

    if (user) {
        next();
    } else {
        return res.status(403).json({ msg: "User not authenticated" });
    }
}

module.exports = adminMiddleware;