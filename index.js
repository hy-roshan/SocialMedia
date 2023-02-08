import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import multer from 'multer';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import colors from 'colors';
import { register } from './controllers/auth.js';
import { createPost } from './controllers/posts.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import postRoutes from './routes/posts.js';
import verifyToken from './middleware/auth.js';
import User from './models/User.js';
import Post from './models/Post.js';
import { users, posts } from './data/index.js';

// Configurations
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(morgan('common'));
app.use(bodyParser.json({ limit: '30mb', extended: 'true' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '30mb' }));
app.use(cors());
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));

// File Storage

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/assets');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

//Writing single route here as it needs multer upload functionality

app.post('/auth/register', upload.single('picture'), register);

app.post('/posts', verifyToken, upload.single('picture'), createPost);

// Mounting routers

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/posts', postRoutes);

//Mongoose : Connecting to database

const PORT = process.env.PORT || 5000;
mongoose
  .set('strictQuery', true)
  .connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(PORT, () =>
      console.log(`Server is up and running on port ${PORT}`.yellow)
    );

    //Run only Once

    // User.insertMany(users);
    // Post.insertMany(posts);
  })
  .catch((err) => console.log(err));
