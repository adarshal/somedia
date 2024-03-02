"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const connection_1 = require("./utils/connection");
require('dotenv').config();
// cloudinary config
const cloudinary_1 = require("cloudinary");
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY
});
app_1.app.listen(process.env.PORT, () => {
    console.log('server connected to ', process.env.PORT);
    (0, connection_1.connectToDB)();
});
