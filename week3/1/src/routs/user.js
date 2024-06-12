import { Router } from "express";
const router = Router();
import userMiddleware from "../middleware/user";
import { User, Course } from "../db";

// User Routes
router.post('/signup', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const user = await User.findOne({
        username: username
    });

    if (user) {
        res.status(403).json({ msg: "User already exists" });
    } else {
        User.create({
            username,
            password
        });
    }
});

router.get('/courses', async (req, res) => {
    const response = await Course.find({});

    res.json({
        courses: response
    });
});

router.post('/courses/:courseId', userMiddleware, async (req, res) => {
    const username = req.headers.username;
    const courseId = req.params.courseId;

    await User.updateOne({
        username: username
    }, {
        "$push": {
            purchasedCourses: courseId
        }
    });

    res.json({
        message: "Purchase complete!"
    });
});

router.get('/purchasedCourses', userMiddleware, async (req, res) => {
    const username = req.headers.username;

    const user = await User.findOne({
        username: username
    });

    const courses = await Course.find({
        _id: {
            "$in": user.purchasedCourses
        }
    });

    res.json({
        courses: courses
    });
});

module.exports = router;