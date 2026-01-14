import { db } from '../../db.js'

export async function handler(event) {
  try {
    const type = event.queryStringParameters?.type || 'all'

    let query = 'SELECT * FROM reports'
    let args = []

    if (type !== 'all') {
      query += ' WHERE type = ?'
      args.push(type)
    }

    const result = await db.execute({
      sql: query,
      args
    })

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(result.rows)
    }
  } catch (err) {
    console.error(err)

    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'DB error' })
    }
  }
}
