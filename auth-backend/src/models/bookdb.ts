/*import express from "express";

const router = express.Router();

router.post('/saveSelectedWords', async (req, res) =>{
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
  
      // 쿼리 실행
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
})*/