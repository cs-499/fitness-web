import "dotenv/config";
import mongoose from "mongoose";

// Connect to MongoDB
export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_ENDPOINT, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB successfully.");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
};




// import "dotenv/config";
// import mongoose from 'mongoose';

// export const connectDB = async () => {
//     try {
//         await mongoose.connect(process.env.MONGODB_ENDPOINT, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//         });
//     } catch (error) {
//         console.error(error);
//         process.exit(1);
//     }}