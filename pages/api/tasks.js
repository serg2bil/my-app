import { createPool } from '@vercel/postgres';

// Создаем пул подключений к базе данных
const pool = createPool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Функция для создания таблицы задач
async function createTasksTable() {
  try {
    // Создаем таблицу задач, если ее нет
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        user_id INTEGER,
        title TEXT,
        is_done BOOLEAN DEFAULT FALSE,
        date DATE
      )
    `);
  } catch (error) {
    console.error("Error creating tasks table:", error.message);
    throw error;
  }
}

// Вызываем функцию для создания таблицы задач
createTasksTable();

// Экспортируем функцию-обработчик
export default async function handler(req, res) {
  try {
    switch (req.method) {
      case 'GET':
        await getTasks(req, res);
        break;
      case 'POST':
        await addTask(req, res);
        break;
      case 'PUT':
        await updateTask(req, res);
        break;
      case 'PATCH':
        await updateTaskStatus(req, res);
        break;
      case 'DELETE':
        await deleteTask(req, res);
        break;
      default:
        console.log('Unsupported HTTP method');
    }
  } catch (error) {
    console.error("Internal Server Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Функция для получения задач
async function getTasks(req, res) {
  try {
    const { user_id } = req.query;
    const result = await pool.query('SELECT id, title AS text, is_done AS done, date FROM tasks WHERE user_id = $1', [user_id]);
    const rows = result.rows;

    const data = {};
    rows.forEach(row => {
      if (!data[row.date]) {
        data[row.date] = [];
      }
      data[row.date].push({
        id: row.id,
        text: row.text,
        done: row.done
      });
    });

    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching tasks:", error.message);
    res.status(500).json({ error: "Error fetching tasks" });
  }
}

// Функция для добавления задачи
async function addTask(req, res) {
  try {
    const { text, date, user_id } = req.body;
    await pool.query('INSERT INTO tasks (user_id, title, is_done, date) VALUES ($1, $2, $3, $4)', [user_id, text, false, date]);
    res.status(200).json({ message: "Done" });
  } catch (error) {
    console.error("Error adding task:", error.message);
    res.status(500).json({ error: "Error adding task" });
  }
}

// Функция для обновления задачи
async function updateTask(req, res) {
  try {
    const { id, text, date } = req.body;
    const result = await pool.query('UPDATE tasks SET title = $1, date = $2 WHERE id = $3', [text, date, id]);
    if (result.rowCount === 0) {
      res.status(404).json({ error: "Task with specified ID not found" });
    } else {
      res.status(200).json({ message: "Done" });
    }
  } catch (error) {
    console.error("Error updating task:", error.message);
    res.status(500).json({ error: "Error updating task" });
  }
}

// Функция для обновления статуса задачи
async function updateTaskStatus(req, res) {
  try {
    const { id, checked } = req.body;
    const result = await pool.query('UPDATE tasks SET is_done = $1 WHERE id = $2', [checked, id]);
    if (result.rowCount === 0) {
      res.status(404).json({ error: "Task with specified ID not found" });
    } else {
      res.status(200).json({ message: "Done" });
    }
  } catch (error) {
    console.error("Error updating task status:", error.message);
    res.status(500).json({ error: "Error updating task status" });
  }
}

// Функция для удаления задачи
async function deleteTask(req, res) {
  try {
    const { id, user_id } = req.body;
    const result = await pool.query('DELETE FROM tasks WHERE id = $1 AND user_id = $2', [id, user_id]);
    if (result.rowCount === 0) {
      res.status(404).json({ error: "Task with specified ID not found" });
    } else {
      res.status(200).json({ message: "Done" });
    }
  } catch (error) {
    console.error("Error deleting task:", error.message);
    res.status(500).json({ error: "Error deleting task" });
  }
}
