// index.ts 파일의 일부분

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import sequelize from './database';
import User from './models/user';
import authRoutes from './auth';
import library from './library';
import path from 'path';
import ai from './ai';
import ocr from'./ocr';
const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/ai', ai);
app.use('/api', authRoutes);
app.use('/library', library);
app.use('/ocr', ocr);

sequelize.sync()
  .then(() => {
    console.log('Database & tables created!');
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });
