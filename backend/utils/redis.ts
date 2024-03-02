import { Redis } from "ioredis";

const redisClient=()=>{
  
    if(process.env.REDIS_URL){
        console.log("redis connected");
        
        return (process.env.REDIS_URL);
        }else{

              throw new Error("Redis connection failed");
            // const redis = require('redis');
            // const client  = redis.createClient();
            // // If you'd like to select a database just use the 'select' command
            // // client.select(15);
            // // To handle any errors that happen while connecting, listening or writing data
            // client.on("error", (err) => console.log("Error " + err));
            // return client;
            }
}


export const redis=new Redis(redisClient());

    