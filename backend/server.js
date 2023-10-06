import express from 'express';
import bodyParser from 'body-parser';
import mysql from 'mysql2'
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import UserModel from './Model/UserModel.js';
import LikeComment from './Model/LikesandCommentsModel.js';
import VideoUpload from './Model/VideoUpload.js';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import { Op, where } from 'sequelize'
import multer from 'multer'
import path from 'path'

const app = express()
app.use(express.json());
app.use(cookieParser()); // Add cookie parser middleware if you intend to use cookies
app.use(express.static('Public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
dotenv.config();


const db = mysql.createConnection({
    database: process.env.DATABASE,
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS
})

const port = process.env.PORT || 8090

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'Public/Files')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-_-" + Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({
    storage: storage
})

app.use(cors({
    origin: ['http://localhost:3022','https://mern-youtube-clone-app.onrender.com'], // Replace with your client's URL
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    credentials: true
}));


app.get('/home', function (req, res) {
    const sql = 'SELECT * from usermodels'
    db.query(sql, (err, data) => {
        if (err) {
            console.log(err)
        } else {
            console.log(data)
            return res.json(data)
        }
    })
});

/* Login Process */
app.post('/login', async function (req, res) {
    const email = req.body.email;
    const password = req.body.password;

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/;
    const emailRegex = /^[a-zA-Z0-9]+@[a-zA-Z]+\.[a-zA-Z]{2,6}$/;

    console.log(email, password);

    if (!email.match(emailRegex)) {
        return res.json({ msg: "Invalid email format", msg_type: 'error' });
    }
    if (!password.match(passwordRegex)) {
        return res.json({ msg: "Password must have at least 1 capital letter, 1 small letter, 1 number, and 1 special character", msg_type: 'error' });
    }
    try {
        const data = await UserModel.findOne({ where: { email: email } });
        console.log("User Data is :-> ", data) //As the above method directly shows the final single person data hence we don't need the array method to access the data
        if (!data) {
            return res.json({ msg: "Email Doesn't Exist. Please Register First.", msg_type: "error" });
        }

        const findout = bcrypt.compare(password, data.password);

        if (!findout) {
            return res.json({ msg: "Password Didn't Match. Please try again!", msg_type: "error" });
        }
        else {
            const token = jwt.sign({ id: data.id, username: data.name, email: data.email, file: data.file }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.EXPIRES_IN });
            res.cookie('token', token);

            console.log("Token generated -> ", token, "\nWith email : ", data.email, data.id, data.file)
            return res.json({ msg: "Login Successfully . . .", msg_type: "good" });
        }
    } catch (err) {
        console.error(err);
        return res.json(err);
    }
});

/* Login Process */

/* Registration Process */

app.post('/register/:name/:email/:phone/:password/:cpassword', upload.single('file'), async function (req, res) {
    console.log("Registration Call");
    const { name, email, phone, password, cpassword } = req.params;
    // const formdata = req.formData
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/;
    const emailRegex = /^[a-zA-Z0-9]+@[a-zA-Z]+\.[a-zA-Z]{2,6}$/;

    console.log(name, email, password, cpassword, phone);

    if (!email.match(emailRegex)) {
        return res.json({ msg: "Invalid email format", msg_type: 'error' });
    }

    if (!password.match(passwordRegex)) {
        return res.json({ msg: "Password must have at least 1 capital letter, 1 small letter, 1 number, and 1 special character", msg_type: 'error' });
    }

    if (!cpassword.match(passwordRegex)) {
        return res.json({ msg: "Confirm Password must have at least 1 capital letter, 1 small letter, 1 number, and 1 special character", msg_type: 'error' });
    }

    if (cpassword !== password) {
        return res.json({ msg: "Password and confirm password didn't Match", msg_type: 'error' });
    }
    // const totalCount = UserModel.count({});
    // console.log(`Total number of users: ${totalCount}`);
    console.log("Checking Email")
    try {
        const existingUser = await UserModel.findOne({
            where: {
                [Op.or]: [{ email: email }, { phone: phone }]
            }
        });

        if (existingUser) {
            return res.json({ msg: "Information Already Exists. Please Register with another one.", msg_type: "error" });
        }

        const hash = await bcrypt.hash(password, 10);
        UserModel.create({ name: name, email: email, password: hash, phone: phone, file: req.file.filename })
            .then(result => {
                console.log(result)
                return res.json({ msg: "Registered Successfuly . . .", msg_type: 'good' })
            })
            .catch(err => {
                return res.json({ msg: 'Uploading Error . . . ', msg_type: 'error' })
            })
    } catch (err) {
        console.error(err);
        return res.json(err);
    }
});

/* Registration Process */

/* Loggedin or not Process */

