import dotenv from "dotenv";
dotenv.config({ path: ".env" });
import process from "process";
import app from "./config/app";
import { connectToDatabase } from "./config/database";

const startServer = async () => {
  const port = process.env.PORT || 3000;
  try {
    await connectToDatabase();
    app.listen(port, (): void => {
      console.log(`Connected successfully on port ${port}`);
    });
  } catch (error: any) {
    console.error(`Error occured: ${error.message}`);
  }
};

startServer();
