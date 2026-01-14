import express from 'express';
import serverless from 'serverless-http';
import cors from 'cors';
import dotenv from 'dotenv';
import { db } from '../../db.js';

/* =========================
   ENV
========================= */
dotenv.config();

/* =========================
   APP
========================= */
const app = express();

app.use(cors());
app.use(express.json());

/* =========================
   ROOT (health check)
========================= */
app.get('/', (req, res) => {
  res.json({ status: 'API running on Netlify' });
});

/* =========================
   GET reports
========================= */
app.get('/reports', async (req, res) => {
  try {
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
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

/* =========================
   POST report
========================= */
app.post('/reports', async (req, res) => {
  try {
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
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create report' });
  }
});

/* =========================
   EXPORT FOR NETLIFY
========================= */
export const handler = serverless(app);