const verifyUser = (req, res, next) => {
    const token = req.cookies.token
    // console.log("Token user login chk -> ", token,)
    if (!token) {
        return res.json({ msg: 'Please Login First . . .', msg_type: 'error' })
    }
    else {
        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.json("Token Not Valid")
            }
            else {
                req.email = decoded.email;
                req.username = decoded.username
                req.userId = decoded.id
                req.file = decoded.file
                // console.log(req.email, " ", req.username, " ", req.userId," ",req.file)
                next()
            }
        })
    }
}
app.get('/logged-in', verifyUser, (req, res) => {
    return res.json({ email: req.email, username: req.username, userId: req.userId, file: req.file })
})

/* Loggedin or not Process */



/* Uploading Video */

app.post('/upload-video/:title/-/:description/-/:profile', verifyUser, upload.single('file'), (req, res) => {
    const title = req.params.title;
    const description = req.params.description;
    const userId = req.userId;
    const username = req.username;
    const email = req.email;
    const profile = req.params.profile
    console.log(title, description, userId, username, email, profile);
    VideoUpload.create({ title: title, description: description, userId: userId, username: username, email: email, profile: profile, file: req.file.filename })
        .then(result => {
            return res.json({ msg: "Video Uploaded Successfuly . . .", msg_type: 'good' })
        })
        .catch(err => {
            return res.json({ msg: 'Uploading Error . . . ', msg_type: 'error' })
        })
})


/* Uploading Video */

/* Get all videos */

app.get('/all-videos', function (req, res) {
    VideoUpload.findAll({
        order: [['updatedAt', 'DESC']]
    })
        .then(posts => { return res.json(posts) })
        .catch(err => console.log(err))
})


app.get('/read-post/:id', (req, res) => {
    const id = req.params.id
    // const videoName = req.params.videoName
    // console.log(id, videoName)
    // PostModel.findById({ id: id }) findById is not for sequilize
    VideoUpload.findByPk(id)
        .then(result => { return res.json(result) })
        .catch(err => console.log(err))
})

/* Get all videos */

/* Post Comments and Likes */

app.post('/comment', verifyUser, function (req, res) {
    const like = req.body.liked
    const comment = req.body.comment
    const vid = req.body.videoId
    const title = req.body.title
    const file = req.body.file
    const email = req.body.email
    const username = req.body.username
    const profile = req.body.profile
    console.log(like, " ", comment, " ", vid, " ", title, " ", file, " ", username, " ", profile)
    LikeComment.create({ cmntUserEmail: email, file: file, vid: vid, title: title, comment: comment, watched: true, liked: like, username: username, profile: profile })
        .then(result => {
            // console.log(result)
            return res.json({ msg: 'Comment Posted . . . ', msg_type: "good" })
        })
        .catch(err => {
            console.log(err)
            return res.json({ msg: 'Error Occured . . . ', msg_type: "error" })
        })
})

app.post('/likes', verifyUser, function (req, res) {
    const liked = req.body.liked;
    const disliked = req.body.disliked;
    const email = req.email;
    console.log(liked, " ", disliked, " ", email)
    // Update all records with the specified cmntUserEmail
    LikeComment.update({ liked: liked, disliked: disliked }, { where: { cmntUserEmail: email } })
        .then((result) => {
            if (result[0] > 0) {
                // At least one record was updated
                console.log(`${result[0]} records updated for email: ${email}`);
                // res.status(200).json({ message: 'Comments updated successfully' });
            } else {
                // No records were updated, user not found
                console.log("user not found")
                // res.status(404).json({ error: 'User not found' });
            }
        })
        .catch(error => {
            console.error('Error:', error);
            // res.status(500).json({ error: 'Internal Server Error' });
        });
});


app.get('/all-comments', function (req, res) {
    LikeComment.findAll({
        order: [['updatedAt', 'DESC']]
    })
        .then(comments => { return res.json(comments) })
        .catch(err => console.log(err))
})

/* Post Comments and Likes */


/* Logout System */

app.get('/logout', (req, res) => {
    res.clearCookie('token')
    console.log("Called")
    return res.json({ msg: "Logout Successful . . .", msg_type: "good" })
})

/* Logout System */

/* Update Video Details */

app.put('/edit-video/:vid', (req, res) => {
    const vid = req.params.vid
    VideoUpload.update({ title: req.body.title, description: req.body.description }, { where: { vid: vid } })
        .then(result => {
            console.log(result)
            return res.json({ msg: "Update Successful . . .", msg_type: "good" })
        })
        .catch(err => console.log(err))
})


/* Update Video Details */



/* Deleting Video */

app.delete('/delete-video/:vid', (req, res) => {
    VideoUpload.destroy({ where: { vid: req.params.vid } })
        .then(result => {
            return res.json({ msg: "Deleted Successfuly . . . ", msg_type: "good" })
        })
        .catch(err => {
            console.log(err)
            return res.json({ msg: "Can not Delete the video ", msg_type: 'error' })
        })
})

/* Deleting Video */

app.listen(port, () => {
    console.log(`Server started at ${port}`);
});
