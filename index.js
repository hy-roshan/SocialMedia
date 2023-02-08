import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import multer from 'multer';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import colors from 'colors';

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

//Mongoose : Connecting to database

const PORT = process.env.PORT || 5000;
mongoose
  .set('strictQuery', true)
  .connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(PORT, () =>
      console.log(`Server is up and running on port ${PORT}`.yellow)
    );
  })
  .catch((err) => console.log(err));
