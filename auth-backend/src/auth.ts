import express from 'express';
import multer from 'multer';
import path from 'path';
import jwt from 'jsonwebtoken';
import User from './models/user';
import fs from 'fs';

const router = express.Router();
const SECRET_KEY = 'abc123';

const UPLOADS_FOLDER = 'uploads';
if (!fs.existsSync(UPLOADS_FOLDER)) {
  fs.mkdirSync(UPLOADS_FOLDER);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOADS_FOLDER);
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

router.post('/update-profile', upload.single('profileImage'), async (req, res) => {
  console.log('확인')
  const { name, userId, libCode } = req.body;
  console.log("값: " + name+"/"+"/"+userId+"/"+libCode)
  try {
    
    const user = await User.findOne({ where: { username: userId } });

    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }
    if (req.file) {
      // req.file이 존재할 때만 imageUri를 업데이트
      user.profileImage = req.file.filename;
    }
    if(!name){
      user.name = name || user.name;
    }

    if(!libCode){
      user.libCode = libCode;
    }

    await user.save();
    console.log(user.profileImage); 
    res.json({username: user.name, libCode: user.libCode, imageurl: user.profileImage})
  } catch (error) {
    res.status(500).json({ message: '프로필 업데이트 중에 에러가 발생했습니다.', error });
  }
});

router.post("/post-profile", async (req, res) =>{

})

router.post('/check-username', async (req, res) => {
  const { username } = req.body;
  try {
    const user = await User.findOne({ where: { username } });
    if (user) {
      return res.status(400).json({ message: '이미 존재하는 아이디입니다.' });
    }
    res.status(200).json({ message: '사용 가능한 아이디입니다.' });
  } catch (error) {
    res.status(500).json({ message: '중복 확인 중에 에러가 발생했습니다.', error });
  }
});

router.post('/register', async (req, res) => {
  const { username, password, name, email, birth_date, gender } = req.body;

  try {
    const newUser = await User.create({
      username,
      password: password,
      name,
      email,
      birth_date,
      gender,
    });

    res.status(201).json({ message: '회원가입에 성공하였습니다!' });
  } catch (error) {
    res.status(500).json({ message: '회원가입 중에 에러가 발생했습니다.', error });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    if (password !== user.password) {
      return res.status(401).json({ message: '올바르지 않은 비밀번호입니다.' });
    }

    const token = jwt.sign({ id: user.id }, SECRET_KEY, {
      expiresIn: '1h',
    });
    res.json({ token, userId: user.id, username: user.name, profileImage: user.profileImage, libCode: user.libCode });
  } catch (error) {
    res.status(500).json({ message: '로그인 중에 에러가 발생했습니다.', error });
  }
});

router.post('/logout', async (req, res) => {
  try {
    res.status(200).json({ message: '로그아웃에 성공하였습니다.' });
  } catch (error) {
    res.status(500).json({ message: '로그아웃 중에 에러가 발생했습니다.', error });
  }
});

router.post('/delete-account', async (req, res) => {
  const { username } = req.body;

  try {
    const user = await User.findOne({ where: { username: username } });

    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    await user.destroy();
    res.status(200).json({ message: '회원탈퇴에 성공하였습니다.' });
  } catch (error) {
    res.status(500).json({ message: '회원탈퇴 중에 에러가 발생했습니다.', error });
  }
});

export default router;
