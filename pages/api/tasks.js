// const sqlite3 = require("sqlite3").verbose();

// const db = new sqlite3.Database(`./db/tasks.db`, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
//   if (err) {
//       console.error("Ошибка при подключении к базе данных:", err.message);
//     }
//   });



import { open } from "sqlite";

import sqlite3 from "sqlite3";
const db = await open({
  filename: "./db/tasks.db",
  driver: sqlite3.Database,
});


// Создаем таблицу задач при запуске сервера, если ее нет
db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, title TEXT, is_done BOOLEAN DEFAULT 0, date DATE)"); // Создаем таблицу задач, если ее нет.
});

export default function handler(req, res) {

  switch (req.method) {
    case 'GET':
      getTasks(req, res);
      break;
    case 'POST':
      addTask(req, res);
      break;
    case 'PUT':
      updateTask(req, res);
      break;
    case 'PATCH':
      updateTaskStatus(req, res);
      break;
    case 'DELETE':
      deleteTask(req, res);
      break;
    default:
      console.log('Unsupported HTTP method');
  }
}

function getTasks(req, res) {
  var { user_id } = req.query;

  db.all("SELECT id, title AS text, is_done AS done, date FROM tasks WHERE user_id = ?", [user_id], function (err, rows) {
    if (err) {
      console.error("Ошибка при получении задач:", err.message);
      res.status(500).json({ error: "Ошибка при получении задач" });
    } else {

      const data = {};
      rows.forEach(row => {
        if (!data[row.date]) {
          data[row.date] = [];
        }
        data[row.date].push({
          id: row.id,
          text: row.text,
          done: row.done === 1
        });
      });


      res.status(200).json(data);
    }
  });
}

function addTask(req, res) {
  var { text, date, user_id } = req.body;
  db.run("INSERT INTO tasks (user_id, title, is_done, date) VALUES (?, ?, ?, ?)", [user_id, text, false, date], function (err) {
    if (err) {
      console.error("Ошибка при добавлении задачи:", err.message);
      res.status(500).json({ error: "Error" });
    } else {
      res.status(200).json({ message: "Done", });
    }
  });
}

function updateTask(req, res) {
  var { id, text, date } = req.body;

  db.run("UPDATE tasks SET title = ?, date = ? WHERE id = ?", [text, date, id], function (err) {
    if (err) {
      console.error("Ошибка при обновлении задачи:", err.message);
      res.status(500).json({ error: "Ошибка при обновлении задачи" });
    } else {
      if (this.changes === 0) {
        res.status(404).json({ error: "Задача с указанным ID не найдена" });
      } else {
        res.status(200).json({ message: "Done" });
      }
    }
  });
}

function updateTaskStatus(req, res) {
  var { id, checked } = req.body;

  db.run("UPDATE tasks SET is_done = ? WHERE id = ?", [checked, id], function (err) {
    if (err) {
      console.error("Ошибка при обновлении статуса задачи:", err.message);
      res.status(500).json({ error: "Ошибка при обновлении статуса задачи" });
    } else {
      if (this.changes === 0) {
        res.status(404).json({ error: "Задача с указанным ID не найдена" });
      } else {
        res.status(200).json({ message: "Done" });
      }
    }
  });
}

function deleteTask(req, res) {
  const { id, user_id } = req.body;

  db.run("DELETE FROM tasks WHERE id = ? AND user_id = ?", [id, user_id], function (err) {
    if (err) {
      console.error("Ошибка при удалении задачи:", err.message);
      res.status(500).json({ error: "Ошибка при удалении задачи" });
    } else {
      if (this.changes === 0) {
        res.status(404).json({ error: "Задача с указанным ID не найдена" });
      } else {

        res.status(200).json({ message: "Done" });
      }
    }
  });
}
