"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
console.log('Router loaded');
//testing route
router.get("/test", (req, res, next) => {
    res.status(200).json({
        success: true,
        message: "Api test route tested",
    });
    // return res.send("u")
});
router.use("/v1", require("./v1"));
module.exports = router;
