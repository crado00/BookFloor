
import fs from 'fs';
import path from 'path';
import express from 'express';
import User from './models/user';
import axios from 'axios';




const router = express.Router();

// 도서 추천 라우트
router.get('/recommendBooks/:id', async (req, res) => {
  console.log('확인')
  const { id } = req.params
  
  console.log(id)
  try {
    const user = await User.findOne({ where: { username: id } })
    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }
    
    var gender;
    var age_group;

    if(user.gender === 'male'){
      gender = '남성'
    }
    if(user.gender === 'female'){
      gender = '여성'
    }
    const currentYear = new Date().getFullYear();
    const birth = new Date(user.birth_date).getFullYear();
    const age = currentYear - birth;

    if(20 > age && 10 <= age){
      age_group = '10대'
    }
    if(30 > age && 20 <= age){
      age_group = '20대'
    }
    if(40 > age && 30 <= age){
      age_group = '30대'
    }
    if(50 > age && 40 <= age){
      age_group = '40대'
    }
    if(60 > age && 50 <= age){
      age_group = '50대'
    }
    if(60 <= age){
      age_group = '60대이상'
    }
    const response = await axios.post('http://localhost:5000/predict', {
      gender: gender, // 여기에는 실제 사용자 정보를 넣어야 합니다.
      age_group: age_group
    });
    console.log(response.data.predicted_isbns)
  res.json({ response: response.data });

  } catch (error) {
    console.log(error)
  res.json({ error });
}
  
});

export default router;