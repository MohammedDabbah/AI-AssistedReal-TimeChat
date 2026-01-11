import { connect } from "mongoose";
import { ENV } from "./env";

export const connectDB = async (): Promise<void> => {
    try {
        const con = await connect(ENV.MONGO_URI);
        console.log(`MongoDB connection: ${con.connection.host}`);
    } catch (err: any) {
        console.error(`MongoDB connection error: ${(err as Error).message}`);
    }
};