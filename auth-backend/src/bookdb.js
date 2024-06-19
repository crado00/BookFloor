const express = require('express');
const axios = require('axios');
const mysql = require('mysql2/promise');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// 데이터베이스 연결 설정
const pool = mysql.createPool({
  user: 'root',
  host: 'localhost',
  database: 'maru3',
  password: 'a123',
  port: 3308,
});

const PORT = process.env.PORT || 3000; // 포트 설정, 환경 변수가 설정되어 있지 않으면 기본값으로 3000 사용

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

//데이터 베이스 조회
app.post('/saveSelectedWords', async (req, res) => {
    const { a, b } = req.body;
    console.log('받은 데이터:', { a, b });
    try {
      const query = `
        WITH class_distribution AS (
            SELECT class_no,
                   ROW_NUMBER() OVER (ORDER BY class_no) AS row_num,
                   COUNT(*) OVER () AS total_count
            FROM (
                SELECT DISTINCT class_no
                FROM booklist_141263
                WHERE class_no BETWEEN ? AND ?
            ) AS distinct_class_no
        ),
        latest_record AS (
            SELECT * 
            FROM booklist_141263 
            WHERE class_no BETWEEN ? AND ? 
            ORDER BY checkout DESC 
            LIMIT 1
        )
        SELECT 
          latest.isbn13,
          CASE
              WHEN dist.row_num <= dist.total_count / 4 THEN '1/4 지점 이하'
              WHEN dist.row_num <= dist.total_count / 2 THEN '2/4 지점 이하'
              WHEN dist.row_num <= 3 * dist.total_count / 4 THEN '3/4 지점 이하'
              ELSE '4/4 지점 이하'
          END AS class_no_position
      FROM latest_record latest
      JOIN class_distribution dist ON latest.class_no = dist.class_no;
    `;
  
      //쿼리 결과
      console.log('Executing query...');
      const [results] = await pool.execute(query, [a, b, a, b]);
      console.log('Query result:', results);

      if (results.length > 0) {
        const response = results[0];
        res.json({
          isbn13: response.isbn13,
          bookPosition: response.class_no_position, 
        });
      } else {
        res.json({
          isbn13: null,
          bookPosition: null, 
        });
      }
    } catch (error) {
      console.error('Database operation error:', error);
      res.status(500).json({ message: 'Database operation error', error });
    }
});


app.post('/savetitleSearch', async (req, res) => {
  const { a, b, isbn13 } = req.body;
  console.log('받은 데이터:', {a, b, isbn13});
  try {
    const query = `
        WITH class_distribution AS (
            SELECT class_no,
                   ROW_NUMBER() OVER (ORDER BY class_no) AS row_num,
           COUNT(*) OVER () AS total_count
          FROM (
              SELECT DISTINCT class_no
              FROM booklist_141263
              WHERE class_no BETWEEN ? AND ?
            ) AS distinct_class_no
          ),
        isbn_class AS (
          SELECT class_no
          FROM booklist_141263
          WHERE isbn13 = ?
        ),
        class_position AS (
          SELECT 
            cd.class_no,
            cd.row_num,
            cd.total_count,
            CASE
              WHEN cd.row_num <= cd.total_count / 4 THEN '1/4 지점 이하'
              WHEN cd.row_num <= cd.total_count / 2 THEN '2/4 지점 이하'
              WHEN cd.row_num <= 3 * cd.total_count / 4 THEN '3/4 지점 이하'
              ELSE '4/4 지점 이하'
            END AS class_no_position
          FROM class_distribution cd
          JOIN isbn_class ic ON cd.class_no = ic.class_no
        )
      SELECT class_no, class_no_position
      FROM class_position;
    `;
    console.log('Executing query...');
    const [results] = await pool.execute(query, [a, b, isbn13]);
    console.log('Query result:', results);

    if (results.length > 0) {
      const response = results[0];
      res.json({
        class_no_position: response.class_no_position,
      });
    } else {
      res.json({
        class_no_position: null,
      });
    }
  } catch (error) {
    console.error('Database operation error:', error);
    res.status(500).json({ message: 'Database operation error', error });
  }
});