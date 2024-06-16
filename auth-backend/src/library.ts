import express from 'express';
import multer from 'multer';
import path from 'path';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import bodyParser from 'body-parser';
import library from './models/library';
import { Op } from 'sequelize';
import e from 'express';
import axios from 'axios';

const router = express.Router();

const API_KEY = 'faf460c70f6b5b9163c4fb0b97d3cfc5ea649d7319099d1c7568b8d076a2131f';


router.post('/search', async (req, res) => {
    const { name } = req.body;
    console.log('서치')
    try {
        const lib = await library.findAll({
            where: { 
                LIBRARY_NAME: { 
                  [Op.like]: '%' + name + '%' 
                } 
              }
        })
        if (!lib){
            return res.status(404).json({ message: '도서관 정보가 없습니다.'})
        }else{
            return res.status(200).send(lib)
        }


    } catch (error) {
        console.log(error)
    }
})

router.get('/libraries/:latitude/:longitude/:latitude_delta/:longitude_delta', async (req, res) =>{
    console.log('근처 도서관')
  const { latitude, longitude, latitude_delta, longitude_delta } = req.params;
  const latitudeMin = parseFloat(latitude) - parseFloat(latitude_delta);
  const latitudeMax = parseFloat(latitude) + parseFloat(latitude_delta);
  const longitudeMin = parseFloat(longitude) - parseFloat(longitude_delta);
  const longitudeMax = parseFloat(longitude) + parseFloat(longitude_delta);
    try {
        const lib = await library.findAll({
            where: {
                LATITUDE:{
                    [Op.between]: [latitudeMin, latitudeMax]
                },
                LONGITUDE: {
                    [Op.between]: [longitudeMin, longitudeMax]
                  }
            }
        })
        if (!lib){
            return res.status(404).json({ message: '도서관 정보가 없습니다.'})
        }else{
            return res.status(200).send(lib)
        }
    } catch (error) {
        console.log(error)
    }
})

router.get('/find', async (req, res) =>{
    console.log("확인")

   
    try {
        const { latitude, longitude, latitude_delta, longitude_delta, isbn13} = req.query;

        const latitudeMin = Number(latitude) - Number(latitude_delta);
        const latitudeMax = Number(latitude) + Number(latitude_delta);
        const longitudeMin = Number(longitude) - Number(longitude_delta);
        const longitudeMax = Number(longitude) + Number(longitude_delta);

        const lib = await library.findAll({
            where: {
                LATITUDE:{
                    [Op.between]: [latitudeMin, latitudeMax]
                },
                LONGITUDE: {
                    [Op.between]: [longitudeMin, longitudeMax]
                  }
            }
        })

        const results = [];

        for(const libs of lib){
            const apiUrl = `http://data4library.kr/api/itemSrch?authKey=${API_KEY}&libCode=${libs.LBRRY_CD}&type=ALL&isbn13=${isbn13}&pageNo=1&pageSize=10&format=json`;
            const response = await axios.get(apiUrl);
            const data = response.data;
            if (data && data.response.request.libCode) {
                
                const libdata = await library.findAll({
                    where:{
                        LBRRY_CD: data.response.request.libCode
                    }
                })
                results.push(libdata)
              }
        }
        res.json(results);

    } catch (error) {
        console.log(error)
    }
})

router.get('/popular-book/:libraryCode', async (req, res) =>{
    console.log("사용자 도서관 추천 검색")
    const { libraryCode } = req.params;
    console.log("확인")
    if(!libraryCode) {
        return res.status(400).json({ error: 'Library code is required' });
    }

    const apiUrl = `https://data4library.kr/api/loanItemSrchByLib?authKey=faf460c70f6b5b9163c4fb0b97d3cfc5ea649d7319099d1c7568b8d076a2131f&libCode=${libraryCode}&pageSize=10&format=json`;
    
    try {
        const response = await axios.get(apiUrl);
        const books = response.data.response.docs; // API 응답에서 도서 목록을 가져옴
        res.json(books); // 클라이언트로 도서 목록을 전송
    } catch (error) {
        console.error("Error fetching popular books:", error);
        res.status(500).json({ error: 'Failed to fetch popular books' });
    }
})
export default router