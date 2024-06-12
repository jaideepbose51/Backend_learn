import { Router } from "express";
import adminMiddleware from "../middleware/admin";
import {Admin, Course} from "../db"
const router = Router();

// Admin Routes
router.post('/signup', async(req, res) => {
    // Implement admin signup logic
    const username =req.body.username;
    const password=req.body.password;

    const user=await Admin.findOne({
        username
    });
    if(user){
        return res.status(403).json({msg:"Admin already exists "});
    } else {
        await Admin.create({
            username: username,
            password: password
        })
    
        res.json({
            message: 'Admin created successfully'
        })
    }
});

router.post('/courses', adminMiddleware,async (req, res) => {
    // Implement course creation logic
    const title = req.body.title;
    const description = req.body.description;
    const imageLink = req.body.imageLink;
    const price = req.body.price;
    // zod
    const newCourse = await Course.create({
        title,
        description,
        imageLink,
        price
    })

    res.json({
        message: 'Course created successfully', courseId: newCourse._id
    })
});

router.get('/courses', adminMiddleware,async (req, res) => {
    // Implement fetching all courses logic
    const response = await Course.find({});

    res.json({
        courses: response
    })

});

module.exports = router;