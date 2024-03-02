"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redis = void 0;
const ioredis_1 = require("ioredis");
const redisClient = () => {
    if (process.env.REDIS_URL) {
        console.log("redis connected");
        return (process.env.REDIS_URL);
    }
    else {
        throw new Error("Redis connection failed");
        // const redis = require('redis');
        // const client  = redis.createClient();
        // // If you'd like to select a database just use the 'select' command
        // // client.select(15);
        // // To handle any errors that happen while connecting, listening or writing data
        // client.on("error", (err) => console.log("Error " + err));
        // return client;
    }
};
exports.redis = new ioredis_1.Redis(redisClient());
