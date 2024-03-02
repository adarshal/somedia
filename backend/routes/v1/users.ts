import express, { NextFunction, Request, Response } from "express";
// Importing the necessary controllers and middleware
import { activateUser, signup, signin, logout, updateAccessToken, socialAuth, updateUserInfo, updatePassword, updateProfilePic, getUser } from "../../controllers/userController";
import { isAuthenticated } from "../../middleware/auth";

// Creating a new router instance
const router = express.Router();

// Logging a message to the console to indicate that the user router has been loaded
console.log('user Router loaded');

// Testing route to check if the user router is working properly
router.get("/a", (req: Request, res: Response, next: NextFunction) => {
    // Returning a success message and status code
    res.status(200).json({
        success: true,
        message: "user router tested",
    });
});

// Route for signing up a new user
router.post("/signup", signup);

// Route for signing in an existing user
router.post("/signin", signin);
router.post("/socialauth", socialAuth);

// Route for activating a user's account
router.post("/activate-user", activateUser);

// Route for logging out a user
router.get("/logout", isAuthenticated, logout);
router.get("/refreshtoken", isAuthenticated,updateAccessToken);
router.get("/me", isAuthenticated,getUser);
router.put("/update-userinfo", isAuthenticated,updateUserInfo);
router.put("/update-userpassword", isAuthenticated,updatePassword);
router.put("/update-avatar", isAuthenticated,updateProfilePic);

// Exporting the router module
module.exports = router;