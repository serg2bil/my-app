import { createPool } from '@vercel/postgres';

// Создаем пул подключений к базе данных
const pool = createPool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Функция для выполнения запросов к базе данных
async function query(text, params) {
  try {
    const result = await pool.query(text, params);
    return result.rows;
  } catch (error) {
    console.error("Error executing query:", error.message);
    throw error;
  }
}

// Функция для подсчета количества невыполненных задач для указанной даты и пользователя
async function getIncompleteTasksCount(user_id, date) {
  const queryText = 'SELECT COUNT(*) AS count FROM tasks WHERE user_id = $1 AND date = $2 AND is_done = false';
  const result = await query(queryText, [user_id, date]);
  return result[0];
}

// Функция для получения общего количества невыполненных задач для указанного пользователя
async function getTotalIncompleteTasksCount(user_id) {
  const queryText = 'SELECT COUNT(*) AS total_count FROM tasks WHERE user_id = $1 AND is_done = false';
  const result = await query(queryText, [user_id]);
  return result[0];
}

// Экспортируем функцию-обработчик
export default async function handler(req, res) {
  try {
    switch (req.method) {
      case 'GET':
        const { arr, user_id } = req.query;
        let result = {};
        
        // Функция для обработки даты
        const processDate = async (date) => {
          try {
            // Получаем количество невыполненных задач для указанной даты и пользователя
            const { count } = await getIncompleteTasksCount(user_id, date);
            result[date] = count;

            // Если все даты обработаны, запрашиваем общее количество невыполненных задач для пользователя
            if (Object.keys(result).length === arr.length) {
              const { total_count } = await getTotalIncompleteTasksCount(user_id);
              result.totalCount = total_count;
              
              // Отправляем результат клиенту и очищаем объект result
              res.status(200).json(result);
              result = {};
            }
          } catch (error) {
            console.error("Error processing date:", error.message);
            res.status(500).json({ error: "Error processing date" });
          }
        };

        // Выполняем обработку для каждой даты из массива arr
        await Promise.all(arr.map(processDate));
        break;
      default:
        console.log('Unsupported HTTP method');
    }
  } catch (error) {
    console.error("Internal Server Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
