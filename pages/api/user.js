import { Client } from '@vercel/postgres';

// Создаем подключение к базе данных
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Подключаемся к базе данных
await client.connect();

// Создаем таблицу users, если она не существует
await client.query(`
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    first_name TEXT,
    last_name TEXT,
    email TEXT,
    password TEXT
  )
`);

// Функция для добавления нового пользователя
async function addUser(data) {
  try {
    // Проверяем существование пользователя
    const existingUser = await client.query('SELECT id FROM users WHERE email = $1', [data.email]);
    if (existingUser.rows.length > 0) {
      return { error: "User with this email already exists" };
    }

    // Добавляем нового пользователя
    const result = await client.query('INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING id', [
      data.firstName,
      data.lastName,
      data.email,
      data.password,
    ]);

    const userId = result.rows[0].id;
    return { message: "Data inserted successfully", user_id: userId };
  } catch (error) {
    console.error("Error inserting data:", error.message);
    throw new Error("Internal Server Error");
  }
}

// Функция для аутентификации пользователя
async function getUser(email, password) {
  try {
    // Ищем пользователя по email
    const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      return { login_message: "User not found" };
    }

    // Проверяем пароль
    if (user.password === password) {
      return { user_id: user.id };
    } else {
      return { login_message: "Incorrect password or email" };
    }
  } catch (error) {
    console.error("Error querying data:", error.message);
    throw new Error("Internal Server Error");
  }
}

// Экспортируем функцию-обработчик
export default async function handler(req, res) {
  try {
    switch (req.method) {
      case 'POST':
        if (req.query.q === 'login') {
          const { email, password } = req.body;
          const result = await getUser(email, password);
          res.status(200).json(result);
        } else {
          const result = await addUser(req.body);
          res.status(200).json(result);
        }
        break;
      default:
        res.status(405).json({ error: 'Method Not Allowed' });
    }
  } catch (error) {
    console.error("Internal Server Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
