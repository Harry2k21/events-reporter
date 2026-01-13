import express from 'express';
import cors from 'cors';
import { db } from './db.js';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Server is running');
});

/* ------------------------
   GET reports
------------------------- */
app.get('/reports', async (req, res) => {
  const { type } = req.query;

  const sql =
    type && type !== 'all'
      ? 'SELECT * FROM reports WHERE type = ? ORDER BY created_at DESC'
      : 'SELECT * FROM reports ORDER BY created_at DESC';

  const result = await db.execute({
    sql,
    args: type && type !== 'all' ? [type] : []
  });

  res.json(result.rows);
});

/* ------------------------
   POST report
------------------------- */
app.post('/reports', async (req, res) => {
  const r = req.body;

  await db.execute({
    sql: `
      INSERT INTO reports
      (id, type, type_name, specific, location, date, description, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
    args: [
      r.id,
      r.type,
      r.typeName,
      r.specific,
      r.location,
      r.date,
      r.description,
      new Date().toISOString()
    ]
  });

  res.status(201).json({ success: true });
});

app.listen(PORT, () => {
  console.log(`✅ API running at http://localhost:${PORT}`);
});
