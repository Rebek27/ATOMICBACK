import dotenv from "dotenv";
dotenv.config();
export default {
    HOST: process.env.HOST || 'localhost',
    PORT: process.env.PORT || 3020,
    API_URL: process.env.API_URL || '/atom',
    CONNECTION_STRING: process.env.CONNECTION_STRING || 'mongodb+srv://yvfeacostaca:<db_password>@ecommerce.5llrj.mongodb.net/?retryWrites=true&w=majority&appName=eCommerce',
    DATABASE: process.env.DATABASE || 'db_atomic',
    DB_PASSWORD: process.env.DB_PASSWORD || 'adminPerron189',
    DB_USER: process.env.DB_USER || 'yvfeacostaca',
    JWT_SECRET: process.env.JWT_SECRET,
}