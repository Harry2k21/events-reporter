import { db } from '../../db.js';

export async function handler(event) {
  try {
    const r = JSON.parse(event.body);

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

    return {
      statusCode: 201,
      body: JSON.stringify({ success: true })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
}
