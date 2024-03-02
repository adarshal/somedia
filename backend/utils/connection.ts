import { connect } from "mongoose";
const mongoose=require('mongoose');

export const connectToDB=async () => {
    mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB Connection Successfull!"))
  .catch((err:any) => {
    console.log(err);
    throw new Error(err)
  });
}