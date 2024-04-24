import sqlite3 from 'sqlite3';

const path = `pages\\api\\database\\tasks.db`.replace('app.asar', 'app.asar.unpacked');
// Подключаемся к базе данных SQLite
const db = new sqlite3.Database(path, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    console.error("Ошибка при подключении к базе данных:", err.message);
  }
});



export default function handler(req, res) {
  switch (req.method) {
    case 'GET':
      const { arr, user_id } = req.query;
      let result = {};
      

      const processDate = (date) => {
        db.get(
          "SELECT COUNT(*) AS count FROM tasks WHERE user_id = ? AND date = ? AND is_done = 0",
          [user_id, date],
          function (err, row) {
            if (err) {
              console.error("Ошибка при получении невыполненных задач:", err.message);
              res.status(500).json({ error: "Ошибка при получении невыполненных задач" });
            } else {
              result[date] = row.count;

              // Если все даты обработаны, запросим общее количество невыполненных задач для пользователя
              if (Object.keys(result).length === arr.length) {
                db.get(
                  "SELECT COUNT(*) AS total_count FROM tasks WHERE user_id = ? AND is_done = 0",
                  [user_id],
                  function (err, row) {
                    if (err) {
                      console.error("Ошибка при получении общего количества невыполненных задач:", err.message);
                      res.status(500).json({ error: "Ошибка при получении общего количества невыполненных задач" });
                    } else {
                      result.totalCount = row.total_count;
                      
                      // Очистка объекта result перед отправкой результата клиенту
                      res.status(200).json(result);
                      
                      result = {}; // Очищаем объект
                    }
                  }
                );
              }
            }
          }
        );
      };

      // Выполним обработку для каждой даты из массива arr
      arr.forEach((date) => processDate(date));
      break;
  }
}
