"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// Importing the necessary controllers and middleware
const userController_1 = require("../../controllers/userController");
const auth_1 = require("../../middleware/auth");
// Creating a new router instance
const router = express_1.default.Router();
// Logging a message to the console to indicate that the user router has been loaded
console.log('user Router loaded');
// Testing route to check if the user router is working properly
router.get("/a", (req, res, next) => {
    // Returning a success message and status code
    res.status(200).json({
        success: true,
        message: "user router tested",
    });
});
// Route for signing up a new user
router.post("/signup", userController_1.signup);
// Route for signing in an existing user
router.post("/signin", userController_1.signin);
router.post("/socialauth", userController_1.socialAuth);
// Route for activating a user's account
router.post("/activate-user", userController_1.activateUser);
// Route for logging out a user
router.get("/logout", auth_1.isAuthenticated, userController_1.logout);
router.get("/refreshtoken", auth_1.isAuthenticated, userController_1.updateAccessToken);
router.get("/me", auth_1.isAuthenticated, userController_1.getUser);
router.put("/update-userinfo", auth_1.isAuthenticated, userController_1.updateUserInfo);
router.put("/update-userpassword", auth_1.isAuthenticated, userController_1.updatePassword);
router.put("/update-avatar", auth_1.isAuthenticated, userController_1.updateProfilePic);
// Exporting the router module
module.exports = router;
