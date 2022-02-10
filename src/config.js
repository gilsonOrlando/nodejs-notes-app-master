// 
import { config } from "dotenv";
config();

const configurations = {
  PORT: process.env.PORT || 4000,
  MONGODB_HOST: process.env.MONGODB_HOST || "mongo",
  MONGODB_DATABASE: process.env.MONGODB_DB || "notes-app",
  MONGODB_URI: `mongodb://${process.env.MONGODB_HOST}/${process.env.MONGODB_DATABASE || "notes-app"}`,
};

export default configurations;
 //|| agregar "localhost"
