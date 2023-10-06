// const mongoose = require('mongoose')
// const express = require('express')
// const router = express.Router()

// const db = 'mongodb://127.0.0.1:27017/YT_Clone'

// mongoose.Promise = global.Promise;

// mongoose.connect(db, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// })
//     .then(() => {
//         console.log("Connection Successfull")
//     })
//     .catch((err) => {
//         console.log("Error : ", err)
//     })

// module.exports = router

// import express from "express";
// import { model } from "mongoose";
// import { createConnection } from "mongoose";
import mysql from 'mysql2'

const db = mysql.createConnection({
    database: process.env.DATABASE,
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS
})

const port = process.env.PORT || 8090

export default db