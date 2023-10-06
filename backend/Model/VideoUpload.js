// Import required modules
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { Sequelize, DataTypes } from 'sequelize';

// Initialize Express app
const app = express();
app.use(cors({
    // ... cors configuration
}));
app.use(cookieParser());

// Load environment variables
dotenv.config();

// Set up Sequelize and define UserModel
const sequelize = new Sequelize({
    dialect: 'mysql',
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    logging: false,//This will pause the regular Message on executing the frontend so that backend doesn't get too much busy 
    /* 
    Executing (default): SELECT `id`,
     `userId`, `title`, `description`,
      `file`, `postedby`, `createdAt`,
       `updatedAt` FROM `posts` 
        AS `posts`;
    This is the messege that is showing every render from the front end and it is too much annoying when you use the useEffect for the re-rendering
        */
});
const VideoUploadModel = sequelize.define('VideoUpload', {
    vid: {
        type: DataTypes.INTEGER,
        unique: true,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            len: {
                args: [0, 300],
                msg: 'Description must be between 0 and 300 characters'
            }
        }
    },
    userId: {
        type: DataTypes.INTEGER,
    },
    username: {
        type: DataTypes.STRING,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    file: {
        type: DataTypes.STRING,
        allowNull: false
    },
    profile: {
        type: DataTypes.STRING,
        allowNull: true
    },
})

sequelize.sync({ force: false }) // This will create the table if it doesn't exist and if exists then delete the old one and then create hance we use false in place of true so make it ture for the first run and then turn to false
    .then(() => {
        console.log('\nVideo Tables synchronized\n');
    })
    .catch(error => {
        console.error('\nError synchronizing tables:', error, "\n\n");
    });
export default VideoUploadModel